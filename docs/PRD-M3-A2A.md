# Milestone 3: A2A Integration

> **Duration:** 1.5 weeks
> **Goal:** Multi-agent coordination with A2A protocol
> **Depends on:** Milestone 1 (MVP)

## Overview

Implement A2A (Agent-to-Agent) communication:
- Register and discover external agents
- Route tasks to specialized sub-agents
- Aggregate results from multiple agents
- Configuration UI for managing agents

## Data Models

### A2AAgentConfig

```typescript
interface A2AAgentConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  framework: 'adk' | 'langgraph' | 'crewai' | 'custom';
  capabilities: string[];
  enabled: boolean;
  status: 'online' | 'offline' | 'unknown';
}

interface AgentCard {
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities: string[];
  framework: string;
}
```

### Python Models

```python
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class AgentFramework(str, Enum):
    ADK = "adk"
    LANGGRAPH = "langgraph"
    CREWAI = "crewai"
    CUSTOM = "custom"

class AgentStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    UNKNOWN = "unknown"

class A2AAgentConfig(BaseModel):
    id: str
    name: str
    description: str
    url: str
    framework: AgentFramework = AgentFramework.ADK
    capabilities: List[str] = []
    enabled: bool = True
    status: AgentStatus = AgentStatus.UNKNOWN

class AgentCard(BaseModel):
    name: str
    description: str
    url: str
    version: str = "1.0.0"
    capabilities: List[str]
    framework: str = "adk"
```

## Backend Implementation

### Directory Structure (New Files)

```
agent/
├── a2a/
│   ├── __init__.py
│   ├── middleware.py     # A2AMiddlewareAgent setup
│   ├── registry.py       # Agent registry & discovery
│   ├── client.py         # A2A HTTP client
│   └── models.py         # A2A data models
├── agents/
│   ├── research.py       # Research sub-agent
│   └── analysis.py       # Analysis sub-agent
└── tests/
    └── unit/
        └── test_a2a.py
```

### A2A Registry

```python
# agent/a2a/registry.py
import httpx
from typing import Dict, Optional, List

class A2ARegistry:
    def __init__(self):
        self.agents: Dict[str, A2AAgentConfig] = {}

    async def discover_agent(self, url: str) -> A2AAgentConfig:
        """Discover agent via /.well-known/agent.json"""
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{url}/.well-known/agent.json")
            card = AgentCard(**resp.json())

            config = A2AAgentConfig(
                id=card.name,
                name=card.name,
                description=card.description,
                url=url,
                framework=card.framework,
                capabilities=card.capabilities,
                status=AgentStatus.ONLINE
            )

            self.agents[config.id] = config
            return config

    async def register_agent(self, config: A2AAgentConfig):
        """Manually register an agent."""
        self.agents[config.id] = config

    async def health_check(self, agent_id: str) -> bool:
        """Check if agent is online."""
        agent = self.agents.get(agent_id)
        if not agent:
            return False

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(f"{agent.url}/health")
                is_healthy = resp.status_code == 200
                agent.status = AgentStatus.ONLINE if is_healthy else AgentStatus.OFFLINE
                return is_healthy
        except Exception:
            agent.status = AgentStatus.OFFLINE
            return False

    async def health_check_all(self):
        """Check health of all registered agents."""
        for agent_id in self.agents:
            await self.health_check(agent_id)

    def get_agent_urls(self) -> List[str]:
        """Get URLs of all enabled agents."""
        return [
            agent.url for agent in self.agents.values()
            if agent.enabled
        ]

    def get_agent_for_task(self, task_description: str) -> Optional[A2AAgentConfig]:
        """Find best agent for a task based on capabilities."""
        task_lower = task_description.lower()
        for agent in self.agents.values():
            if agent.enabled and any(
                cap.lower() in task_lower
                for cap in agent.capabilities
            ):
                return agent
        return None
```

### A2A Middleware

