# Milestone 1: MVP - Basic Agent & UI

> **Duration:** 2 weeks
> **Goal:** Working chat interface with basic orchestrator agent

## Overview

Create the foundation with:
- Embedded CopilotChat interface (CopilotKit)
- Basic Google ADK orchestrator agent
- Shared state between frontend and agent
- Streaming responses

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              CopilotKit Provider + CopilotChat              │ │
│  │                (AG-UI Protocol / Shared State)              │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │ AG-UI Events (SSE)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI + Google ADK)                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Orchestrator Agent (Google ADK)                 │ │
│  │              - LlmAgent with Gemini                          │ │
│  │              - Shared state management                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Models

### OrchestratorState

```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class OrchestratorState(BaseModel):
    current_task: Optional[str] = None
    progress: float = 0.0
    active_agents: List[str] = []
    conversation_context: Dict = {}
```

### AgentConfig (Basic)

```typescript
interface ModelConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'custom';
  model: string;
  baseUrl?: string;
  apiKeyEnvVar?: string;
}

interface AgentConfig {
  id: string;
  name: string;
  type: 'llm';  // Only LLM type for MVP
  modelConfig: ModelConfig;
  description: string;
  instruction: string;
  isActive: boolean;
}
```

## Backend Implementation

### Directory Structure

```
agent/
├── pyproject.toml
├── main.py
├── agents/
│   └── orchestrator.py
├── state/
│   └── models.py
├── api/
│   └── copilotkit.py
└── tests/
    ├── conftest.py
    ├── unit/
    │   └── test_orchestrator.py
    └── integration/
        └── test_copilotkit_api.py
```

### Orchestrator Agent

```python
from google.adk.agents import LlmAgent
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint

orchestrator = LlmAgent(
    name="orchestrator",
    model="gemini-2.5-flash",
    instruction="""
    You are a helpful AI assistant for the Agent Framework platform.

    Your responsibilities:
    1. Understand user intent
    2. Provide helpful responses
    3. Update state to reflect current task
    """,
    description="Main orchestrator that handles user requests"
)
```

### FastAPI Setup

```python
from fastapi import FastAPI
from ag_ui_adk import add_adk_fastapi_endpoint

app = FastAPI()

add_adk_fastapi_endpoint(
    app,
    "/api/copilotkit",
    agent=ADKAgent(orchestrator)
)
```

### Dependencies

```toml
[project]
dependencies = [
    "google-adk>=0.1.0",
    "fastapi>=0.115.0",
    "uvicorn>=0.32.0",
    "pydantic>=2.0.0",
    "ag-ui-adk>=0.1.0",
]

[tool.uv]
dev-dependencies = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=5.0.0",
    "httpx>=0.27.0",
    "ruff>=0.8.0",
]
```

## Frontend Implementation

### Directory Structure

```
ui/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── copilotkit/
│           └── route.ts
├── components/
│   ├── chat/
│   │   └── ChatContainer.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── lib/
│   └── state.ts
└── tests/
    ├── setup.ts
    ├── unit/
    └── e2e/
        └── chat.spec.ts
```

### Root Layout

```tsx
// app/layout.tsx
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit" agent="orchestrator">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
```

### Chat Component

```tsx
// components/chat/ChatContainer.tsx
import { CopilotChat } from "@copilotkit/react-ui";

export function ChatContainer() {
  return (
    <CopilotChat
      labels={{
        title: "Agent Framework",
        initial: "How can I help you today?"
      }}
      className="h-full"
    />
  );
}
```

### Shared State Hook

```tsx
// hooks/useAgentState.ts
import { useCoAgent } from "@copilotkit/react-core";

interface OrchestratorState {
  current_task?: string;
  progress: number;
  active_agents: string[];
}

export function useAgentState() {
  return useCoAgent<OrchestratorState>({
    name: "orchestrator"
  });
}
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@copilotkit/react-core": "^1.0.0",
    "@copilotkit/react-ui": "^1.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@playwright/test": "^1.48.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/copilotkit` | POST | CopilotKit runtime (SSE) |

## Testing Requirements

### Backend (Pytest)

```python
# tests/unit/test_orchestrator.py
import pytest
from agent.agents.orchestrator import orchestrator

def test_orchestrator_initialization():
    assert orchestrator.name == "orchestrator"
    assert orchestrator.model == "gemini-2.5-flash"

# tests/integration/test_copilotkit_api.py
@pytest.mark.asyncio
async def test_copilotkit_endpoint(client):
    response = await client.post("/api/copilotkit", json={...})
    assert response.status_code == 200
```

### Frontend (Vitest)

```typescript
// tests/unit/components/ChatContainer.test.tsx
import { render, screen } from '@testing-library/react';
import { ChatContainer } from '@/components/chat/ChatContainer';

test('renders chat interface', () => {
  render(<ChatContainer />);
  expect(screen.getByText('Agent Framework')).toBeInTheDocument();
});
```

### E2E (Playwright)

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test('user can send a message', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="chat-input"]', 'Hello');
  await page.click('[data-testid="send-button"]');
  await expect(page.locator('.assistant-message')).toBeVisible();
});
```

## Deliverables Checklist

- [ ] Backend running on `localhost:8000`
- [ ] Frontend running on `localhost:3000`
- [ ] Chat interface functional
- [ ] Basic agent responds to messages
- [ ] Streaming responses work
- [ ] State synchronization works
- [ ] Backend tests pass (80% coverage)
- [ ] Frontend tests pass (80% coverage)
- [ ] E2E tests pass
