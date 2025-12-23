# Claude Code Infrastructure Guide

> Comprehensive documentation for the Claude Code development environment configured for the Agent Framework project.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Environment Setup](#environment-setup)
- [Plugins](#plugins)
- [Custom Subagents](#custom-subagents)
- [Project Skills](#project-skills)
- [Modular Rules](#modular-rules)
- [MCP Servers](#mcp-servers)
- [Automation Hooks](#automation-hooks)
- [Git Worktrees](#git-worktrees)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project uses Claude Code as the primary AI-assisted development environment. The configuration enables:

- **Distributed Development**: Multiple parallel workstreams via git worktrees
- **Domain Expertise**: Custom subagents specialized for ADK, CopilotKit, MCP, etc.
- **Project Knowledge**: Skills that encode project-specific patterns and workflows
- **Automation**: Hooks for auto-formatting and safety checks
- **Tool Integration**: MCP servers for GitHub, filesystem, browser automation, and documentation

### Why This Configuration?

The Agent Framework is a complex full-stack platform spanning:

- Python backend (FastAPI, Google ADK, MCP)
- React frontend (Next.js, CopilotKit, React Flow)
- Multiple protocols (AG-UI, MCP, A2A)
- Infrastructure (Docker, Kubernetes, Auth0)

A single Claude Code session cannot efficiently handle all domains. This configuration enables:

1. **Specialized agents** that understand specific parts of the stack
2. **Parallel development** across isolated git worktrees
3. **Consistent patterns** via skills and rules
4. **Automated quality** via formatting hooks

---

## Architecture

```text
.claude/
├── settings.json          # Plugins, hooks configuration
├── agents/                # Custom subagents (5 specialists)
│   ├── adk-specialist.md
│   ├── copilotkit-specialist.md
│   ├── workflow-designer.md
│   ├── mcp-integrator.md
│   └── a2a-orchestrator.md
├── skills/                # Project-specific skills (4 skills)
│   ├── agent-config-validator/
│   ├── mcp-tester/
│   ├── workflow-compiler/
│   └── hitl-patterns/
└── rules/                 # File-type specific rules (3 rule sets)
    ├── python.md
    ├── typescript.md
    └── adk-agents.md

.mcp.json                  # MCP server configurations (5 servers)
CLAUDE.md                  # Project-wide instructions
```

---

## Environment Setup

### Prerequisites

1. **Claude Code CLI** installed and authenticated
2. **Node.js 18+** for MCP servers
3. **Python 3.13+** with `uv` package manager
4. **Bun** for frontend development
5. **GitHub Personal Access Token** for GitHub MCP server

### GitHub Token Configuration

The GitHub MCP server requires a Personal Access Token (PAT) to interact with GitHub APIs.

#### Step 1: Create a GitHub PAT

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Set expiration as needed
4. Select scopes:
   - `repo` - Full repository access
   - `read:org` - Read organization data
   - `read:user` - Read user profile data
   - `workflow` - Update GitHub Action workflows (optional)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

#### Step 2: Set Environment Variable

Add to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

Reload your shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

#### Step 3: Verify Configuration

The token is referenced in `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

The `${GITHUB_TOKEN}` syntax automatically expands to your environment variable.

#### Security Notes

- **Never commit tokens** to git
- Use environment variables or secret managers
- Rotate tokens periodically
- Use minimum required scopes
- The `.gitignore` is configured to exclude `.env` files

---

## Plugins

### Enabled Plugins

| Plugin | Purpose |
|--------|---------|
| `code-review` | Code review with project guidelines |
| `commit-commands` | Git commit, push, PR workflows |
| `feature-dev` | Feature development assistance |
| `frontend-design` | UI/UX design and implementation |
| `plugin-dev` | Claude Code plugin development |
| `pr-review-toolkit` | Comprehensive PR review agents |
| `agent-sdk-dev` | Claude Agent SDK development |

### Plugin Capabilities

#### pr-review-toolkit Agents

- `code-reviewer` - Style and best practices
- `code-simplifier` - Code clarity and maintainability
- `comment-analyzer` - Documentation accuracy
- `pr-test-analyzer` - Test coverage quality
- `silent-failure-hunter` - Error handling gaps
- `type-design-analyzer` - Type system design

#### plugin-dev Agents

- `agent-creator` - Create new Claude Code agents
- `plugin-validator` - Validate plugin structure
- `skill-reviewer` - Review skill quality

### Using Plugins

Plugins are automatically available. Use slash commands:

```text
/commit              # Create a git commit
/commit-push-pr      # Commit, push, and create PR
/code-review         # Review code changes
/review-pr           # Comprehensive PR review
```

---

## Custom Subagents

### Available Agents

#### 1. adk-specialist

**Trigger:** Backend ADK work, agent orchestrators, Python workflows

**Expertise:**

- Google ADK agent patterns (LlmAgent, SequentialAgent, ParallelAgent, LoopAgent)
- MCP tool integration with ADK
- State management and output keys
- Multi-model support via LiteLLM
- FastAPI integration

**Example use:**

```text
Use the adk-specialist agent to implement a research workflow with parallel information gathering
```

#### 2. copilotkit-specialist

**Trigger:** Frontend work, chat interfaces, HITL components

**Expertise:**

- CopilotKit hooks (useHumanInTheLoop, useCoAgentStateRender, useRenderToolCall)
- Generative UI patterns
- Shared state management
- AG-UI protocol integration

**Example use:**

```text
Use the copilotkit-specialist to implement an approval dialog for sensitive actions
```

#### 3. workflow-designer

**Trigger:** Visual workflow canvas, React Flow implementation

**Expertise:**

- Custom node types (LLM, Sequential, Parallel, Loop, Condition)
- Edge handling and validation
- Workflow serialization
- Code generation from visual workflows

**Example use:**

```text
Use the workflow-designer agent to create a custom Loop node for the workflow canvas
```

#### 4. mcp-integrator

**Trigger:** MCP server connections, tool testing, dynamic tool loading

**Expertise:**

- MCP server types (stdio, http, sse)
- Tool registration and discovery
- Server health monitoring
- Custom MCP server development

**Example use:**

```text
Use the mcp-integrator to test the new database MCP server connection
```

#### 5. a2a-orchestrator

**Trigger:** Multi-agent patterns, agent routing, distributed systems

**Expertise:**

- A2A protocol implementation
- Agent card metadata
- Intelligent routing logic
- Multi-framework coordination (ADK, LangGraph, CrewAI)

**Example use:**

```text
Use the a2a-orchestrator to implement capability-based agent routing
```

---

## Project Skills

### Available Skills

#### 1. agent-config-validator

**Purpose:** Validate AgentConfig definitions against the schema

**When to use:**

- Creating new agent configurations
- Modifying existing agents
- Debugging agent initialization errors

**Validation rules:**

- Required fields: id, name, type, description
- Type-specific requirements (modelConfig for LLM agents)
- Tool reference validation
- Sub-agent reference validation
- Unique output keys for parallel agents

#### 2. mcp-tester

**Purpose:** Test MCP server connectivity and tool execution

**When to use:**

- Adding new MCP servers
- Debugging tool integration
- Verifying tool availability
- Testing server health

**Test categories:**

- Connection tests
- Tool discovery
- Tool execution
- Error handling

#### 3. workflow-compiler

**Purpose:** Compile visual workflow canvas to Google ADK Python code

**When to use:**

- Generating executable code from WorkflowCanvas
- Understanding workflow-to-code mapping
- Debugging generated agent code

**Compilation process:**

1. Parse WorkflowCanvas JSON
2. Build agent hierarchy from nodes
3. Generate ADK Python code
4. Validate generated code

#### 4. hitl-patterns

**Purpose:** Human-in-the-Loop pattern library for CopilotKit

**When to use:**

- Implementing approval workflows
- Building user input forms
- Creating option selectors
- Adding progress confirmation

**Available patterns:**

- Approval Dialog (approveAction hook)
- Dynamic Form (collectUserInput hook)
- Option Selector (selectOption hook)
- Progress Confirmation (confirmProgress hook)

---

## Modular Rules

### Rule Files

Rules are applied based on file path patterns.

#### python.md

**Applies to:** `agent/**/*.py`

**Enforces:**

- Type hints for all functions
- Pydantic for data models
- Async/await for IO operations
- PEP 8 with ruff formatting
- `uv` for package management

#### typescript.md

**Applies to:** `ui/**/*.{ts,tsx}`

**Enforces:**

- Functional components with hooks
- Interface over type for objects
- Tailwind CSS for styling
- CopilotKit integration patterns
- `bun` for package management

#### adk-agents.md

**Applies to:** `agent/agents/**/*.py`

**Enforces:**

- Proper agent structure
- State management patterns
- LlmAgent and BaseAgent patterns
- Tool integration standards
- Multi-model configuration

---

## MCP Servers

### Configured Servers

| Server | Type | Purpose |
|--------|------|---------|
| `context7` | HTTP | Documentation lookup for any library |
| `playwright` | stdio | Browser automation and testing |
| `copilotkit-mcp` | SSE | CopilotKit documentation and code search |
| `github` | stdio | GitHub API integration |
| `filesystem` | stdio | File system operations |

### GitHub MCP Server

**Capabilities:**

- Repository management
- Issue and PR operations
- Branch and commit operations
- File content retrieval
- Organization data access

**Configuration:**

```json
{
  "github": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

**Required Environment Variable:**

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

### Filesystem MCP Server

**Capabilities:**

- Read file contents
- Write files
- List directories
- Search files
- Watch for changes

**Scoped to:** `/Volumes/External/rwxproject/agent-framework`

### Context7 Server

**Capabilities:**

- Look up documentation for any library
- Search code examples
- Get API references

**Usage:**

```text
Look up the CopilotKit useHumanInTheLoop hook documentation
```

### Playwright Server

**Capabilities:**

- Navigate web pages
- Take screenshots
- Click elements
- Fill forms
- Execute JavaScript

---

## Automation Hooks

### PostToolUse Hooks

Triggered after Edit or Write operations:

#### Python Auto-Format

```bash
# Automatically formats .py files with ruff
uv run ruff format "$FILE"
```

#### TypeScript Auto-Format

```bash
# Automatically formats .ts/.tsx files with prettier
bunx prettier --write "$FILE"
```

### PreToolUse Hooks

Triggered before Bash commands:

#### Dangerous Command Blocker

Blocks potentially destructive commands:

- `rm -rf /` - Root deletion
- `DROP DATABASE` - Database destruction
- `:(){ :|:& };:` - Fork bomb
- `push --force` to main/master

---

## Git Worktrees

### Purpose

Git worktrees enable parallel development across multiple features without branch switching.

### Created Worktrees

| Directory | Branch | Purpose |
|-----------|--------|---------|
| `agent-framework/` | feature/getting_started | Main workspace |
| `af-frontend/` | feature/frontend | CopilotKit UI development |
| `af-backend/` | feature/backend | ADK agent development |
| `af-canvas/` | feature/canvas | React Flow workflow canvas |
| `af-mcp/` | feature/mcp | MCP integration work |
| `af-a2a/` | feature/a2a | A2A orchestration |

### Working with Worktrees

#### List All Worktrees

```bash
git worktree list
```

#### Open Claude Code in a Worktree

```bash
cd /Volumes/External/rwxproject/af-frontend
claude
```

#### Create a New Worktree

```bash
git worktree add ../af-newfeature -b feature/newfeature
```

#### Remove a Worktree

```bash
git worktree remove ../af-frontend
```

### Parallel Development Workflow

1. **Choose domain**: Frontend, Backend, Canvas, MCP, or A2A
2. **Navigate to worktree**: `cd ../af-frontend`
3. **Start Claude Code**: `claude`
4. **Develop in isolation**: Changes don't affect other worktrees
5. **Merge when ready**: Create PR from feature branch

---

## Usage Examples

### Example 1: Implement a New Agent

```text
1. cd /Volumes/External/rwxproject/af-backend
2. claude
3. "Use the adk-specialist agent to implement a research agent that gathers information from multiple sources in parallel"
```

### Example 2: Add HITL Component

```text
1. cd /Volumes/External/rwxproject/af-frontend
2. claude
3. "Use the copilotkit-specialist and hitl-patterns skill to implement an approval dialog for database modifications"
```

### Example 3: Test MCP Server

```text
1. "Use the mcp-tester skill to verify the GitHub MCP server is working correctly"
```

### Example 4: Create Workflow Node

```text
1. cd /Volumes/External/rwxproject/af-canvas
2. claude
3. "Use the workflow-designer agent to create a custom Condition node that routes based on sentiment analysis"
```

### Example 5: Implement A2A Routing

```text
1. cd /Volumes/External/rwxproject/af-a2a
2. claude
3. "Use the a2a-orchestrator agent to implement capability-based routing for the research, analysis, and synthesis agents"
```

---

## Troubleshooting

### GitHub MCP Server Not Working

**Symptom:** GitHub operations fail or timeout

**Solution:**

1. Verify token is set:

   ```bash
   echo $GITHUB_TOKEN
   ```

2. Test token validity:

   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
   ```

3. Regenerate token if expired

### Hooks Not Running

**Symptom:** Files not auto-formatted

**Solution:**

1. Check settings.json syntax
2. Verify ruff/prettier are installed:

   ```bash
   uv run ruff --version
   bunx prettier --version
   ```

3. Check hook command paths

### Agent Not Found

**Symptom:** Claude doesn't recognize custom agent

**Solution:**

1. Verify agent file exists in `.claude/agents/`
2. Check frontmatter syntax (YAML with ---)
3. Restart Claude Code session

### Worktree Conflicts

**Symptom:** Can't checkout branch in worktree

**Solution:**

1. Branch already checked out elsewhere:

   ```bash
   git worktree list
   ```

2. Remove conflicting worktree or use different branch

### MCP Server Timeout

**Symptom:** MCP tools not responding

**Solution:**

1. Check server is running (for stdio servers)
2. Verify network connectivity (for HTTP servers)
3. Check server logs:

   ```bash
   DEBUG=mcp:* npx @modelcontextprotocol/inspector stdio -- <command>
   ```

---

## Quick Reference

### Commands

| Action | Command |
|--------|---------|
| Start Claude | `claude` |
| List worktrees | `git worktree list` |
| Test MCP | `npx -y @modelcontextprotocol/inspector stdio -- <cmd>` |
| Format Python | `uv run ruff format .` |
| Format TS | `bunx prettier --write .` |
| Run backend | `uv run uvicorn main:app --reload` |
| Run frontend | `bun dev` |

### Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project-wide instructions |
| `.claude/settings.json` | Plugins and hooks |
| `.claude/agents/*.md` | Custom subagents |
| `.claude/skills/*/SKILL.md` | Project skills |
| `.claude/rules/*.md` | File-type rules |
| `.mcp.json` | MCP server config |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub API access |
| `OPENAI_API_KEY` | OpenAI model access (optional) |
| `ANTHROPIC_API_KEY` | Anthropic model access (optional) |

---

## Maintenance

### Updating Configuration

1. Edit files in `.claude/` directory
2. Restart Claude Code session to apply changes

### Adding New Agents

1. Create `.claude/agents/new-agent.md`
2. Use frontmatter: name, description, tools, model
3. Write system prompt in markdown body

### Adding New Skills

1. Create `.claude/skills/skill-name/SKILL.md`
2. Use frontmatter: name, description, allowed-tools
3. Document patterns in markdown body

### Rotating GitHub Token

1. Generate new token on GitHub
2. Update `GITHUB_TOKEN` environment variable
3. Restart Claude Code session
