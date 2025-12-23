# Product Requirements Document: Agent Framework - Getting Started Guide

> **Project Location:** `/Volumes/External/rwxproject/agent-framework`
> **Documentation Format:** Markdown (.md files in /docs folder)
> **Current Phase:** PRD Complete - Ready for Implementation

---

## Executive Summary

Build a **highly configurable Agentic Application Platform** using CopilotKit UI (AG-UI spec), Google ADK as the agentic framework, with comprehensive MCP integration, A2A orchestration patterns, and dynamic agent creation capabilities.

This is a **SaaS Copilot** template that serves as a reference implementation showcasing the full power of the agentic protocol ecosystem.

---

## 1. Project Overview

### 1.1 Vision

Create a production-ready "Agent Builder" application where users can:
- Chat with AI agents through an embedded CopilotChat interface
- Dynamically configure MCP servers and custom tools
- Set up A2A (Agent-to-Agent) communication patterns
- Create and configure their own agents on the fly
- Experience all Human-in-the-Loop (HITL) patterns

### 1.2 Core Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14+ (App Router) | React-based UI framework |
| **UI Components** | CopilotKit React UI | Embedded chat + custom components |
| **Agent Framework** | Google ADK (Python) | Agentic backend with Gemini |
| **Protocol** | AG-UI | Agent-User interaction standard |
| **Tools Protocol** | MCP | External tools and data sources |
| **Multi-Agent** | A2A | Agent-to-Agent coordination |
| **State Management** | CopilotKit Shared State | Bidirectional UI-Agent sync |

### 1.3 Package Managers & Tooling

| Environment | Tool | Purpose |
|-------------|------|---------|
| **Python** | `uv` | Fast Python package manager (replaces pip/poetry) |
| **TypeScript/Node.js** | `bun` | Fast JavaScript runtime & package manager |
| **Python Version** | 3.13+ | Latest Python with performance improvements |

### 1.4 Multi-Model Support

The platform supports multiple LLM providers via Google ADK's LiteLLM integration:

| Provider | Model Examples | Use Case |
|----------|---------------|----------|
| **Google Gemini** | `gemini-2.5-flash`, `gemini-2.5-pro` | Default, cloud-hosted |
| **OpenAI** | `openai/gpt-4o`, `openai/gpt-4-turbo` | Cloud-hosted, GPT models |
| **Anthropic** | `anthropic/claude-3-opus`, `anthropic/claude-3-haiku` | Cloud-hosted, Claude models |
| **Ollama** | `ollama_chat/llama3.2`, `ollama_chat/mistral` | Local/self-hosted, privacy-focused |
| **OpenAI-compatible** | `openai/custom-model` | Any OpenAI-spec API endpoint |

---

## 2. Architecture

### 2.1 High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   CopilotChat   │  │  Config Sidebar │  │  Agent Builder  │  │
│  │   (Embedded)    │  │  (MCP + A2A)    │  │    Interface    │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
│  ┌────────┴────────────────────┴────────────────────┴────────┐  │
│  │              CopilotKit Provider + Runtime                 │  │
│  │         (AG-UI Protocol / Shared State / HITL)            │  │
│  └────────────────────────────┬──────────────────────────────┘  │
└───────────────────────────────┼─────────────────────────────────┘
                                │ AG-UI Events (SSE)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI + Google ADK)                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Orchestrator Agent (Google ADK)             │    │
│  │         - Routes to specialized agents (A2A)            │    │
│  │         - Manages conversation state                     │    │
│  │         - Coordinates MCP tool execution                 │    │
│  └──────────┬─────────────────┬─────────────────┬──────────┘    │
│             │                 │                 │               │
│  ┌──────────▼──────┐ ┌───────▼───────┐ ┌───────▼───────┐       │
│  │  Research Agent │ │ Analysis Agent│ │ Custom Agents │       │
│  │     (A2A)       │ │     (A2A)     │ │   (Dynamic)   │       │
│  └─────────────────┘ └───────────────┘ └───────────────┘       │
│             │                 │                 │               │
│  ┌──────────┴─────────────────┴─────────────────┴──────────┐    │
│  │                    MCP Server Layer                      │    │
│  │    ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │    │
│  │    │ Custom   │  │ Database │  │ External APIs    │     │    │
│  │    │ Tools    │  │ Tools    │  │ (GitHub, Slack)  │     │    │
│  │    └──────────┘  └──────────┘  └──────────────────┘     │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Protocol Flow

```text
User Input → CopilotKit → AG-UI Events → Google ADK Orchestrator
                                              │
                         ┌────────────────────┼────────────────────┐
                         ▼                    ▼                    ▼
                    A2A Agents           MCP Tools           Frontend Tools
                    (sub-agents)         (external)          (HITL/UI)
                         │                    │                    │
                         └────────────────────┼────────────────────┘
                                              ▼
                              AG-UI Response Events → UI Update
```

---

## 3. Feature Requirements

### 3.1 Core Chat Interface (CopilotChat Embedded)

**Components:**

- `CopilotChat` - Full embedded chat interface
- Custom message renderers for agent state
- Tool call visualization with Generative UI
- Real-time streaming responses

**Implementation:**

```tsx
// Core chat setup
<CopilotKit runtimeUrl="/api/copilotkit" agent="orchestrator">
  <CopilotChat
    instructions="You are a configurable AI assistant..."
    labels={{ title: "Agent Framework", initial: "How can I help?" }}
  />
</CopilotKit>
```

### 3.2 Configuration Sidebar

**Sections:**

#### 3.2.1 MCP Configuration Panel

- List connected MCP servers
- Add/remove MCP server connections
- Configure server credentials/URLs
- Test connection functionality
- View available tools per server

**Data Model:**

```typescript
interface MCPServerConfig {
  id: string;
  name: string;
  type: 'stdio' | 'sse' | 'http' | 'websocket';
  url?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  enabled: boolean;
  tools: MCPTool[];
}
```

#### 3.2.2 A2A Agent Configuration Panel

- List available A2A agents
- Configure agent URLs/endpoints
- Set agent descriptions and capabilities
- Enable/disable agents
- View agent status (online/offline)

**Data Model:**

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
```

#### 3.2.3 Enhanced Agent Builder

Full-featured agent creation interface with system prompt, MCP tools, A2A sub-agent connections, and workflow integration.

**Features:**

- System prompt editor (Monaco/CodeMirror with syntax highlighting)
- Agent type selector (LLM, Sequential, Parallel, Loop, Custom)
- MCP tool selector (multi-select from connected servers)
- A2A sub-agent selector (for building agent hierarchies)
- Output key configuration for state management
- Real-time validation
- Deploy agent instantly

**Data Model:**

```typescript
interface ModelConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'custom';
  model: string;           // e.g., "gpt-4o", "claude-3-haiku", "llama3.2"
  baseUrl?: string;        // For custom/Ollama endpoints
  apiKeyEnvVar?: string;   // Environment variable name for API key
}