```python
# agent/a2a/middleware.py
from ag_ui.a2a_middleware import A2AMiddlewareAgent
from google.adk.agents import LlmAgent
from typing import Optional

class A2AOrchestrator:
    def __init__(self, base_agent: LlmAgent, registry: A2ARegistry):
        self.registry = registry
        self.base_agent = base_agent
        self._middleware: Optional[A2AMiddlewareAgent] = None

    def build_middleware(self) -> A2AMiddlewareAgent:
        """Build A2A middleware with current registry."""
        self._middleware = A2AMiddlewareAgent(
            description="Orchestrator with access to specialized agents",
            agent_urls=self.registry.get_agent_urls(),
            orchestration_agent=self.base_agent,
            instructions=self._build_routing_instructions()
        )
        return self._middleware

    def _build_routing_instructions(self) -> str:
        """Build routing instructions from registered agents."""
        agent_list = "\n".join([
            f"- {a.name}: {a.description} (capabilities: {', '.join(a.capabilities)})"
            for a in self.registry.agents.values()
            if a.enabled
        ])

        return f"""
        ROUTING STRATEGY:

        Available A2A Agents:
        {agent_list}

        Instructions:
        1. Analyze the user request
        2. Route to appropriate specialized agent based on capabilities
        3. Synthesize results before presenting to user
        4. Handle agent failures gracefully
        """

    async def route_to_agent(self, agent_name: str, task: str) -> str:
        """Route task to specific A2A agent."""
        agent = self.registry.agents.get(agent_name)
        if not agent:
            raise ValueError(f"Agent '{agent_name}' not found")

        if not agent.enabled:
            raise ValueError(f"Agent '{agent_name}' is disabled")

        # Use A2A client to send task
        from agent.a2a.client import A2AClient
        client = A2AClient(agent.url)
        return await client.send_task(task)
```

### Pre-built Sub-Agents

```python
# agent/agents/research.py
from google.adk.agents import LlmAgent

research_agent = LlmAgent(
    name="research",
    model="gemini-2.5-flash",
    instruction="""
    You are a research specialist agent.

    Your responsibilities:
    1. Gather information from various sources
    2. Summarize findings clearly
    3. Cite sources when available
    4. Identify gaps in available information

    Always provide structured, well-organized responses.
    """,
    description="Research agent for information gathering and summarization",
    output_key="research_results"
)

# agent/agents/analysis.py
from google.adk.agents import LlmAgent

analysis_agent = LlmAgent(
    name="analysis",
    model="gemini-2.5-flash",
    instruction="""
    You are a data analysis specialist agent.

    Your responsibilities:
    1. Analyze data and identify patterns
    2. Provide insights and recommendations
    3. Create clear visualizations (when appropriate)
    4. Highlight key findings and anomalies

    Focus on actionable insights.
    """,
    description="Analysis agent for data processing and insights",
    output_key="analysis_results"
)
```

### A2A Client

```python
# agent/a2a/client.py
import httpx
from typing import Any, Dict

class A2AClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def send_task(self, task: str, context: Dict[str, Any] = None) -> str:
        """Send task to A2A agent."""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/task",
                json={"task": task, "context": context or {}}
            )
            response.raise_for_status()
            return response.json().get("result", "")

    async def get_agent_card(self) -> AgentCard:
        """Get agent card metadata."""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/.well-known/agent.json")
            return AgentCard(**response.json())
```

### Configuration API

```python
# agent/api/a2a.py
from fastapi import APIRouter, HTTPException, Depends

router = APIRouter(prefix="/api/config/a2a-agents")

@router.post("")
async def register_agent(
    config: A2AAgentConfig,
    registry: A2ARegistry = Depends(get_a2a_registry)
):
    """Register a new A2A agent."""
    await registry.register_agent(config)
    return {"status": "registered", "id": config.id}

@router.post("/discover")
async def discover_agent(
    url: str,
    registry: A2ARegistry = Depends(get_a2a_registry)
):
    """Discover and register agent from URL."""
    try:
        config = await registry.discover_agent(url)
        return {"status": "discovered", "agent": config}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("")
async def list_agents(
    registry: A2ARegistry = Depends(get_a2a_registry)
):
    """List all registered A2A agents."""
    return list(registry.agents.values())

@router.post("/{agent_id}/health")
async def check_agent_health(
    agent_id: str,
    registry: A2ARegistry = Depends(get_a2a_registry)
):
    """Check health of an agent."""
    is_healthy = await registry.health_check(agent_id)
    return {"status": "online" if is_healthy else "offline"}

@router.delete("/{agent_id}")
async def remove_agent(
    agent_id: str,
    registry: A2ARegistry = Depends(get_a2a_registry)
):
    """Remove an A2A agent."""
    if agent_id in registry.agents:
        del registry.agents[agent_id]
    return {"status": "removed"}
```

