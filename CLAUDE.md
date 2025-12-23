# Agent Framework - Project Instructions

## Project Overview

Agent Framework is a highly configurable Agentic Application Platform built with:

- **Frontend:** Next.js 14+, CopilotKit React UI, React Flow
- **Backend:** FastAPI, Python 3.13, Google ADK
- **Protocols:** AG-UI (agent-UI), MCP (tools), A2A (multi-agent)
- **Database:** PostgreSQL, Redis
- **Auth:** Auth0
- **Infrastructure:** Docker, Kubernetes, GitHub Actions
- **Desktop:** Tauri (for local deployment)

See @docs/PRD.md for full specifications.
See @docs/CLAUDE_CODE_INFRASTRUCTURE.md for Claude Code configuration details.

## Development Workflow

### Package Managers (MANDATORY)

- **Frontend:** Use `bun` (NOT npm/yarn)
- **Backend:** Use `uv` (NOT pip/poetry)

### Getting Started

```bash
# Frontend
cd ui && bun install && bun dev

# Backend
cd agent
uv venv --python 3.13
source .venv/bin/activate
uv sync
uv run uvicorn main:app --reload
```

### Testing

```bash
# Frontend
cd ui && bun test

# Backend
cd agent && uv run pytest
```

### Code Quality

```bash
# Linting
uv run ruff check .
uv run ruff format .

# Type checking
bun run typecheck  # Frontend
uv run pyright     # Backend
```

## Architecture Guidelines

### Agent Types (Google ADK)

| Type | Purpose | Use Case |
|------|---------|----------|
| `LlmAgent` | Single LLM-powered agent | Research, analysis, generation |
| `SequentialAgent` | Pipeline of agents | Multi-step workflows |
| `ParallelAgent` | Concurrent execution | Gather info from multiple sources |
| `LoopAgent` | Iterative refinement | Quality improvement cycles |
| `Custom` | BaseAgent subclasses | Conditional routing, custom logic |

### Agent Configuration Schema

```python
class AgentConfig(BaseModel):
    id: str                    # Unique identifier
    name: str                  # Display name
    type: AgentType            # llm, sequential, parallel, loop, custom
    model_config: ModelConfig  # Provider and model
    description: str           # For orchestrator routing
    instruction: str           # System prompt
    tools: list[str]           # MCP tool IDs
    sub_agents: list[str]      # Sub-agent IDs
    output_key: str | None     # For state passing
```

### Multi-Model Support

Use LiteLLM wrapper for non-Gemini providers:

```python
# Gemini (native - default)
model="gemini-2.5-flash"

# OpenAI via LiteLLM
model=LiteLlm(model="openai/gpt-4o")

# Anthropic via LiteLLM
model=LiteLlm(model="anthropic/claude-3-haiku-20240307")

# Ollama via LiteLLM (local)
model=LiteLlm(model="ollama_chat/llama3.2")
```

### CopilotKit Integration Patterns

```tsx
// Human-in-the-Loop
useHumanInTheLoop({
  name: "approveAction",
  description: "Request user approval",
  render: ({ args, respond }) => <ApprovalDialog {...args} onRespond={respond} />
});

// Shared State
useCoAgentStateRender({
  name: "orchestrator",
  render: ({ state }) => <StateViewer state={state} />
});

// Generative UI
useRenderToolCall("create_chart", ({ arguments: args }) => (
  <ChartComponent data={args.data} />
));
```

### MCP Tool Integration

```python
# Register MCP tools with ADK agent
tools_config = await mcp_registry.get_tools_for_agent(agent_id)
agent = LlmAgent(
    name="agent",
    tools=[
        FunctionTool.from_mcp_tool(tool)
        for tool in tools_config
    ]
)
```

### A2A Multi-Agent Communication

```python
# Discover external agents
agent_card = await registry.discover_agent("http://agent-url")

# Delegate tasks
result = await orchestrator.delegate(
    agent_name="research-agent",
    task="Research topic X"
)
```

## Directory Structure

```text
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
│   └── PRD.md          # Product Requirements Document
├── .claude/             # Claude Code configuration
│   ├── agents/         # Custom subagents
│   ├── skills/         # Project-specific skills
│   └── rules/          # Modular rules
└── docker/             # Docker configurations
```

## Custom Claude Code Subagents

Use these specialized agents for domain-specific tasks:

| Agent | Trigger | Use Case |
|-------|---------|----------|
| `adk-specialist` | Backend ADK work | Agent orchestrators, workflows, MCP integration |
| `copilotkit-specialist` | Frontend work | Chat UI, HITL components, generative UI |
| `workflow-designer` | Canvas work | React Flow nodes, workflow compilation |
| `mcp-integrator` | MCP work | Server connections, tool testing |
| `a2a-orchestrator` | Multi-agent work | A2A routing, agent discovery |

## Project-Specific Skills

| Skill | Use When |
|-------|----------|
| `agent-config-validator` | Creating/modifying agent configurations |
| `mcp-tester` | Adding new MCP servers, debugging tools |
| `workflow-compiler` | Generating ADK code from workflow canvas |
| `hitl-patterns` | Implementing user interaction patterns |

## Markdownlint Mandatory Rules

When writing or editing markdown files, always follow these rules:

- **MD022/blanks-around-headings**: Headings should be surrounded by blank lines
- **MD031/blanks-around-fences**: Fenced code blocks should be surrounded by blank lines
- **MD032/blanks-around-lists**: Lists should be surrounded by blank lines
- **MD040/fenced-code-language**: Fenced code blocks should have a language specified
- **MD060/table-column-style**: Table column style (table pipe needs space to the right for style "compact")

## Git Workflow

- Main branch: `main`
- Feature branches: `feature/<description>`
- Use `/commit-push-pr` skill for PRs
- Require code review before merge
- Use git worktrees for parallel development

### Worktree Setup

```bash
# Create isolated workspaces
git worktree add ../af-frontend -b feature/frontend
git worktree add ../af-backend -b feature/backend
git worktree add ../af-canvas -b feature/canvas
```

## Security Policies

- Never commit `.env` files
- Use environment variables for secrets
- API keys stored in `${ENV_VAR}` format in MCP configs
- Validate all external input (tools, A2A messages)
- Document security assumptions in code

## Common Commands

| Task | Command |
|------|---------|
| Dev Server (UI) | `cd ui && bun dev` |
| Dev Server (API) | `cd agent && uv run uvicorn main:app --reload` |
| Test (UI) | `cd ui && bun test` |
| Test (API) | `cd agent && uv run pytest` |
| Lint | `uv run ruff check .` |
| Format | `uv run ruff format .` |
| Type Check (UI) | `cd ui && bun run typecheck` |
| Type Check (API) | `cd agent && uv run pyright` |
| Build (UI) | `cd ui && bun build` |
| Docker | `docker compose up` |
| MCP Test | `npx -y @modelcontextprotocol/inspector stdio -- <command>` |