interface AgentConfig {
  id: string;
  name: string;
  type: 'llm' | 'sequential' | 'parallel' | 'loop' | 'custom';
  modelConfig: ModelConfig;  // Multi-provider model configuration
  description: string;
  instruction: string;      // System prompt
  tools: string[];          // MCP tool IDs
  subAgents: string[];      // Sub-agent IDs for delegation/composition
  outputKey?: string;       // Key for storing output in shared state
  maxIterations?: number;   // For LoopAgent
  stateSchema?: Record<string, any>;
  createdAt: Date;
  isActive: boolean;
}
```

#### 3.2.4 Agent Workflow Canvas

Visual drag-and-drop interface for designing agent workflows using all Google ADK workflow patterns.

**Canvas Features:**

- Drag agents from library onto canvas
- Visual connections between agents (data flow edges)
- Workflow pattern templates (quick-start)
- Real-time workflow validation
- Export workflow as ADK Python code
- Import existing workflows
- Live execution preview

**Canvas Data Models:**

```typescript
interface WorkflowCanvas {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  rootAgentId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowNode {
  id: string;
  type: 'llm' | 'sequential' | 'parallel' | 'loop' | 'condition' | 'custom';
  agentId?: string;           // Reference to AgentConfig (for llm/custom)
  position: { x: number; y: number };
  data: {
    label: string;
    config: Partial<AgentConfig>;
    children?: string[];      // Child node IDs for container nodes
  };
}

interface WorkflowEdge {
  id: string;
  source: string;             // Source node ID
  target: string;             // Target node ID
  sourceHandle?: string;      // For parallel outputs
  targetHandle?: string;
  type: 'default' | 'conditional' | 'loop';
  data?: {
    label?: string;           // e.g., "success", "failure"
    condition?: string;       // For conditional routing
    outputKey?: string;       // State key passed along edge
  };
}
```

**Supported ADK Workflow Patterns:**

| Pattern | Description | Canvas Representation |
|---------|-------------|----------------------|
| **Sequential** | Agents execute one after another | Vertical chain of nodes |
| **Parallel** | Agents execute concurrently | Horizontal split/merge |
| **Fan-out/Gather** | Parallel + synthesis | Diamond pattern |
| **Loop** | Iterative execution | Circular arrow indicator |
| **Conditional** | Branch based on state | Diamond decision node |
| **Hierarchical** | Parent delegates to children | Nested container |

#### 3.2.5 Model Provider Configuration

**Features:**

- List configured LLM providers
- Add/edit provider connections
- Test provider connectivity
- Set default provider for new agents

**Provider Configuration UI:**

- Provider type selector (Gemini, OpenAI, Anthropic, Ollama, Custom)
- API key input (stored securely)
- Base URL configuration (for Ollama/custom)
- Model availability check

**Data Model:**

```typescript
interface ProviderConfig {
  id: string;
  type: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'custom';
  name: string;
  baseUrl?: string;
  apiKeyEnvVar: string;
  availableModels: string[];
  isDefault: boolean;
  enabled: boolean;
}
```

### 3.3 Human-in-the-Loop (HITL) Patterns

**All patterns to implement:**

#### 3.3.1 Approval Workflows

```tsx
useHumanInTheLoop({
  name: "approveAction",
  description: "Request user approval before executing sensitive actions",
  parameters: [
    { name: "action", type: "string", description: "Action to approve" },
    { name: "risk_level", type: "string", description: "Risk assessment" }
  ],
  render: ({ args, respond }) => (
    <ApprovalDialog
      action={args.action}
      risk={args.risk_level}
      onApprove={() => respond({ approved: true })}
      onReject={() => respond({ approved: false })}
    />
  )
});
```

#### 3.3.2 User Input Collection

```tsx
useHumanInTheLoop({
  name: "collectUserInput",
  description: "Collect structured data from user",
  parameters: [
    { name: "fields", type: "object[]", description: "Fields to collect" }
  ],
  render: ({ args, respond }) => (
    <DynamicForm fields={args.fields} onSubmit={respond} />
  )
});
```

#### 3.3.3 Option Selection

```tsx
useHumanInTheLoop({
  name: "selectOption",
  description: "Present options for user to choose",
  parameters: [
    { name: "options", type: "object[]", description: "Available options" }
  ],
  render: ({ args, respond }) => (
    <OptionSelector options={args.options} onSelect={respond} />
  )
});
```

### 3.4 Generative UI Components

**State Rendering:**

```tsx
useCoAgentStateRender({
  name: "orchestrator",
  render: ({ state, status }) => (
    <AgentStateDisplay
      currentTask={state.current_task}
      progress={state.progress}
      activeAgents={state.active_agents}
      status={status}
    />
  )
});
```

**Tool Call Rendering:**

```tsx
useRenderToolCall({
  name: "search_database",
  render: ({ args, result, status }) => (
    <DatabaseSearchCard
      query={args.query}
      results={result}
      loading={status === 'executing'}
    />
  )
});
```

### 3.5 Shared State Management

**Frontend State:**

```tsx
const { state, setState } = useCoAgent<OrchestratorState>({
  name: "orchestrator"
});

// Update state from UI
setState({
  ...state,
  user_preferences: newPreferences,
  active_tools: selectedTools
});
```

**Backend State (Python):**

```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class OrchestratorState(BaseModel):
    current_task: Optional[str] = None
    progress: float = 0.0
    active_agents: List[str] = []
    mcp_servers: List[Dict] = []
    a2a_agents: List[Dict] = []
    user_preferences: Dict = {}
    conversation_context: Dict = {}
```

---

## 4. Google ADK Implementation

### 4.1 Orchestrator Agent

```python
from google.adk.agents import LlmAgent
from google.adk.tools import ToolContext
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint

# Orchestrator that coordinates sub-agents
orchestrator = LlmAgent(
    name="orchestrator",
    model="gemini-2.5-flash",
    instruction="""
    You are an orchestrating agent that coordinates specialized sub-agents.

    Available A2A Agents:
    - Research Agent: Gathers and summarizes information
    - Analysis Agent: Analyzes data and provides insights
    - Custom Agents: User-created agents with specific capabilities

    Your responsibilities:
    1. Understand user intent
    2. Route tasks to appropriate specialized agents via A2A
    3. Coordinate MCP tool execution
    4. Present results with Generative UI
    5. Request human input when needed via HITL tools
    """,
    tools=[
        send_to_a2a_agent,
        execute_mcp_tool,
        request_user_approval,
        collect_user_input,
        present_options,
        update_agent_state
    ]
)
```

### 4.2 A2A Integration

```python
from ag_ui.a2a_middleware import A2AMiddlewareAgent

a2a_middleware = A2AMiddlewareAgent(
    description="Orchestrator with access to specialized agents",
    agent_urls=[
        "http://localhost:9001",  # Research Agent
        "http://localhost:9002",  # Analysis Agent
    ],
    orchestration_agent=orchestrator,
    instructions="""
    WORKFLOW STRATEGY:
    1. For research tasks → Route to Research Agent
    2. For analysis tasks → Route to Analysis Agent
    3. For custom tasks → Check user-created agents
    4. Always synthesize results before presenting to user
    """
)
```

### 4.3 MCP Tool Integration

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def get_mcp_tools(server_config: MCPServerConfig) -> List[Tool]:
    """Dynamically load tools from MCP server"""
    server_params = StdioServerParameters(
        command=server_config.command,
        args=server_config.args,
        env=server_config.env
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            return convert_to_adk_tools(tools)
```

### 4.4 Dynamic Agent Creation

```python
def create_dynamic_agent(config: AgentConfig) -> BaseAgent:
    """Create a new agent from user configuration"""

    # Load selected MCP tools
    selected_tools = [
        get_tool_by_id(tool_id)
        for tool_id in config.tools
    ]

    # Load sub-agents for composition
    sub_agents_list = [
        get_agent_by_id(agent_id)
        for agent_id in config.subAgents
    ]

    if config.type == 'llm':
        return LlmAgent(
            name=config.id,
            model=config.model,
            instruction=config.instruction,
            description=config.description,
            tools=selected_tools,
            sub_agents=sub_agents_list,
            output_key=config.outputKey
        )
    elif config.type == 'sequential':
        return SequentialAgent(
            name=config.id,
            sub_agents=sub_agents_list
        )
    elif config.type == 'parallel':
        return ParallelAgent(
            name=config.id,
            sub_agents=sub_agents_list
        )
    elif config.type == 'loop':
        return LoopAgent(
            name=config.id,
            sub_agents=sub_agents_list,
            max_iterations=config.maxIterations or 3
        )
```

### 4.5 ADK Workflow Patterns

All Google ADK workflow patterns are supported for visual composition on the canvas.

#### 4.5.1 SequentialAgent Pattern

Agents execute one after another, with each agent able to access outputs from previous agents via shared state.

```python
from google.adk.agents import SequentialAgent, LlmAgent

pipeline = SequentialAgent(
    name="DataPipeline",
    sub_agents=[
        LlmAgent(name="Validator", instruction="Validate input", output_key="validation"),
        LlmAgent(name="Processor", instruction="Process if {validation} is valid", output_key="result"),
        LlmAgent(name="Reporter", instruction="Report {result}")
    ]
)
```

#### 4.5.2 ParallelAgent Pattern

Multiple agents execute concurrently, each writing to distinct state keys.

```python
from google.adk.agents import ParallelAgent, SequentialAgent, LlmAgent

# Fan-out: Multiple agents run concurrently
gatherer = ParallelAgent(
    name="InfoGatherer",
    sub_agents=[
        LlmAgent(name="WebSearch", output_key="web_results"),
        LlmAgent(name="DBSearch", output_key="db_results"),
        LlmAgent(name="APIFetch", output_key="api_results")
    ]
)

# Fan-out/Gather: Parallel followed by synthesis
workflow = SequentialAgent(
    name="ResearchWorkflow",
    sub_agents=[
        gatherer,
        LlmAgent(name="Synthesizer", instruction="Combine {web_results}, {db_results}, {api_results}")
    ]
)
```

#### 4.5.3 LoopAgent Pattern

Iterative execution for refinement workflows.

```python
from google.adk.agents import LoopAgent, LlmAgent

refiner = LoopAgent(
    name="ContentRefiner",
    max_iterations=3,
    sub_agents=[
        LlmAgent(name="Critic", instruction="Critique the content", output_key="feedback"),
        LlmAgent(name="Reviser", instruction="Revise based on {feedback}", output_key="revised")
    ]
)
```

#### 4.5.4 Custom Conditional Agent

For conditional branching based on runtime state.

```python
from google.adk.agents import BaseAgent, LlmAgent
from google.adk.agents.invocation_context import InvocationContext
from google.adk.events import Event
from typing import AsyncGenerator

class ConditionalRouter(BaseAgent):
    """Custom agent with conditional branching logic."""

    positive_agent: LlmAgent
    negative_agent: LlmAgent

    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        result = ctx.session.state.get("analysis_result", "")

        if "positive" in result.lower():
            async for event in self.positive_agent.run_async(ctx):
                yield event
        else:
            async for event in self.negative_agent.run_async(ctx):
                yield event
```

#### 4.5.5 LLM-Driven Dynamic Routing

The LLM decides which sub-agent to delegate to using `transfer_to_agent`.

```python
from google.adk.agents import LlmAgent

coordinator = LlmAgent(
    name="Coordinator",
    model="gemini-2.5-flash",
    instruction="""Route tasks to appropriate agents:
    - Research queries → ResearchAgent
    - Analysis requests → AnalysisAgent
    - Custom tasks → Check available custom agents""",
    description="Main coordinator that intelligently routes tasks",
    sub_agents=[research_agent, analysis_agent, custom_agent]
    # Framework handles transfer_to_agent calls automatically
)
```

#### 4.5.6 Workflow Compilation (Canvas → ADK Code)

The backend compiles visual workflows to executable ADK agent hierarchies.

```python
from google.adk.agents import BaseAgent, LlmAgent, SequentialAgent, ParallelAgent, LoopAgent

def compile_workflow(canvas: WorkflowCanvas) -> BaseAgent:
    """Compile a visual workflow to ADK agent hierarchy."""

    nodes_map = {node.id: node for node in canvas.nodes}

    def build_agent(node: WorkflowNode) -> BaseAgent:
        if node.type == 'llm':
            return LlmAgent(
                name=node.data.label,
                instruction=node.data.config.get('instruction', ''),
                output_key=node.data.config.get('outputKey'),
                tools=load_tools(node.data.config.get('tools', []))
            )
        elif node.type == 'sequential':
            children = [build_agent(nodes_map[cid]) for cid in node.data.children]
            return SequentialAgent(name=node.data.label, sub_agents=children)
        elif node.type == 'parallel':
            children = [build_agent(nodes_map[cid]) for cid in node.data.children]
            return ParallelAgent(name=node.data.label, sub_agents=children)
        elif node.type == 'loop':
            children = [build_agent(nodes_map[cid]) for cid in node.data.children]
            return LoopAgent(
                name=node.data.label,
                sub_agents=children,
                max_iterations=node.data.config.get('maxIterations', 3)
            )
        elif node.type == 'condition':
            return create_conditional_agent(node, nodes_map)

    root_node = nodes_map[canvas.rootAgentId]
    return build_agent(root_node)
```

### 4.6 Multi-Model Support with LiteLLM

The platform supports multiple LLM providers through Google ADK's LiteLLM integration, enabling flexibility in model selection per agent.

#### 4.6.1 LiteLLM Wrapper Usage

```python
from google.adk.agents import LlmAgent
from google.adk.models.lite_llm import LiteLlm

# OpenAI GPT-4o
agent_openai = LlmAgent(
    model=LiteLlm(model="openai/gpt-4o"),
    name="openai_agent",
    instruction="You are a helpful assistant powered by GPT-4o.",
)

# Anthropic Claude
agent_claude = LlmAgent(
    model=LiteLlm(model="anthropic/claude-3-haiku-20240307"),
    name="claude_agent",
    instruction="You are an assistant powered by Claude Haiku.",
)

# Ollama (local)
agent_ollama = LlmAgent(
    model=LiteLlm(model="ollama_chat/llama3.2"),
    name="local_agent",
    instruction="You are a local assistant running on Ollama.",
)
```

#### 4.6.2 Environment Configuration

```bash
# Google Gemini (default)
export GOOGLE_API_KEY="your_gemini_key"

# OpenAI
export OPENAI_API_KEY="your_openai_key"

# Anthropic
export ANTHROPIC_API_KEY="your_anthropic_key"

# Ollama (local)
export OLLAMA_API_BASE="http://localhost:11434"

# Custom OpenAI-compatible endpoint
export OPENAI_API_BASE="http://your-custom-endpoint/v1"
export OPENAI_API_KEY="your_key"
```

#### 4.6.3 Dynamic Model Selection

```python
from google.adk.models.lite_llm import LiteLlm

def create_model(config: ModelConfig):
    """Create model instance from configuration."""
    if config.provider == 'gemini':
        return config.model  # Native Gemini, no wrapper needed

    # Build LiteLLM model string
    if config.provider == 'ollama':
        model_string = f"ollama_chat/{config.model}"
    else:
        model_string = f"{config.provider}/{config.model}"

    return LiteLlm(model=model_string)

def create_agent_with_model(agent_config: AgentConfig) -> LlmAgent:
    """Create agent with configured model provider."""
    model = create_model(agent_config.modelConfig)

    return LlmAgent(
        model=model,
        name=agent_config.id,
        instruction=agent_config.instruction,
        description=agent_config.description,
        tools=load_tools(agent_config.tools),
        sub_agents=load_sub_agents(agent_config.subAgents),
        output_key=agent_config.outputKey
    )
```

#### 4.6.4 Ollama Setup for Local Models

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull llama3.2
ollama pull mistral
ollama pull codellama

# Start Ollama server
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

---

## 5. Frontend Implementation

### 5.1 Project Structure

```text
ui/
├── app/
│   ├── layout.tsx              # CopilotKit provider setup
│   ├── page.tsx                # Main application page
│   └── api/
│       └── copilotkit/
│           └── route.ts        # CopilotKit runtime endpoint
├── components/
│   ├── chat/
│   │   ├── AgentChat.tsx       # Embedded CopilotChat wrapper
│   │   ├── MessageRenderer.tsx # Custom message components
│   │   └── ToolCallCards.tsx   # Generative UI for tools
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx        # Main React Flow canvas
│   │   ├── nodes/
│   │   │   ├── LlmAgentNode.tsx      # LLM agent node
│   │   │   ├── SequentialNode.tsx    # Sequential container node
│   │   │   ├── ParallelNode.tsx      # Parallel container node
│   │   │   ├── LoopNode.tsx          # Loop container node
│   │   │   ├── ConditionNode.tsx     # Conditional branch node
│   │   │   └── CustomNode.tsx        # Custom agent node
│   │   ├── edges/
│   │   │   ├── DataFlowEdge.tsx      # Standard data flow edge
│   │   │   └── ConditionalEdge.tsx   # Conditional routing edge
│   │   ├── panels/
│   │   │   ├── NodeConfigPanel.tsx   # Node configuration sidebar
│   │   │   ├── WorkflowToolbar.tsx   # Canvas toolbar (save, load, export)
│   │   │   └── PatternTemplates.tsx  # Workflow pattern quick-start
│   │   └── CodePreview.tsx           # Generated Python code preview
│   ├── sidebar/
│   │   ├── ConfigSidebar.tsx   # Main config sidebar
│   │   ├── MCPPanel.tsx        # MCP server configuration
│   │   ├── A2APanel.tsx        # A2A agent configuration
│   │   ├── AgentBuilderPanel.tsx  # Enhanced agent builder
│   │   └── AgentLibrary.tsx    # Draggable agent list for canvas
│   ├── hitl/
│   │   ├── ApprovalDialog.tsx  # Approval workflow UI
│   │   ├── InputForm.tsx       # User input collection
│   │   └── OptionSelector.tsx  # Option presentation
│   └── state/
│       └── AgentStateDisplay.tsx # Agent state visualization
├── hooks/
│   ├── useAgentConfig.ts       # Configuration state management
│   ├── useMCPServers.ts        # MCP server management
│   ├── useA2AAgents.ts         # A2A agent management
│   ├── useHITLTools.ts         # HITL hook registrations
│   ├── useWorkflow.ts          # Workflow canvas state management
│   ├── useWorkflowValidation.ts # Real-time workflow validation
│   └── useCodeGeneration.ts    # ADK code generation from canvas
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── api.ts                  # API client utilities
│   └── workflow-utils.ts       # Workflow helper functions
├── styles/
│   └── globals.css             # Tailwind + custom styles
├── package.json                # Dependencies (bun managed)
└── bun.lockb                   # Bun lock file
```

**Frontend Setup (using bun):**

```bash
# Initialize Next.js project with bun
bun create next-app ui --typescript --tailwind --app --src-dir

# Install dependencies
cd ui
bun add @copilotkit/react-core @copilotkit/react-ui
bun add @xyflow/react zustand
bun add -d @types/node typescript
```

### 5.2 Backend Structure

```text
agent/
├── main.py                     # FastAPI application entry
├── agents/
│   ├── orchestrator.py         # Main orchestrator agent
│   ├── research.py             # Research A2A agent
│   ├── analysis.py             # Analysis A2A agent
│   ├── factory.py              # Agent factory (creates from AgentConfig)
│   ├── conditional.py          # Custom conditional agent implementations
│   └── templates/              # Pre-built agent templates
├── models/
│   ├── __init__.py
│   ├── provider.py             # Provider configuration (ProviderConfig)
│   ├── factory.py              # Model factory (creates LiteLLM instances)
│   └── registry.py             # Available models registry
├── workflows/
│   ├── builder.py              # Workflow compilation (Canvas → ADK)
│   ├── patterns.py             # Pattern implementations (Sequential, Parallel, Loop)
│   ├── validator.py            # Workflow validation engine
│   ├── serializer.py           # Import/export workflows (JSON)
│   └── executor.py             # Workflow execution engine
├── mcp/
│   ├── manager.py              # MCP server management
│   ├── tools.py                # MCP tool wrappers
│   └── configs/                # Server configurations
├── a2a/
│   ├── middleware.py           # A2A middleware setup
│   └── registry.py             # Agent registry
├── state/
│   ├── models.py               # Pydantic state models
│   └── manager.py              # State persistence
├── api/
│   ├── config.py               # Configuration endpoints
│   ├── agents.py               # Agent management endpoints
│   ├── providers.py            # Provider management endpoints
│   └── workflows.py            # Workflow management endpoints
├── pyproject.toml              # Python dependencies (uv managed)
└── uv.lock                     # Lock file for reproducible builds
```

**Python Setup (using uv):**

```bash
# Initialize Python environment
uv venv --python 3.13
source .venv/bin/activate

# Install dependencies
uv add google-adk fastapi uvicorn pydantic
uv add mcp ag-ui-adk litellm
uv add pytest ruff ipykernel --dev
```

---

## 6. API Endpoints

### 6.1 Configuration API

```text
POST /api/config/mcp-servers      # Add MCP server
GET  /api/config/mcp-servers      # List MCP servers
PUT  /api/config/mcp-servers/:id  # Update server config
DELETE /api/config/mcp-servers/:id # Remove server

POST /api/config/a2a-agents       # Register A2A agent
GET  /api/config/a2a-agents       # List A2A agents
PUT  /api/config/a2a-agents/:id   # Update agent config
DELETE /api/config/a2a-agents/:id # Remove agent

POST /api/agents/create           # Create dynamic agent
GET  /api/agents                  # List all agents
PUT  /api/agents/:id              # Update agent
DELETE /api/agents/:id            # Delete agent
POST /api/agents/:id/deploy       # Deploy agent
```

### 6.2 CopilotKit Runtime

```typescript
// app/api/copilotkit/route.ts
import { CopilotRuntime, ExperimentalEmptyAdapter } from "@copilotkit/runtime";
import { ADKAgent } from "@ag-ui/adk";
import { A2AMiddlewareAgent } from "@ag-ui/a2a-middleware";

const runtime = new CopilotRuntime({
  agents: {
    orchestrator: new ADKAgent({
      url: process.env.ORCHESTRATOR_URL
    }),
  }
});
```

### 6.3 Workflow API

```text
# Workflow Management
POST   /api/workflows              # Create workflow
GET    /api/workflows              # List workflows
GET    /api/workflows/:id          # Get workflow details
PUT    /api/workflows/:id          # Update workflow
DELETE /api/workflows/:id          # Delete workflow

# Workflow Operations
POST   /api/workflows/:id/compile  # Compile to ADK code
POST   /api/workflows/:id/validate # Validate workflow structure
POST   /api/workflows/:id/deploy   # Deploy workflow as active
GET    /api/workflows/:id/preview  # Get generated Python code
POST   /api/workflows/:id/execute  # Execute workflow (dev mode)

# Workflow Templates
GET    /api/workflow-templates     # List available templates
POST   /api/workflow-templates/:id/apply  # Create workflow from template
```

**Workflow Validation Response:**

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  code: string;
  message: string;
}
```

**Code Preview Response:**

```python
# Example generated code from workflow compilation
from google.adk.agents import SequentialAgent, ParallelAgent, LlmAgent