## Frontend Implementation

### New Components

```
ui/components/
├── config/
│   ├── A2APanel.tsx
│   ├── AgentCard.tsx
│   └── AddAgentModal.tsx
```

### A2A Panel

```tsx
// components/config/A2APanel.tsx
import { useState, useEffect } from 'react';
import { AgentCard } from './AgentCard';
import { AddAgentModal } from './AddAgentModal';

interface A2AAgent {
  id: string;
  name: string;
  description: string;
  url: string;
  framework: string;
  capabilities: string[];
  enabled: boolean;
  status: 'online' | 'offline' | 'unknown';
}

export function A2APanel() {
  const [agents, setAgents] = useState<A2AAgent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const res = await fetch('/api/config/a2a-agents');
    setAgents(await res.json());
  };

  const handleDiscover = async (url: string) => {
    await fetch('/api/config/a2a-agents/discover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    fetchAgents();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">A2A Agents</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add Agent
        </button>
      </div>

      <div className="space-y-2">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onRefresh={fetchAgents}
          />
        ))}
      </div>

      {showAddModal && (
        <AddAgentModal
          onDiscover={handleDiscover}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
```

### Agent Card

```tsx
// components/config/AgentCard.tsx
interface AgentCardProps {
  agent: A2AAgent;
  onRefresh: () => void;
}

export function AgentCard({ agent, onRefresh }: AgentCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    unknown: 'bg-gray-500',
  };

  const handleHealthCheck = async () => {
    await fetch(`/api/config/a2a-agents/${agent.id}/health`, {
      method: 'POST',
    });
    onRefresh();
  };

  const handleRemove = async () => {
    await fetch(`/api/config/a2a-agents/${agent.id}`, {
      method: 'DELETE',
    });
    onRefresh();
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
          <span className="font-medium">{agent.name}</span>
          <span className="text-sm text-gray-500">({agent.framework})</span>
        </div>
        <div className="space-x-2">
          <button onClick={handleHealthCheck} className="text-blue-600">
            Check Health
          </button>
          <button onClick={handleRemove} className="text-red-600">
            Remove
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
      <div className="flex gap-1 mt-2">
        {agent.capabilities.map((cap) => (
          <span key={cap} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config/a2a-agents` | POST | Register agent |
| `/api/config/a2a-agents` | GET | List agents |
| `/api/config/a2a-agents/discover` | POST | Discover from URL |
| `/api/config/a2a-agents/:id` | PUT | Update agent |
| `/api/config/a2a-agents/:id` | DELETE | Remove agent |
| `/api/config/a2a-agents/:id/health` | POST | Health check |

## Testing Requirements

### Backend Tests

```python
# tests/unit/test_a2a.py
import pytest
from agent.a2a.registry import A2ARegistry, A2AAgentConfig

@pytest.mark.asyncio
async def test_register_agent():
    registry = A2ARegistry()
    config = A2AAgentConfig(
        id="test-agent",
        name="Test Agent",
        description="A test agent",
        url="http://localhost:9001",
        capabilities=["research", "summarization"]
    )

    await registry.register_agent(config)
    assert "test-agent" in registry.agents

@pytest.mark.asyncio
async def test_get_agent_urls():
    registry = A2ARegistry()
    # ... register agents
    urls = registry.get_agent_urls()
    assert len(urls) > 0
```

## Deliverables Checklist

- [ ] A2ARegistry discovers agents
- [ ] A2ARegistry health checks work
- [ ] A2AMiddleware routes tasks
- [ ] Research agent works
- [ ] Analysis agent works
- [ ] Configuration UI works
- [ ] Agent status displayed correctly
- [ ] Tests pass (80% coverage)
