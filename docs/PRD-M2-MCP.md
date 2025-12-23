# Milestone 2: MCP Integration

> **Duration:** 1.5 weeks
> **Goal:** Connect and use MCP tools through the orchestrator
> **Depends on:** Milestone 1 (MVP)

## Overview

Implement MCP (Model Context Protocol) integration:
- Connect to MCP servers (stdio, http, sse)
- Discover and load tools dynamically
- Execute tools through the orchestrator
- Configuration UI for managing servers

## Data Models

### MCPServerConfig

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

interface MCPTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  result_schema?: any;
}
```

### Python Models

```python
from pydantic import BaseModel
from typing import List, Dict, Optional
from enum import Enum

class MCPServerType(str, Enum):
    STDIO = "stdio"
    SSE = "sse"
    HTTP = "http"
    WEBSOCKET = "websocket"

class MCPServerConfig(BaseModel):
    id: str
    name: str
    type: MCPServerType
    url: Optional[str] = None
    command: Optional[str] = None
    args: Optional[List[str]] = None
    env: Optional[Dict[str, str]] = None
    enabled: bool = True

class MCPTool(BaseModel):
    id: str
    name: str
    description: str
    parameters: Dict
    server_id: str
```

## Backend Implementation

### Directory Structure (New Files)

```
agent/
├── mcp/
│   ├── __init__.py
│   ├── manager.py        # MCP connection lifecycle
│   ├── registry.py       # Tool registry
│   └── tools.py          # MCP → ADK tool wrapper
├── api/
│   └── config.py         # Configuration endpoints
└── tests/
    └── unit/
        └── test_mcp.py
```

### MCP Manager

```python
# agent/mcp/manager.py
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from typing import Dict, List
import asyncio

class MCPManager:
    def __init__(self):
        self.servers: Dict[str, MCPServerConfig] = {}
        self.sessions: Dict[str, ClientSession] = {}
        self._tools_cache: Dict[str, List[MCPTool]] = {}

    async def connect(self, config: MCPServerConfig) -> bool:
        """Connect to an MCP server."""
        if config.type == MCPServerType.STDIO:
            return await self._connect_stdio(config)
        elif config.type == MCPServerType.HTTP:
            return await self._connect_http(config)
        # ... other types
        return False

    async def _connect_stdio(self, config: MCPServerConfig) -> bool:
        """Connect to stdio-based MCP server."""
        server_params = StdioServerParameters(
            command=config.command,
            args=config.args or [],
            env=config.env
        )

        read, write = await stdio_client(server_params).__aenter__()
        session = ClientSession(read, write)
        await session.initialize()

        self.sessions[config.id] = session
        self.servers[config.id] = config

        # Cache available tools
        tools_response = await session.list_tools()
        self._tools_cache[config.id] = [
            MCPTool(
                id=f"{config.id}:{tool.name}",
                name=tool.name,
                description=tool.description,
                parameters=tool.inputSchema,
                server_id=config.id
            )
            for tool in tools_response.tools
        ]
        return True

    async def get_tools(self, server_id: str) -> List[MCPTool]:
        """Get available tools from a server."""
        return self._tools_cache.get(server_id, [])

    async def execute_tool(
        self,
        server_id: str,
        tool_name: str,
        args: dict
    ) -> any:
        """Execute a tool on an MCP server."""
        session = self.sessions.get(server_id)
        if not session:
            raise ValueError(f"Server {server_id} not connected")

        result = await session.call_tool(tool_name, args)
        return result.content

    async def disconnect(self, server_id: str):
        """Disconnect from an MCP server."""
        if server_id in self.sessions:
            await self.sessions[server_id].__aexit__(None, None, None)
            del self.sessions[server_id]
            del self.servers[server_id]
            del self._tools_cache[server_id]

    async def test_connection(self, config: MCPServerConfig) -> bool:
        """Test if a server configuration is valid."""
        try:
            await self.connect(config)
            await self.disconnect(config.id)
            return True
        except Exception:
            return False
```

### MCP Tool Wrapper for ADK

```python
# agent/mcp/tools.py
from google.adk.tools import FunctionTool
from typing import Callable
import functools

def create_mcp_tool(mcp_tool: MCPTool, manager: MCPManager) -> FunctionTool:
    """Wrap MCP tool as ADK FunctionTool."""

    async def execute_mcp_tool(ctx, **kwargs):
        """Execute the MCP tool."""
        return await manager.execute_tool(
            mcp_tool.server_id,
            mcp_tool.name,
            kwargs
        )

    # Set function metadata for ADK
    execute_mcp_tool.__name__ = mcp_tool.name
    execute_mcp_tool.__doc__ = mcp_tool.description

    return FunctionTool(
        name=mcp_tool.name,
        description=mcp_tool.description,
        func=execute_mcp_tool,
        parameters=mcp_tool.parameters
    )

def create_all_mcp_tools(manager: MCPManager) -> list[FunctionTool]:
    """Create ADK tools from all connected MCP servers."""
    tools = []
    for server_id in manager.servers:
        for mcp_tool in manager._tools_cache.get(server_id, []):
            tools.append(create_mcp_tool(mcp_tool, manager))
    return tools
```

### Configuration API

```python
# agent/api/config.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List

router = APIRouter(prefix="/api/config")