# Generated workflow: ResearchWorkflow
gatherer = ParallelAgent(
    name="InfoGatherer",
    sub_agents=[
        LlmAgent(name="WebSearch", output_key="web_results"),
        LlmAgent(name="DBSearch", output_key="db_results"),
    ]
)

workflow = SequentialAgent(
    name="ResearchWorkflow",
    sub_agents=[
        gatherer,
        LlmAgent(name="Synthesizer", instruction="Combine {web_results} and {db_results}")
    ]
)

root_agent = workflow
```

### 6.4 Provider API

```text
# Provider Management
GET    /api/providers              # List configured providers
POST   /api/providers              # Add new provider
PUT    /api/providers/:id          # Update provider config
DELETE /api/providers/:id          # Remove provider
POST   /api/providers/:id/test     # Test provider connectivity

# Model Discovery
GET    /api/providers/:id/models   # List available models for provider
GET    /api/models                 # List all available models across providers
```

---

## 7. Production Considerations

### 7.1 Deployment Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                     Load Balancer                        │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Frontend │    │ Frontend │    │ Frontend │
    │ (Vercel) │    │ (Vercel) │    │ (Vercel) │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   API Gateway       │
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │Orchestrator│   │ Research  │   │ Analysis  │
   │  Agent    │   │  Agent    │   │  Agent    │
   │  (GCP)    │   │  (GCP)    │   │  (GCP)    │
   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
              ┌──────────┴──────────┐
              │   MCP Servers       │
              │   (Containerized)   │
              └─────────────────────┘
```

