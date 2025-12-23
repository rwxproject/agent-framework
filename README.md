# Agent Framework

A highly configurable Agentic Application Platform for building, deploying, and managing AI agent workflows.

## Overview

Agent Framework is a full-stack platform that enables users to create custom AI agents through an intuitive interface, configure multiple LLM providers, and build orchestrated agent workflows using Google ADK.

### Current Features (v0.1.0 MVP)

- **Chat Interface** - Embedded AI chat powered by CopilotKit + AG-UI protocol
- **Multi-Model Support** - Configure Gemini, OpenAI, Anthropic, or Ollama
- **Model Configuration UI** - Switch providers and models in the UI
- **Dark Theme System** - Customizable dark mode with color presets
- **Orchestrator Agent** - Basic Google ADK agent with FastAPI backend

### Planned Features

See [ROADMAP.md](ROADMAP.md) for upcoming features including:
- MCP Tool Integration (Milestone 2)
- A2A Multi-Agent Orchestration (Milestone 3)
- Visual Workflow Canvas (Milestone 4)
- Enterprise Features (Milestone 5)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Chat UI    │  │  Config     │  │  Theme                  │  │
│  │ (CopilotKit)│  │  Panel      │  │  Customization          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ AG-UI Protocol
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (FastAPI)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Orchestrator│  │  Config     │  │  Model                  │  │
│  │ (Google ADK)│  │  API        │  │  Providers              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+, React, TypeScript, Tailwind CSS |
| **Agent UI** | CopilotKit (chat, HITL, generative UI) |
| **Backend** | FastAPI, Python 3.13 |
| **Agent Framework** | Google ADK (Agent Development Kit) |
| **Multi-Model** | LiteLLM (OpenAI, Anthropic, Ollama support) |
| **Protocols** | AG-UI |

## Getting Started

### Prerequisites

- Node.js 18+ and Bun
- Python 3.13+ and uv

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

The frontend runs at http://localhost:3000 and the backend at http://localhost:8000.

### Environment Variables

Create `.env` files in `ui/` and `agent/` directories (see `.env.example` files):

```bash
# Backend (agent/.env)
GOOGLE_API_KEY=your_gemini_key          # Required for Gemini
OPENAI_API_KEY=your_openai_key          # Optional
ANTHROPIC_API_KEY=your_anthropic_key    # Optional

# Frontend (ui/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Model Providers

Agent Framework supports multiple LLM providers:

| Provider | Models | Requirements |
|----------|--------|--------------|
| **Gemini** | gemini-2.0-flash, gemini-2.5-pro | `GOOGLE_API_KEY` |
| **OpenAI** | gpt-4o, gpt-4-turbo, gpt-3.5-turbo | `OPENAI_API_KEY` |
| **Anthropic** | claude-3-opus, claude-3-sonnet, claude-3-haiku | `ANTHROPIC_API_KEY` |
| **Ollama** | llama3.2, mistral, codellama | Local Ollama server |

Configure your preferred model in the Configuration page (`/config`).

### Using Ollama (Local Models)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.2

# Start Ollama server
ollama serve
```

Then select "Ollama" as the provider in the Configuration page.

## Project Structure

```
agent-framework/
├── ui/                    # Next.js frontend
│   ├── app/              # App router pages
│   │   ├── page.tsx      # Main chat page
│   │   └── config/       # Configuration page
│   ├── components/       # React components
│   │   ├── chat/        # Chat container
│   │   ├── config/      # Model & theme config panels
│   │   ├── layout/      # Header, sidebar
│   │   └── providers/   # Theme provider
│   └── lib/             # Utilities (theme, etc.)
├── agent/                # Python backend
│   ├── main.py          # FastAPI entrypoint
│   ├── agents/          # ADK agent definitions
│   ├── api/             # API routers
│   └── config/          # Model configurations
├── docs/                # Documentation
│   ├── PRD-SUMMARY.md   # Quick overview
│   ├── PRD-M1-MVP.md    # Milestone 1 specs
│   ├── PRD-M2-MCP.md    # Milestone 2 specs
│   ├── PRD-M3-A2A.md    # Milestone 3 specs
│   └── PRD-M4-CANVAS.md # Milestone 4 specs
└── ROADMAP.md           # Feature roadmap
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
| Test (UI) | `cd ui && bun run test` |
| Test (API) | `cd agent && uv run pytest` |
| Lint | `uv run ruff check .` |
| Format | `uv run ruff format .` |
| Build (UI) | `cd ui && bun run build` |

### Claude Code Development

This project is configured for AI-assisted development with Claude Code. See [CLAUDE.md](CLAUDE.md) for development guidelines and [docs/CLAUDE_CODE_INFRASTRUCTURE.md](docs/CLAUDE_CODE_INFRASTRUCTURE.md) for full setup details.

## Documentation

- [ROADMAP.md](ROADMAP.md) - Feature roadmap and planned milestones
- [CLAUDE.md](CLAUDE.md) - Development guidelines
- [docs/PRD-SUMMARY.md](docs/PRD-SUMMARY.md) - Product overview
- [docs/CLAUDE_CODE_INFRASTRUCTURE.md](docs/CLAUDE_CODE_INFRASTRUCTURE.md) - Claude Code configuration

## License

[MIT](LICENSE)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