@router.post("/mcp-servers")
async def add_mcp_server(
    config: MCPServerConfig,
    manager: MCPManager = Depends(get_mcp_manager)
):
    """Add and connect to a new MCP server."""
    try:
        await manager.connect(config)
        return {"status": "connected", "id": config.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/mcp-servers")
async def list_mcp_servers(
    manager: MCPManager = Depends(get_mcp_manager)
) -> List[MCPServerConfig]:
    """List all configured MCP servers."""
    return list(manager.servers.values())

@router.get("/mcp-servers/{server_id}/tools")
async def get_server_tools(
    server_id: str,
    manager: MCPManager = Depends(get_mcp_manager)
) -> List[MCPTool]:
    """Get tools from a specific server."""
    return await manager.get_tools(server_id)

@router.post("/mcp-servers/{server_id}/test")
async def test_server_connection(
    server_id: str,
    manager: MCPManager = Depends(get_mcp_manager)
):
    """Test connection to an MCP server."""
    config = manager.servers.get(server_id)
    if not config:
        raise HTTPException(status_code=404, detail="Server not found")

    success = await manager.test_connection(config)
    return {"status": "ok" if success else "failed"}

@router.delete("/mcp-servers/{server_id}")
async def remove_mcp_server(
    server_id: str,
    manager: MCPManager = Depends(get_mcp_manager)
):
    """Disconnect and remove an MCP server."""
    await manager.disconnect(server_id)
    return {"status": "removed"}
```

## Frontend Implementation

### New Components

```
ui/components/
├── config/
│   ├── MCPPanel.tsx
│   ├── ServerCard.tsx
│   ├── AddServerModal.tsx
│   └── ToolList.tsx
```

### MCP Panel

```tsx
// components/config/MCPPanel.tsx
import { useState, useEffect } from 'react';
import { ServerCard } from './ServerCard';
import { AddServerModal } from './AddServerModal';

interface MCPServer {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  tools: { name: string; description: string }[];
}

export function MCPPanel() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    const res = await fetch('/api/config/mcp-servers');
    setServers(await res.json());
  };

  const handleAddServer = async (config: Omit<MCPServer, 'id' | 'tools'>) => {
    await fetch('/api/config/mcp-servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    fetchServers();
    setShowAddModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">MCP Servers</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add Server
        </button>
      </div>

      <div className="space-y-2">
        {servers.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            onRefresh={fetchServers}
          />
        ))}
      </div>

      {showAddModal && (
        <AddServerModal
          onAdd={handleAddServer}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
```

### Server Card

```tsx
// components/config/ServerCard.tsx
interface ServerCardProps {
  server: MCPServer;
  onRefresh: () => void;
}

export function ServerCard({ server, onRefresh }: ServerCardProps) {
  const [showTools, setShowTools] = useState(false);

  const handleTest = async () => {
    const res = await fetch(`/api/config/mcp-servers/${server.id}/test`, {
      method: 'POST',
    });
    const result = await res.json();
    alert(result.status === 'ok' ? 'Connected!' : 'Connection failed');
  };

  const handleRemove = async () => {
    await fetch(`/api/config/mcp-servers/${server.id}`, {
      method: 'DELETE',
    });
    onRefresh();
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">{server.name}</span>
          <span className="text-sm text-gray-500 ml-2">({server.type})</span>
        </div>
        <div className="space-x-2">
          <button onClick={handleTest} className="text-blue-600">Test</button>
          <button onClick={() => setShowTools(!showTools)} className="text-gray-600">
            {server.tools.length} tools
          </button>
          <button onClick={handleRemove} className="text-red-600">Remove</button>
        </div>
      </div>

      {showTools && (
        <ul className="mt-2 pl-4 text-sm">
          {server.tools.map((tool) => (
            <li key={tool.name}>
              <strong>{tool.name}</strong>: {tool.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config/mcp-servers` | POST | Add MCP server |
| `/api/config/mcp-servers` | GET | List servers |
| `/api/config/mcp-servers/:id` | PUT | Update server |
| `/api/config/mcp-servers/:id` | DELETE | Remove server |
| `/api/config/mcp-servers/:id/test` | POST | Test connection |
| `/api/config/mcp-servers/:id/tools` | GET | Get tools |

## Testing Requirements

### Backend Tests

```python
# tests/unit/test_mcp.py
import pytest
from agent.mcp.manager import MCPManager, MCPServerConfig

@pytest.mark.asyncio
async def test_mcp_manager_connect():
    manager = MCPManager()
    config = MCPServerConfig(
        id="test",
        name="Test Server",
        type="stdio",
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    )

    connected = await manager.connect(config)
    assert connected
    assert "test" in manager.servers

@pytest.mark.asyncio
async def test_mcp_tool_discovery():
    manager = MCPManager()
    # ... connect to server
    tools = await manager.get_tools("test")
    assert len(tools) > 0
```

### Frontend Tests

```typescript
// tests/unit/components/MCPPanel.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MCPPanel } from '@/components/config/MCPPanel';

test('displays MCP servers', async () => {
  render(<MCPPanel />);
  await waitFor(() => {
    expect(screen.getByText('MCP Servers')).toBeInTheDocument();
  });
});
```

## Deliverables Checklist

- [ ] MCPManager connects to stdio servers
- [ ] MCPManager connects to HTTP servers
- [ ] Tools are discovered from servers
- [ ] Tools execute through orchestrator
- [ ] Configuration UI works
- [ ] Connection testing works
- [ ] Server add/remove works
- [ ] Tests pass (80% coverage)