### 7.2 Environment Configuration

```bash
# .env.production
# Frontend
NEXT_PUBLIC_COPILOT_CLOUD_KEY=your_key
COPILOTKIT_REMOTE_ENDPOINT=https://api.yourdomain.com/copilotkit

# Backend - Model Providers
GOOGLE_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key          # Optional
ANTHROPIC_API_KEY=your_anthropic_key    # Optional
OLLAMA_API_BASE=http://localhost:11434  # Optional, for local Ollama

# Default Model Provider
DEFAULT_MODEL_PROVIDER=gemini
DEFAULT_MODEL=gemini-2.5-flash

# Agent URLs
ORCHESTRATOR_URL=https://orchestrator.yourdomain.com
RESEARCH_AGENT_URL=https://research.yourdomain.com
ANALYSIS_AGENT_URL=https://analysis.yourdomain.com

# Database (for config persistence)
DATABASE_URL=postgresql://...

# Redis (for state/session management)
REDIS_URL=redis://...
```

### 7.3 Development Commands

```bash
# Frontend (bun)
cd ui
bun install          # Install dependencies
bun dev              # Start development server
bun build            # Production build
bun start            # Start production server

# Backend (uv)
cd agent
uv sync              # Install dependencies from lock file
uv run uvicorn main:app --reload  # Start dev server
uv run pytest        # Run tests
uv run ruff check .  # Lint code
```

### 7.4 Monitoring & Observability

- **CopilotKit Inspector** - Debug actions, messages, agent status
- **CopilotKit Observability Hooks** - Track user interactions, chat events
- **OpenTelemetry** - Distributed tracing across agents
- **Prometheus/Grafana** - Metrics and dashboards

### 7.5 Error Handling

```python
# Structured error responses
class AgentError(BaseModel):
    code: str
    message: str
    agent_id: Optional[str]
    recoverable: bool
    suggested_action: Optional[str]

# Frontend error boundary
<CopilotKit
  onError={(error) => {
    logError(error);
    showToast({ type: 'error', message: error.message });
  }}
>
```

### 7.6 Security Considerations

- **Authentication**: Integrate with your auth provider (Auth0, Clerk, etc.)
- **Authorization**: Role-based access to agent creation/configuration
- **API Keys**: Secure storage for MCP server credentials
- **Rate Limiting**: Protect against abuse
- **Input Validation**: Sanitize agent instructions and tool parameters

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1-2)

- [ ] Set up Next.js project with CopilotKit
- [ ] Create basic Google ADK orchestrator agent
- [ ] Implement embedded CopilotChat interface
- [ ] Basic shared state between frontend and agent

### Phase 2: Configuration UI (Week 2-3)

- [ ] Build configuration sidebar component
- [ ] Implement MCP server management panel
- [ ] Implement A2A agent configuration panel
- [ ] Create enhanced agent builder interface

### Phase 2.5: Agent Workflow Canvas (Week 3)

- [ ] Install and configure React Flow (@xyflow/react)
- [ ] Implement custom node types for each agent type (LLM, Sequential, Parallel, Loop, Condition)
- [ ] Create container nodes for workflow agents
- [ ] Build edge handling with validation
- [ ] Implement workflow pattern templates (Sequential, Parallel, Fan-out/Gather, Loop)
- [ ] Add code preview panel with syntax highlighting
- [ ] Create workflow validation engine
- [ ] Build workflow compilation (Canvas → ADK Python code)
- [ ] Implement save/load/export workflow functionality

### Phase 3: MCP Integration (Week 3-4)

- [ ] MCP server connection management
- [ ] Dynamic tool loading from MCP servers
- [ ] Tool execution through orchestrator
- [ ] Custom tool creation interface

### Phase 4: A2A Implementation (Week 4-5)

- [ ] Set up A2A middleware
- [ ] Create research and analysis sub-agents
- [ ] Implement orchestrator routing logic
- [ ] A2A message visualization in UI

### Phase 5: HITL Patterns (Week 5-6)

- [ ] Approval workflow components
- [ ] User input collection forms
- [ ] Option selection interface
- [ ] Interrupt-based HITL (if using LangGraph sub-agents)

### Phase 6: Dynamic Agents (Week 6-7)

- [ ] Agent creation API
- [ ] Agent deployment mechanism
- [ ] Agent management (start/stop/configure)
- [ ] Agent persistence and versioning

