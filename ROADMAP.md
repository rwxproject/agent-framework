# Agent Framework Roadmap

> **Current Version:** 0.1.0 (MVP)
> **Last Updated:** December 2024

This document outlines the planned features and milestones for Agent Framework. Each milestone builds upon the previous, progressively adding capabilities.

---

## Current State (v0.1.0 - MVP)

### Implemented Features
- Chat interface with embedded CopilotKit
- Basic orchestrator agent using Google ADK
- Model configuration UI (Gemini, OpenAI, Anthropic, Ollama)
- Dark theme system with customization
- FastAPI backend with health checks
- Configuration API endpoints

### Tech Stack
- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS
- **Backend:** FastAPI, Google ADK, Python 3.13+
- **Protocols:** AG-UI (CopilotKit runtime)

---

## Milestone 2: MCP Integration

**Target:** Q1 2025

### Features
- [ ] MCP server connection management
- [ ] Tool discovery and registration
- [ ] Dynamic tool loading from MCP servers
- [ ] MCP configuration panel in UI
- [ ] Supported transport types:
  - stdio (local processes)
  - SSE (server-sent events)
  - HTTP (REST endpoints)
  - WebSocket

### Infrastructure
- [ ] Docker Compose for local development
- [ ] PostgreSQL for persistent storage
- [ ] Redis for session caching
- [ ] Environment-based configuration

### API Additions
```
POST /api/mcp/servers        - Register MCP server
GET  /api/mcp/servers        - List connected servers
GET  /api/mcp/servers/{id}/tools - List tools from server
POST /api/mcp/tools/execute  - Execute MCP tool
```

---

## Milestone 3: A2A Multi-Agent Coordination

**Target:** Q2 2025

### Features
- [ ] A2A middleware integration
- [ ] Agent discovery and registration
- [ ] Sub-agent delegation patterns
- [ ] Multi-agent conversation routing
- [ ] Agent status monitoring

### Agent Types
- [ ] Research Agent - Web search and information gathering
- [ ] Analysis Agent - Data analysis and insights
- [ ] Code Agent - Code generation and review
- [ ] Custom Agents - User-defined agents

### Patterns
- [ ] Sequential execution (pipeline)
- [ ] Parallel execution (fan-out/gather)
- [ ] Hierarchical delegation
- [ ] Dynamic routing based on task

### API Additions
```
POST /api/a2a/agents         - Register A2A agent
GET  /api/a2a/agents         - List available agents
POST /api/a2a/agents/{id}/invoke - Invoke agent
GET  /api/a2a/agents/{id}/status - Check agent status
```

---

## Milestone 4: Visual Workflow Canvas

**Target:** Q3 2025

### Features
- [ ] React Flow-based workflow designer
- [ ] Drag-and-drop agent composition
- [ ] Visual workflow patterns:
  - Sequential chains
  - Parallel branches
  - Loop constructs
  - Conditional routing
- [ ] Workflow templates library
- [ ] Export workflow as ADK Python code
- [ ] Import existing workflows
- [ ] Live execution preview

### Node Types
- [ ] LLM Agent Node
- [ ] Sequential Container Node
- [ ] Parallel Container Node
- [ ] Loop Container Node
- [ ] Condition/Branch Node
- [ ] MCP Tool Node
- [ ] Custom Agent Node

### API Additions
```
POST /api/workflows          - Create workflow
GET  /api/workflows          - List workflows
GET  /api/workflows/{id}     - Get workflow details
PUT  /api/workflows/{id}     - Update workflow
POST /api/workflows/{id}/run - Execute workflow
POST /api/workflows/{id}/export - Export as Python code
```

---

## Milestone 5: Enterprise Features

**Target:** Q4 2025

### Authentication & Authorization
- [ ] Auth0 integration
- [ ] Role-based access control (RBAC)
- [ ] API key management
- [ ] SSO support

### Observability
- [ ] OpenTelemetry integration
- [ ] Distributed tracing
- [ ] Metrics dashboard
- [ ] Agent execution logs

### Deployment
- [ ] Kubernetes manifests
- [ ] Helm charts
- [ ] Tauri desktop application
- [ ] Multi-tenant architecture

---

## Milestone 6: Advanced Capabilities

**Target:** 2026

### Features
- [ ] Prompt engineering studio
- [ ] Agent fine-tuning interface
- [ ] Workflow versioning and rollback
- [ ] A/B testing for agents
- [ ] Cost optimization insights
- [ ] Model comparison benchmarks

### Integrations
- [ ] GitHub Actions integration
- [ ] Slack bot deployment
- [ ] API marketplace
- [ ] Plugin system

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Priority Areas
1. MCP server implementations
2. Agent templates
3. UI components
4. Documentation

---

## Changelog

### v0.1.0 (December 2024)
- Initial MVP release
- Basic chat interface
- Model configuration (4 providers)
- Dark theme system
