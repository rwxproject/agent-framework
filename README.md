# Agent Framework

A highly configurable Agentic Application Platform for building, deploying, and managing AI agent workflows.

## Overview

Agent Framework is a full-stack platform that enables users to create custom AI agents through a visual workflow designer, connect them to external tools via MCP (Model Context Protocol), and orchestrate multi-agent systems using A2A (Agent-to-Agent) communication.

### Key Features

- **Visual Workflow Designer** - Drag-and-drop canvas for building agent workflows
- **Multi-Model Support** - Use Gemini, OpenAI, Anthropic, or local models (Ollama)
- **MCP Tool Integration** - Connect agents to any MCP-compatible tool server
- **A2A Orchestration** - Coordinate multiple agents across different frameworks
- **Human-in-the-Loop** - Built-in approval workflows and user interaction patterns
- **Real-time Collaboration** - Live agent state synchronization via AG-UI protocol

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Chat UI    │  │  Workflow   │  │  Agent Management       │  │
│  │ (CopilotKit)│  │  Canvas     │  │  Dashboard              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ AG-UI Protocol
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (FastAPI)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Orchestrator│  │  MCP Layer  │  │  A2A Middleware         │  │
│  │ (Google ADK)│  │  (Tools)    │  │  (Multi-Agent)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │   MCP   │          │ External│          │  Local  │
   │ Servers │          │ Agents  │          │ Models  │
   └─────────┘          └─────────┘          └─────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+, React, TypeScript, Tailwind CSS |
| **Agent UI** | CopilotKit (chat, HITL, generative UI) |
| **Workflow Canvas** | React Flow |
| **Backend** | FastAPI, Python 3.13 |
| **Agent Framework** | Google ADK (Agent Development Kit) |
| **Protocols** | AG-UI, MCP, A2A |
| **Database** | PostgreSQL, Redis |
| **Auth** | Auth0 |
| **Infrastructure** | Docker, Kubernetes |
| **Desktop** | Tauri (optional local deployment) |

## Getting Started

### Prerequisites

- Node.js 18+ and Bun
- Python 3.13+ and uv
- Docker (for local services)
- GitHub account (for MCP integration)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/agent-framework.git
cd agent-framework

# Frontend setup
cd ui
bun install
bun dev

# Backend setup (new terminal)
cd agent
uv venv --python 3.13
source .venv/bin/activate
uv sync
uv run uvicorn main:app --reload
```

### Environment Variables

Create `.env` files in `ui/` and `agent/` directories:

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/agentframework
REDIS_URL=redis://localhost:6379
GOOGLE_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key        # Optional
ANTHROPIC_API_KEY=your_anthropic_key  # Optional

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
AUTH0_SECRET=your_auth0_secret
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
```

## Agent Types

Agent Framework supports multiple agent patterns via Google ADK:

| Type | Description | Use Case |
|------|-------------|----------|
| **LlmAgent** | Single LLM-powered agent | Research, analysis, generation |
| **SequentialAgent** | Pipeline of agents | Multi-step workflows |
| **ParallelAgent** | Concurrent execution | Gather info from multiple sources |
| **LoopAgent** | Iterative refinement | Quality improvement cycles |
| **Custom** | BaseAgent subclasses | Conditional routing, complex logic |

### Example: Research Workflow

```python
from google.adk.agents import LlmAgent, SequentialAgent, ParallelAgent

# Parallel information gathering
gatherer = ParallelAgent(
    name="InfoGatherer",
    sub_agents=[
        LlmAgent(name="WebSearch", output_key="web_results", ...),
        LlmAgent(name="DBSearch", output_key="db_results", ...),
    ]
)

# Sequential synthesis
workflow = SequentialAgent(
    name="ResearchWorkflow",
    sub_agents=[
        gatherer,
        LlmAgent(name="Synthesizer", instruction="Combine {web_results} and {db_results}...")
    ]
)
```

## Multi-Model Support

Use any LLM provider through LiteLLM integration:

```python
from google.adk.agents import LlmAgent
from google.adk.models.lite_llm import LiteLlm

# Gemini (native)
agent = LlmAgent(model="gemini-2.5-flash", ...)

# OpenAI
agent = LlmAgent(model=LiteLlm(model="openai/gpt-4o"), ...)

# Anthropic
agent = LlmAgent(model=LiteLlm(model="anthropic/claude-3-haiku-20240307"), ...)

# Local (Ollama)
agent = LlmAgent(model=LiteLlm(model="ollama_chat/llama3.2"), ...)
```

## MCP Tool Integration

Connect agents to external tools via MCP servers:

```python
# Register MCP tools with agent
tools = await mcp_registry.get_tools(["web_search", "database_query"])
agent = LlmAgent(
    name="ResearchAgent",
    tools=tools,
    instruction="Use available tools to research the topic..."
)
```

## Project Structure

```
agent-framework/
├── ui/                    # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   │   ├── chat/        # CopilotKit chat UI
│   │   ├── canvas/      # React Flow workflow canvas
│   │   └── hitl/        # Human-in-the-loop components
│   └── lib/             # Utilities, hooks, state
├── agent/                # Python backend
│   ├── main.py          # FastAPI entrypoint
│   ├── agents/          # ADK agent definitions
│   ├── orchestrator/    # Orchestration layer
│   ├── mcp/             # MCP server connections
│   ├── a2a/             # A2A middleware
│   └── state/           # State management, models
├── docs/                # Documentation
│   ├── PRD.md          # Product Requirements
│   └── CLAUDE_CODE_INFRASTRUCTURE.md
└── docker/             # Docker configurations
```

## Development

### Package Managers

- **Frontend:** Use `bun` (not npm/yarn)
- **Backend:** Use `uv` (not pip/poetry)

### Commands

| Task | Command |
|------|---------|
| Dev Server (UI) | `cd ui && bun dev` |
| Dev Server (API) | `cd agent && uv run uvicorn main:app --reload` |
| Test (UI) | `cd ui && bun test` |
| Test (API) | `cd agent && uv run pytest` |
| Lint | `uv run ruff check .` |
| Format | `uv run ruff format .` |
| Build (UI) | `cd ui && bun build` |
| Docker | `docker compose up` |

### Claude Code Development

This project is configured for AI-assisted development with Claude Code:

- **5 Custom Subagents** - Specialized for ADK, CopilotKit, Canvas, MCP, A2A
- **4 Project Skills** - Agent validation, MCP testing, workflow compilation, HITL patterns
- **Git Worktrees** - Parallel development across feature branches
- **Automation Hooks** - Auto-formatting on save

See [docs/CLAUDE_CODE_INFRASTRUCTURE.md](docs/CLAUDE_CODE_INFRASTRUCTURE.md) for full details.

## Documentation

- [Product Requirements Document](docs/PRD.md) - Full specifications
- [Claude Code Infrastructure](docs/CLAUDE_CODE_INFRASTRUCTURE.md) - Development environment setup

## License

[MIT](LICENSE)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