### Phase 7: Production Hardening (Week 7-8)

- [ ] Error handling and recovery
- [ ] Monitoring and observability
- [ ] Security implementation
- [ ] Documentation and examples

---

## 9. Getting Started Guide Outline

The final deliverable will be a comprehensive getting started guide covering:

1. **Quick Start** (5 minutes)
   - Clone repository
   - Install dependencies with `bun` (frontend) and `uv` (backend)
   - Configure API keys (Google Gemini)
   - Run development servers (`bun dev` + `uv run uvicorn`)

2. **Core Concepts** (15 minutes)
   - AG-UI protocol overview
   - MCP integration basics
   - A2A patterns explained
   - HITL fundamentals

3. **Building Your First Agent** (30 minutes)
   - Creating the orchestrator
   - Adding MCP tools
   - Connecting A2A agents
   - Implementing HITL

4. **Configuration Deep Dive** (45 minutes)
   - MCP server setup
   - A2A agent configuration
   - Dynamic agent creation
   - State management

5. **Advanced Patterns** (60 minutes)
   - Multi-agent orchestration
   - Complex workflows
   - Custom generative UI
   - Production deployment

6. **Reference**
   - API documentation
   - Component library
   - Configuration options
   - Troubleshooting guide

---

## 10. Success Criteria

### Core Features

- [ ] Users can chat with an orchestrator agent through embedded UI
- [ ] Users can configure MCP servers through the sidebar
- [ ] Users can add/remove A2A agents dynamically
- [ ] Users can create custom agents with system prompt, MCP tools, and sub-agents
- [ ] All HITL patterns work correctly
- [ ] Agent state is visible in real-time

### Workflow Canvas Features

- [ ] Users can visually design agent workflows on canvas using drag-and-drop
- [ ] All ADK workflow patterns are supported (Sequential, Parallel, Loop, Custom)
- [ ] Users can drag agents from library onto canvas and connect them
- [ ] Workflow validation catches structural errors before deployment
- [ ] Users can export workflows as Python ADK code
- [ ] Workflow pattern templates provide quick-start options
- [ ] State flow (output_key → {variable}) is visualized on canvas
- [ ] Users can save, load, and share workflow configurations

### Multi-Model Features

- [ ] Users can configure multiple LLM providers (Gemini, OpenAI, Anthropic, Ollama)
- [ ] Each agent can use a different model provider
- [ ] Ollama integration works for local/offline model usage
- [ ] Provider connectivity can be tested from the UI
- [ ] Model selection is available in the Agent Builder

### Production Readiness

- [ ] Application is production-deployable
- [ ] Documentation is comprehensive and clear
- [ ] Error handling covers all edge cases
- [ ] Performance is acceptable for complex workflows

---

## 11. Technical Decisions

### 11.1 Database Architecture (PostgreSQL)

The platform uses PostgreSQL as the primary database, with special consideration for Google ADK session management.

#### 11.1.1 Database Schema

```sql
-- Users & Authentication (synced from Auth0)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth0_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',  -- 'admin', 'user', 'viewer'
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',  -- 'free', 'pro', 'enterprise'
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agent Configuration
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'llm', 'sequential', 'parallel', 'loop', 'custom'
    model_config JSONB NOT NULL,  -- ModelConfig object
    description TEXT,
    instruction TEXT,
    tools TEXT[],  -- Array of MCP tool IDs
    sub_agents UUID[],  -- Array of agent IDs
    output_key VARCHAR(100),
    max_iterations INTEGER DEFAULT 3,
    state_schema JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflow Canvas
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL,  -- WorkflowNode[]
    edges JSONB NOT NULL,  -- WorkflowEdge[]
    root_agent_id VARCHAR(100),
    compiled_code TEXT,  -- Generated Python code
    is_deployed BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MCP Server Configuration
CREATE TABLE mcp_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'stdio', 'sse', 'http', 'websocket'
    url TEXT,
    command TEXT,
    args TEXT[],
    env_encrypted BYTEA,  -- Encrypted environment variables
    enabled BOOLEAN DEFAULT true,
    tools_cache JSONB,  -- Cached tool definitions
    last_health_check TIMESTAMP,
    status VARCHAR(50) DEFAULT 'unknown',
    created_at TIMESTAMP DEFAULT NOW()
);

-- A2A Agent Registry
CREATE TABLE a2a_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    framework VARCHAR(50),  -- 'adk', 'langgraph', 'crewai', 'custom'
    capabilities TEXT[],
    agent_card JSONB,  -- A2A agent card metadata
    enabled BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'unknown',
    last_health_check TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- LLM Provider Configuration
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- 'gemini', 'openai', 'anthropic', 'ollama', 'custom'
    name VARCHAR(255) NOT NULL,
    base_url TEXT,
    api_key_encrypted BYTEA,  -- Encrypted API key
    available_models TEXT[],
    is_default BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Google ADK Session Storage
CREATE TABLE adk_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,  -- ADK session identifier
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    agent_name VARCHAR(255) NOT NULL,
    state JSONB NOT NULL,  -- Session state (OrchestratorState)
    messages JSONB DEFAULT '[]',  -- Conversation history
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_adk_sessions_session_id ON adk_sessions(session_id);
CREATE INDEX idx_adk_sessions_user_id ON adk_sessions(user_id);

-- Conversation History (for analytics and replay)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES adk_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,  -- 'user', 'assistant', 'tool', 'system'
    content TEXT,
    tool_calls JSONB,
    metadata JSONB,
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workflow Execution Logs
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id),
    session_id UUID REFERENCES adk_sessions(id),
    status VARCHAR(50) NOT NULL,  -- 'pending', 'running', 'completed', 'failed'
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    execution_log JSONB,  -- Step-by-step execution details
    created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys (for programmatic access)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(64) NOT NULL,  -- SHA-256 hash of the key
    key_prefix VARCHAR(10) NOT NULL,  -- First 10 chars for identification
    scopes TEXT[],  -- 'agents:read', 'agents:write', 'workflows:*', etc.
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 11.1.2 Google ADK Session Service

```python
# agent/state/session_service.py
from google.adk.sessions import BaseSessionService, Session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import json

class PostgresSessionService(BaseSessionService):
    """Custom session service using PostgreSQL for persistence."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_session(
        self,
        app_name: str,
        user_id: str,
        state: dict = None,
        session_id: str = None
    ) -> Session:
        """Create a new session in PostgreSQL."""
        session_id = session_id or str(uuid.uuid4())

        query = """
            INSERT INTO adk_sessions (session_id, user_id, agent_name, state, organization_id)
            VALUES (:session_id, :user_id, :agent_name, :state, :org_id)
            RETURNING *
        """
        result = await self.db.execute(query, {
            "session_id": session_id,
            "user_id": user_id,
            "agent_name": app_name,
            "state": json.dumps(state or {}),
            "org_id": self._get_org_from_user(user_id)
        })

        return self._row_to_session(result.fetchone())

    async def get_session(
        self,
        app_name: str,
        user_id: str,
        session_id: str
    ) -> Optional[Session]:
        """Retrieve session from PostgreSQL."""
        query = """
            SELECT * FROM adk_sessions
            WHERE session_id = :session_id
              AND agent_name = :agent_name
              AND is_active = true
        """
        result = await self.db.execute(query, {
            "session_id": session_id,
            "agent_name": app_name
        })
        row = result.fetchone()
        return self._row_to_session(row) if row else None

    async def update_session(
        self,
        app_name: str,
        user_id: str,
        session_id: str,
        state: dict
    ) -> Session:
        """Update session state in PostgreSQL."""
        query = """
            UPDATE adk_sessions
            SET state = :state, updated_at = NOW()
            WHERE session_id = :session_id
            RETURNING *
        """
        result = await self.db.execute(query, {
            "session_id": session_id,
            "state": json.dumps(state)
        })
        return self._row_to_session(result.fetchone())

    async def delete_session(
        self,
        app_name: str,
        user_id: str,
        session_id: str
    ) -> None:
        """Soft delete session."""
        query = """
            UPDATE adk_sessions
            SET is_active = false, updated_at = NOW()
            WHERE session_id = :session_id
        """
        await self.db.execute(query, {"session_id": session_id})
```

#### 11.1.3 Redis Usage

Redis is used for:
- **Session caching**: Hot session data for fast access
- **Pub/Sub**: Real-time updates to frontend
- **Rate limiting**: API request throttling
- **Job queue**: Background task management (with RQ or Celery)

```python
# agent/cache/redis_client.py
import redis.asyncio as redis
from typing import Optional
import json

class RedisClient:
    def __init__(self, url: str):
        self.redis = redis.from_url(url)

    # Session caching
    async def cache_session(self, session_id: str, state: dict, ttl: int = 3600):
        await self.redis.setex(
            f"session:{session_id}",
            ttl,
            json.dumps(state)
        )

    async def get_cached_session(self, session_id: str) -> Optional[dict]:
        data = await self.redis.get(f"session:{session_id}")
        return json.loads(data) if data else None

    # Real-time updates via Pub/Sub
    async def publish_agent_event(self, session_id: str, event: dict):
        await self.redis.publish(
            f"agent:events:{session_id}",
            json.dumps(event)
        )

    # Rate limiting
    async def check_rate_limit(self, key: str, limit: int, window: int) -> bool:
        current = await self.redis.incr(key)
        if current == 1:
            await self.redis.expire(key, window)
        return current <= limit
```

### 11.2 Authentication (Auth0)

#### 11.2.1 Auth0 Configuration

```typescript
// ui/lib/auth0-config.ts
export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  audience: process.env.AUTH0_AUDIENCE!,
  scope: 'openid profile email',
  redirectUri: process.env.AUTH0_REDIRECT_URI!,
};

// Roles and permissions
export const PERMISSIONS = {
  AGENTS_READ: 'agents:read',
  AGENTS_WRITE: 'agents:write',
  AGENTS_DEPLOY: 'agents:deploy',
  WORKFLOWS_READ: 'workflows:read',
  WORKFLOWS_WRITE: 'workflows:write',
  WORKFLOWS_EXECUTE: 'workflows:execute',
  MCP_MANAGE: 'mcp:manage',
  PROVIDERS_MANAGE: 'providers:manage',
  ORG_ADMIN: 'org:admin',
} as const;
```

#### 11.2.2 Next.js Auth Integration

```typescript
// ui/app/api/auth/[auth0]/route.ts
import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
    returnTo: '/dashboard',
  }),
  callback: handleCallback({
    afterCallback: async (req, session) => {
      // Sync user to database on first login
      await syncUserToDatabase(session.user);
      return session;
    },
  }),
});
```

#### 11.2.3 FastAPI Auth Middleware

```python
# agent/auth/middleware.py
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx

security = HTTPBearer()

class Auth0Verifier:
    def __init__(self):
        self.domain = os.getenv("AUTH0_DOMAIN")
        self.audience = os.getenv("AUTH0_AUDIENCE")
        self.algorithms = ["RS256"]
        self._jwks = None

    async def get_jwks(self):
        if not self._jwks:
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"https://{self.domain}/.well-known/jwks.json")
                self._jwks = resp.json()
        return self._jwks

    async def verify_token(self, token: str) -> dict:
        jwks = await self.get_jwks()
        try:
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = self._find_rsa_key(jwks, unverified_header["kid"])

            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=self.algorithms,
                audience=self.audience,
                issuer=f"https://{self.domain}/"
            )
            return payload
        except JWTError as e:
            raise HTTPException(status_code=401, detail=str(e))

auth0_verifier = Auth0Verifier()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Dependency to get current authenticated user."""
    token = credentials.credentials
    payload = await auth0_verifier.verify_token(token)
    return payload

