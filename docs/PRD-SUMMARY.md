# Agent Framework - PRD Summary

> **For full details, see milestone-specific docs: PRD-M1-MVP.md, PRD-M2-MCP.md, PRD-M3-A2A.md, PRD-M4-CANVAS.md**

## Vision

Build a **highly configurable Agentic Application Platform** using:
- CopilotKit UI (AG-UI protocol)
- Google ADK as the agentic framework
- MCP for external tool integration
- A2A for multi-agent orchestration

## Core Technologies

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14+, CopilotKit, React Flow |
| Backend | FastAPI, Python 3.13, Google ADK |
| Tools | MCP (Model Context Protocol) |
| Multi-Agent | A2A (Agent-to-Agent) |
| Database | PostgreSQL, Redis |
| Auth | Auth0 |
| Package Managers | `bun` (frontend), `uv` (backend) |

## Multi-Model Support

| Provider | Examples |
|----------|----------|
| Gemini (default) | gemini-2.5-flash, gemini-2.5-pro |
| OpenAI | openai/gpt-4o |
| Anthropic | anthropic/claude-3-haiku |
| Ollama (local) | ollama_chat/llama3.2 |

## Milestones

### M1: MVP (2 weeks)
- Basic orchestrator agent
- Embedded CopilotChat interface
- Shared state management
- **See: PRD-M1-MVP.md**

### M2: MCP Integration (1.5 weeks)
- MCP server management
- Dynamic tool loading
- Tool execution through orchestrator
- **See: PRD-M2-MCP.md**

### M3: A2A Integration (1.5 weeks)
- A2A middleware setup
- Research/Analysis sub-agents
- Orchestrator routing logic
- **See: PRD-M3-A2A.md**

### M4: Canvas (2 weeks)
- Visual workflow designer (React Flow)
- All ADK patterns (Sequential, Parallel, Loop)
- Workflow compilation to Python code
- **See: PRD-M4-CANVAS.md**

## Key Data Models

```typescript
interface AgentConfig {
  id: string;
  name: string;
  type: 'llm' | 'sequential' | 'parallel' | 'loop' | 'custom';
  modelConfig: ModelConfig;
  description: string;
  instruction: string;
  tools: string[];        // MCP tool IDs
  subAgents: string[];    // Sub-agent IDs
  outputKey?: string;
}

interface OrchestratorState {
  current_task?: string;
  progress: number;
  active_agents: string[];
  mcp_servers: object[];
  a2a_agents: object[];
}
```

## Quick Start

```bash
# Frontend
cd ui && bun install && bun dev

# Backend
cd agent && uv sync && uv run uvicorn main:app --reload
```