def require_permission(permission: str):
    """Decorator to require specific permission."""
    async def permission_checker(user: dict = Depends(get_current_user)):
        permissions = user.get("permissions", [])
        if permission not in permissions:
            raise HTTPException(status_code=403, detail="Permission denied")
        return user
    return permission_checker
```

### 11.3 Real-time Communication

#### 11.3.1 Server-Sent Events (SSE) for Agent Execution

```python
# agent/api/sse.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import asyncio
import json

router = APIRouter()

async def agent_event_stream(
    session_id: str,
    redis: RedisClient
) -> AsyncGenerator[str, None]:
    """Stream agent events via SSE."""
    pubsub = redis.redis.pubsub()
    await pubsub.subscribe(f"agent:events:{session_id}")

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                event_data = json.loads(message["data"])
                yield f"event: {event_data['type']}\n"
                yield f"data: {json.dumps(event_data['payload'])}\n\n"
    finally:
        await pubsub.unsubscribe(f"agent:events:{session_id}")

@router.get("/api/agents/{session_id}/events")
async def stream_agent_events(
    session_id: str,
    user: dict = Depends(get_current_user),
    redis: RedisClient = Depends(get_redis)
):
    """SSE endpoint for real-time agent updates."""
    return StreamingResponse(
        agent_event_stream(session_id, redis),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
```

#### 11.3.2 WebSocket for Canvas Collaboration

```python
# agent/api/websocket.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json

class CanvasConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, workflow_id: str, websocket: WebSocket):
        await websocket.accept()
        if workflow_id not in self.active_connections:
            self.active_connections[workflow_id] = set()
        self.active_connections[workflow_id].add(websocket)

    def disconnect(self, workflow_id: str, websocket: WebSocket):
        self.active_connections[workflow_id].discard(websocket)

    async def broadcast(self, workflow_id: str, message: dict, exclude: WebSocket = None):
        if workflow_id in self.active_connections:
            for connection in self.active_connections[workflow_id]:
                if connection != exclude:
                    await connection.send_json(message)

manager = CanvasConnectionManager()

@router.websocket("/api/workflows/{workflow_id}/collaborate")
async def workflow_collaboration(
    websocket: WebSocket,
    workflow_id: str
):
    """WebSocket for real-time canvas collaboration."""
    await manager.connect(workflow_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle different event types
            if data["type"] == "node_moved":
                await manager.broadcast(workflow_id, data, exclude=websocket)
            elif data["type"] == "node_added":
                await manager.broadcast(workflow_id, data, exclude=websocket)
            elif data["type"] == "edge_created":
                await manager.broadcast(workflow_id, data, exclude=websocket)
            elif data["type"] == "cursor_position":
                await manager.broadcast(workflow_id, data, exclude=websocket)
    except WebSocketDisconnect:
        manager.disconnect(workflow_id, websocket)
```

#### 11.3.3 Frontend Event Handling

```typescript
// ui/hooks/useAgentEvents.ts
import { useEffect, useState, useCallback } from 'react';

interface AgentEvent {
  type: 'state_update' | 'tool_call' | 'message' | 'error' | 'complete';
  payload: any;
}

export function useAgentEvents(sessionId: string | null) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const eventSource = new EventSource(`/api/agents/${sessionId}/events`);

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.addEventListener('state_update', (e) => {
      setEvents(prev => [...prev, { type: 'state_update', payload: JSON.parse(e.data) }]);
    });

    eventSource.addEventListener('tool_call', (e) => {
      setEvents(prev => [...prev, { type: 'tool_call', payload: JSON.parse(e.data) }]);
    });

    eventSource.addEventListener('complete', (e) => {
      setEvents(prev => [...prev, { type: 'complete', payload: JSON.parse(e.data) }]);
      eventSource.close();
    });

    return () => eventSource.close();
  }, [sessionId]);

  return { events, isConnected };
}
```

### 11.4 Job Queue & Execution Engine

#### 11.4.1 Background Task Processing (RQ + Redis)

```python
# agent/workers/tasks.py
from rq import Queue
from redis import Redis
from typing import Optional
import asyncio

redis_conn = Redis.from_url(os.getenv("REDIS_URL"))
task_queue = Queue("agent_tasks", connection=redis_conn)
high_priority_queue = Queue("high_priority", connection=redis_conn)

def enqueue_workflow_execution(
    workflow_id: str,
    session_id: str,
    user_id: str,
    priority: str = "normal"
) -> str:
    """Enqueue a workflow for background execution."""
    queue = high_priority_queue if priority == "high" else task_queue

    job = queue.enqueue(
        execute_workflow_task,
        workflow_id,
        session_id,
        user_id,
        job_timeout="30m",
        result_ttl=3600,
        failure_ttl=86400
    )
    return job.id

async def execute_workflow_task(
    workflow_id: str,
    session_id: str,
    user_id: str
):
    """Execute a workflow in the background."""
    from agent.workflows.executor import WorkflowExecutor

    executor = WorkflowExecutor()
    try:
        # Update execution status
        await update_execution_status(workflow_id, session_id, "running")

        # Run the workflow
        result = await executor.execute(workflow_id, session_id)

        # Update completion status
        await update_execution_status(workflow_id, session_id, "completed", result)

    except Exception as e:
        await update_execution_status(workflow_id, session_id, "failed", error=str(e))
        raise
```

#### 11.4.2 Workflow Executor with Checkpointing

```python
# agent/workflows/executor.py
from google.adk.agents import BaseAgent
from google.adk.runners import Runner
from typing import AsyncGenerator
import json

class WorkflowExecutor:
    """Executes workflows with checkpointing and recovery."""

    def __init__(self, session_service: PostgresSessionService, redis: RedisClient):
        self.session_service = session_service
        self.redis = redis

    async def execute(
        self,
        workflow_id: str,
        session_id: str
    ) -> dict:
        """Execute a workflow with state persistence."""
        # Load workflow
        workflow = await self.load_workflow(workflow_id)
        agent = compile_workflow(workflow)

        # Create runner with session
        session = await self.session_service.get_session(
            app_name=workflow.name,
            user_id=session_id,
            session_id=session_id
        )

        runner = Runner(
            agent=agent,
            app_name=workflow.name,
            session_service=self.session_service
        )

        # Execute with event streaming
        async for event in runner.run_async(session_id=session_id):
            # Publish event to Redis for real-time updates
            await self.redis.publish_agent_event(session_id, {
                "type": event.type,
                "payload": event.to_dict()
            })

            # Checkpoint state periodically
            if event.type == "state_update":
                await self.checkpoint_state(session_id, event.state)

        return {"status": "completed", "session_id": session_id}

    async def checkpoint_state(self, session_id: str, state: dict):
        """Save execution checkpoint for recovery."""
        await self.redis.setex(
            f"checkpoint:{session_id}",
            3600,  # 1 hour TTL
            json.dumps(state)
        )

    async def recover_from_checkpoint(self, session_id: str) -> Optional[dict]:
        """Recover execution state from checkpoint."""
        checkpoint = await self.redis.get(f"checkpoint:{session_id}")
        return json.loads(checkpoint) if checkpoint else None
```

### 11.5 Containerization & Kubernetes

#### 11.5.1 Docker Configuration

```dockerfile
# docker/Dockerfile.api
FROM python:3.13-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy application code
COPY agent/ ./agent/

# Create non-root user
RUN useradd -m -u 1000 appuser
USER appuser

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "agent.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# docker/Dockerfile.ui
FROM oven/bun:1 AS builder

WORKDIR /app

COPY ui/package.json ui/bun.lockb ./
RUN bun install --frozen-lockfile

COPY ui/ ./
RUN bun run build

# Production image
FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["bun", "run", "server.js"]
```

```dockerfile
# docker/Dockerfile.worker
FROM python:3.13-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY agent/ ./agent/

RUN useradd -m -u 1000 appuser
USER appuser

CMD ["uv", "run", "rq", "worker", "--url", "$REDIS_URL", "high_priority", "agent_tasks"]
```

#### 11.5.2 Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: agent_framework
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: docker/Dockerfile.api
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/agent_framework
      REDIS_URL: redis://redis:6379
      GOOGLE_API_KEY: ${GOOGLE_API_KEY}
      AUTH0_DOMAIN: ${AUTH0_DOMAIN}
      AUTH0_AUDIENCE: ${AUTH0_AUDIENCE}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./agent:/app/agent:ro  # Hot reload in dev

  worker:
    build:
      context: .
      dockerfile: docker/Dockerfile.worker
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/agent_framework
      REDIS_URL: redis://redis:6379
      GOOGLE_API_KEY: ${GOOGLE_API_KEY}
    depends_on:
      - redis
      - postgres
    deploy:
      replicas: 2

  ui:
    build:
      context: .
      dockerfile: docker/Dockerfile.ui
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
      AUTH0_SECRET: ${AUTH0_SECRET}
      AUTH0_BASE_URL: http://localhost:3000
      AUTH0_ISSUER_BASE_URL: https://${AUTH0_DOMAIN}
      AUTH0_CLIENT_ID: ${AUTH0_CLIENT_ID}
      AUTH0_CLIENT_SECRET: ${AUTH0_CLIENT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - api

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  postgres_data:
  redis_data:
  ollama_data:
```

#### 11.5.3 Kubernetes Manifests

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: agent-framework
  labels:
    app.kubernetes.io/name: agent-framework
```

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: agent-framework
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/your-org/agent-framework-api:latest
          ports:
            - containerPort: 8000
          envFrom:
            - secretRef:
                name: api-secrets
            - configMapRef:
                name: api-config
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: agent-framework
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8000
  type: ClusterIP
```

```yaml
# k8s/worker-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
  namespace: agent-framework
spec:
  replicas: 5
  selector:
    matchLabels:
      app: worker
  template:
    metadata:
      labels:
        app: worker
    spec:
      containers:
        - name: worker
          image: ghcr.io/your-org/agent-framework-worker:latest
          envFrom:
            - secretRef:
                name: api-secrets
            - configMapRef:
                name: api-config
          resources:
            requests:
              memory: "1Gi"
              cpu: "500m"
            limits:
              memory: "4Gi"
              cpu: "2000m"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: worker-hpa
  namespace: agent-framework
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: worker
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: External
      external:
        metric:
          name: redis_queue_length
          selector:
            matchLabels:
              queue: agent_tasks
        target:
          type: AverageValue
          averageValue: "10"
```

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agent-framework
  namespace: agent-framework
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
spec:
  tls:
    - hosts:
        - app.yourdomain.com
        - api.yourdomain.com
      secretName: agent-framework-tls
  rules:
    - host: app.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ui
                port:
                  number: 80
    - host: api.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
```

---

## 12. CI/CD Pipeline (GitHub Actions)

### 12.1 Main CI/CD Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  API_IMAGE: ghcr.io/${{ github.repository }}/api
  UI_IMAGE: ghcr.io/${{ github.repository }}/ui
  WORKER_IMAGE: ghcr.io/${{ github.repository }}/worker

jobs:
  # ============================================
  # Backend Tests & Linting
  # ============================================
  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v4
        with:
          version: "latest"

      - name: Set up Python
        run: uv python install 3.13

      - name: Install dependencies
        working-directory: ./agent
        run: uv sync

      - name: Lint with Ruff
        working-directory: ./agent
        run: uv run ruff check .

      - name: Type check with Pyright
        working-directory: ./agent
        run: uv run pyright

      - name: Run tests
        working-directory: ./agent
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
        run: uv run pytest --cov=agent --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./agent/coverage.xml
          flags: backend

  # ============================================
  # Frontend Tests & Linting
  # ============================================
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        working-directory: ./ui
        run: bun install --frozen-lockfile

      - name: Lint
        working-directory: ./ui
        run: bun run lint

      - name: Type check
        working-directory: ./ui
        run: bun run typecheck

      - name: Run tests
        working-directory: ./ui
        run: bun test --coverage

      - name: Build
        working-directory: ./ui
        run: bun run build

  # ============================================
  # Build & Push Docker Images
  # ============================================
  build-images:
    needs: [backend-test, frontend-test]
    runs-on: ubuntu-latest
    if: github.event_name != 'pull_request'
    permissions:
      contents: read
      packages: write

    strategy:
      matrix:
        include:
          - name: api
            dockerfile: docker/Dockerfile.api
            context: .
          - name: ui
            dockerfile: docker/Dockerfile.ui
            context: .
          - name: worker
            dockerfile: docker/Dockerfile.worker
            context: .

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ matrix.name }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=
            type=semver,pattern={{version}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ${{ matrix.context }}
          file: ${{ matrix.dockerfile }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ============================================
  # Deploy to Staging
  # ============================================
  deploy-staging:
    needs: [build-images]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/setup-kubectl@v4

      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBE_CONFIG_STAGING }}" | base64 -d > kubeconfig
          echo "KUBECONFIG=$(pwd)/kubeconfig" >> $GITHUB_ENV

      - name: Deploy to staging
        run: |
          kubectl set image deployment/api \
            api=${{ env.API_IMAGE }}:${{ github.sha }} \
            -n agent-framework-staging

          kubectl set image deployment/ui \
            ui=${{ env.UI_IMAGE }}:${{ github.sha }} \
            -n agent-framework-staging

          kubectl set image deployment/worker \
            worker=${{ env.WORKER_IMAGE }}:${{ github.sha }} \
            -n agent-framework-staging

          kubectl rollout status deployment/api -n agent-framework-staging
          kubectl rollout status deployment/ui -n agent-framework-staging

  # ============================================
  # Deploy to Production
  # ============================================
  deploy-production:
    needs: [build-images]
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/setup-kubectl@v4

      - name: Configure kubeconfig
        run: |
          echo "${{ secrets.KUBE_CONFIG_PROD }}" | base64 -d > kubeconfig
          echo "KUBECONFIG=$(pwd)/kubeconfig" >> $GITHUB_ENV

      - name: Deploy to production
        run: |
          VERSION=${{ github.event.release.tag_name }}

          kubectl set image deployment/api \
            api=${{ env.API_IMAGE }}:${VERSION} \
            -n agent-framework

          kubectl set image deployment/ui \
            ui=${{ env.UI_IMAGE }}:${VERSION} \
            -n agent-framework

          kubectl set image deployment/worker \
            worker=${{ env.WORKER_IMAGE }}:${VERSION} \
            -n agent-framework

          kubectl rollout status deployment/api -n agent-framework
          kubectl rollout status deployment/ui -n agent-framework

      - name: Notify deployment
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚀 Agent Framework ${{ github.event.release.tag_name }} deployed to production!"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 12.2 Database Migration Workflow

```yaml
# .github/workflows/db-migrate.yml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production
      action:
        description: 'Migration action'
        required: true
        type: choice
        options:
          - upgrade
          - downgrade

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v4

      - name: Run migration
        working-directory: ./agent
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          uv sync
          if [ "${{ inputs.action }}" == "upgrade" ]; then
            uv run alembic upgrade head
          else
            uv run alembic downgrade -1
          fi
```

### 12.3 Security Scanning Workflow

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  container-scan:
    runs-on: ubuntu-latest
    needs: [dependency-scan]
    strategy:
      matrix:
        image: [api, ui, worker]

    steps:
      - name: Run Trivy container scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'ghcr.io/${{ github.repository }}/${{ matrix.image }}:latest'
          format: 'sarif'
          output: 'trivy-${{ matrix.image }}.sarif'

      - name: Upload results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-${{ matrix.image }}.sarif'
```

---

## 13. Desktop Distribution

### 13.1 Architecture Overview

The desktop application bundles both frontend and backend, allowing users to run Agent Framework locally without the SaaS version.

```text
┌─────────────────────────────────────────────────────────┐
│                    Desktop Application                   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Tauri Shell   │    │      Embedded Services      │ │
│  │   (Rust-based)  │    │  ┌───────────────────────┐  │ │
│  │                 │    │  │   FastAPI Backend     │  │ │
│  │  ┌───────────┐  │    │  │   (Python 3.13)       │  │ │
│  │  │  WebView  │  │◄──►│  └───────────────────────┘  │ │
│  │  │ (Next.js) │  │    │  ┌───────────────────────┐  │ │
│  │  └───────────┘  │    │  │   SQLite Database     │  │ │
│  │                 │    │  └───────────────────────┘  │ │
│  └─────────────────┘    │  ┌───────────────────────┐  │ │
│                         │  │   Redis (Optional)    │  │ │
│                         │  │   or In-Memory Cache  │  │ │
│                         │  └───────────────────────┘  │ │
│                         └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 13.2 Tauri Application Structure

```text
desktop/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── src/
│   │   ├── main.rs              # Main entry point
│   │   ├── commands.rs          # Tauri commands
│   │   ├── backend.rs           # Python backend management
│   │   ├── database.rs          # SQLite management
│   │   └── updater.rs           # Auto-update logic
│   └── icons/
│       ├── icon.icns            # macOS
│       ├── icon.ico             # Windows
│       └── icon.png             # Linux
├── src/                         # Next.js frontend (shared with web)
├── package.json
└── tauri.conf.json
```

### 13.3 Tauri Configuration

```json
// desktop/src-tauri/tauri.conf.json
{
  "build": {
    "beforeBuildCommand": "bun run build",
    "beforeDevCommand": "bun run dev",
    "devPath": "http://localhost:3000",
    "distDir": "../.next"
  },
  "package": {
    "productName": "Agent Framework",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true,
        "execute": true,
        "sidecar": true,
        "scope": [
          {
            "name": "python-backend",
            "cmd": "python-backend",
            "args": true
          }
        ]
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "readDir": true,
        "createDir": true,
        "scope": ["$APPDATA/**", "$HOME/.agent-framework/**"]
      },
      "path": {
        "all": true
      },
      "dialog": {
        "all": true
      },
      "notification": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.agentframework.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "resources": [
        "python-backend/**"
      ],
      "externalBin": [
        "python-backend"
      ],
      "macOS": {
        "entitlements": null,
        "minimumSystemVersion": "10.15",
        "frameworks": []
      },
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.agentframework.com/{{target}}/{{current_version}}"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "Agent Framework",
        "width": 1400,
        "height": 900,
        "minWidth": 1024,
        "minHeight": 768
      }
    ]
  }
}
```

### 13.4 Backend Sidecar (Python)

```rust
// desktop/src-tauri/src/backend.rs
use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::api::path::app_data_dir;

pub struct BackendProcess {
    process: Mutex<Option<Child>>,
}

impl BackendProcess {
    pub fn new() -> Self {
        Self {
            process: Mutex::new(None),
        }
    }

    pub fn start(&self, app_handle: &tauri::AppHandle) -> Result<u16, String> {
        let data_dir = app_data_dir(&app_handle.config())
            .ok_or("Failed to get app data directory")?;

        // Find available port
        let port = portpicker::pick_unused_port().expect("No ports available");

        // Start Python backend as sidecar
        let sidecar = app_handle
            .shell()
            .sidecar("python-backend")
            .map_err(|e| e.to_string())?
            .args([
                "--port", &port.to_string(),
                "--data-dir", &data_dir.to_string_lossy(),
                "--database", "sqlite",
            ])
            .spawn()
            .map_err(|e| e.to_string())?;

        let mut process = self.process.lock().unwrap();
        *process = Some(sidecar);

        Ok(port)
    }

    pub fn stop(&self) {
        if let Some(mut child) = self.process.lock().unwrap().take() {
            let _ = child.kill();
        }
    }
}
```

### 13.5 Desktop-specific Backend Configuration

```python
# agent/desktop/main.py
"""
Desktop-specific entry point with SQLite and embedded mode.
"""
import sys
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--data-dir", type=str, required=True)
    parser.add_argument("--database", choices=["sqlite", "postgres"], default="sqlite")
    args = parser.parse_args()

    # Configure for desktop mode
    data_dir = Path(args.data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)

    # Set environment for SQLite
    if args.database == "sqlite":
        import os
        os.environ["DATABASE_URL"] = f"sqlite:///{data_dir}/agent_framework.db"
        os.environ["DESKTOP_MODE"] = "true"

    # Initialize database
    from agent.database import init_db
    init_db()

    # Start server
    import uvicorn
    uvicorn.run(
        "agent.main:app",
        host="127.0.0.1",
        port=args.port,
        log_level="info"
    )

if __name__ == "__main__":
    main()
```

### 13.6 Build Scripts

```yaml
# .github/workflows/desktop-release.yml
name: Desktop Release

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to build'
        required: true

jobs:
  build-desktop:
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: macos-latest
            target: universal-apple-darwin
            name: macOS
          - platform: ubuntu-22.04
            target: x86_64-unknown-linux-gnu
            name: Linux
          - platform: windows-latest
            target: x86_64-pc-windows-msvc
            name: Windows

    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - name: Install uv
        uses: astral-sh/setup-uv@v4

      - name: Setup Python
        run: uv python install 3.13

      # Linux dependencies
      - name: Install Linux dependencies
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libwebkit2gtk-4.1-dev \
            libappindicator3-dev \
            librsvg2-dev \
            patchelf

      # Build Python sidecar
      - name: Build Python sidecar
        working-directory: ./agent
        run: |
          uv sync
          uv run pyinstaller \
            --onefile \
            --name python-backend \
            --hidden-import=google.adk \
            --hidden-import=litellm \
            desktop/main.py

      - name: Copy sidecar to Tauri
        run: |
          mkdir -p desktop/src-tauri/bin
          cp agent/dist/python-backend* desktop/src-tauri/bin/

      # Build frontend
      - name: Install frontend dependencies
        working-directory: ./desktop
        run: bun install --frozen-lockfile

      # Build Tauri app
      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TAURI_PRIVATE_KEY: ${{ secrets.TAURI_PRIVATE_KEY }}
          TAURI_KEY_PASSWORD: ${{ secrets.TAURI_KEY_PASSWORD }}
        with:
          projectPath: ./desktop
          tagName: v__VERSION__
          releaseName: 'Agent Framework v__VERSION__'
          releaseBody: 'See the changelog for details.'
          releaseDraft: true
          prerelease: false
          args: --target ${{ matrix.target }}

      # Upload artifacts
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: desktop-${{ matrix.name }}
          path: |
            desktop/src-tauri/target/release/bundle/**/*.dmg
            desktop/src-tauri/target/release/bundle/**/*.app
            desktop/src-tauri/target/release/bundle/**/*.deb
            desktop/src-tauri/target/release/bundle/**/*.AppImage
            desktop/src-tauri/target/release/bundle/**/*.msi
            desktop/src-tauri/target/release/bundle/**/*.exe
```

### 13.7 Desktop vs SaaS Feature Comparison

| Feature | SaaS | Desktop |
|---------|------|---------|
| **Database** | PostgreSQL | SQLite |
| **Session Management** | Redis | In-memory / File |
| **Authentication** | Auth0 | Local (optional) |
| **Multi-user** | ✅ | Single user |
| **Collaboration** | ✅ Real-time | ❌ |
| **Ollama** | Via API | Direct local |
| **Auto-updates** | N/A | ✅ Built-in |
| **Offline Mode** | ❌ | ✅ Full |
| **MCP Servers** | Container | Local process |

---

## 14. Updated Success Criteria

### Desktop & Local Deployment

- [ ] Desktop app builds and runs on Windows, macOS, and Linux
- [ ] Auto-update mechanism works correctly
- [ ] Ollama integration works seamlessly in desktop mode
- [ ] SQLite database handles all operations correctly
- [ ] Desktop app can export/import agent configurations
- [ ] Local MCP servers can be managed from desktop app

### CI/CD & Infrastructure

- [ ] All tests pass in CI pipeline
- [ ] Docker images build and push correctly
- [ ] Kubernetes deployments are successful
- [ ] Database migrations run without issues
- [ ] Security scans report no critical vulnerabilities
- [ ] Staging environment mirrors production

### Authentication & Security

- [ ] Auth0 integration works for web application
- [ ] API keys can be created and managed
- [ ] Role-based access control enforces permissions
- [ ] Provider credentials are encrypted at rest
- [ ] Rate limiting prevents abuse

---

## Next Steps

1. Review this PRD
2. Set up project structure
3. Begin Phase 1 implementation
4. Iterative development with user feedback
