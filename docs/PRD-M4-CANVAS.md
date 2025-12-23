# Milestone 4: Multi-Agent Canvas

> **Duration:** 2 weeks
> **Goal:** Visual workflow designer with code generation
> **Depends on:** Milestone 1 (MVP)

## Overview

Implement the workflow canvas:
- Visual drag-and-drop workflow designer (React Flow)
- All ADK patterns: Sequential, Parallel, Loop, Conditional
- Workflow validation
- Compilation to Python ADK code

## Data Models

### WorkflowCanvas

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
  position: { x: number; y: number };
  data: {
    label: string;
    config: Partial<AgentConfig>;
    children?: string[];
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'conditional' | 'loop';
  data?: {
    label?: string;
    condition?: string;
    outputKey?: string;
  };
}
```

### ValidationResult

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

## ADK Workflow Patterns

### Pattern 1: Sequential

Agents execute one after another.

```python
from google.adk.agents import SequentialAgent, LlmAgent

pipeline = SequentialAgent(
    name="DataPipeline",
    sub_agents=[
        LlmAgent(name="Validator", output_key="validation"),
        LlmAgent(name="Processor", output_key="result"),
        LlmAgent(name="Reporter")
    ]
)
```

**Canvas Representation:** Vertical chain of nodes

### Pattern 2: Parallel

Agents execute concurrently.

```python
from google.adk.agents import ParallelAgent

gatherer = ParallelAgent(
    name="InfoGatherer",
    sub_agents=[
        LlmAgent(name="WebSearch", output_key="web_results"),
        LlmAgent(name="DBSearch", output_key="db_results"),
    ]
)
```

**Canvas Representation:** Horizontal split

### Pattern 3: Loop

Iterative execution.

```python
from google.adk.agents import LoopAgent

refiner = LoopAgent(
    name="ContentRefiner",
    max_iterations=3,
    sub_agents=[
        LlmAgent(name="Critic", output_key="feedback"),
        LlmAgent(name="Reviser", output_key="revised")
    ]
)
```

**Canvas Representation:** Circular arrow indicator

### Pattern 4: Conditional

Branch based on state.

```python
class ConditionalRouter(BaseAgent):
    async def _run_async_impl(self, ctx):
        result = ctx.session.state.get("analysis_result", "")

        if "positive" in result.lower():
            async for event in self.positive_agent.run_async(ctx):
                yield event
        else:
            async for event in self.negative_agent.run_async(ctx):
                yield event
```

**Canvas Representation:** Diamond decision node

## Frontend Implementation

### Directory Structure

```
ui/components/
├── canvas/
│   ├── WorkflowCanvas.tsx
│   ├── nodes/
│   │   ├── LlmAgentNode.tsx
│   │   ├── SequentialNode.tsx
│   │   ├── ParallelNode.tsx
│   │   ├── LoopNode.tsx
│   │   ├── ConditionNode.tsx
│   │   └── CustomNode.tsx
│   ├── edges/
│   │   ├── DataFlowEdge.tsx
│   │   └── ConditionalEdge.tsx
│   ├── panels/
│   │   ├── NodeConfigPanel.tsx
│   │   ├── WorkflowToolbar.tsx
│   │   └── CodePreview.tsx
│   └── templates/
│       └── PatternTemplates.tsx
```

### Main Canvas Component

```tsx
// components/canvas/WorkflowCanvas.tsx
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { LlmAgentNode } from './nodes/LlmAgentNode';
import { SequentialNode } from './nodes/SequentialNode';
import { ParallelNode } from './nodes/ParallelNode';
import { LoopNode } from './nodes/LoopNode';
import { ConditionNode } from './nodes/ConditionNode';
import { NodeConfigPanel } from './panels/NodeConfigPanel';
import { WorkflowToolbar } from './panels/WorkflowToolbar';

const nodeTypes = {
  llm: LlmAgentNode,
  sequential: SequentialNode,
  parallel: ParallelNode,
  loop: LoopNode,
  condition: ConditionNode,
};

interface WorkflowCanvasProps {
  workflow: WorkflowCanvas;
  onSave: (workflow: WorkflowCanvas) => void;
}

export function WorkflowCanvas({ workflow, onSave }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'default' }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const isValidConnection = useCallback((connection: Connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) return false;

    // Prevent duplicate connections
    const exists = edges.some(
      (e) => e.source === connection.source && e.target === connection.target
    );
    if (exists) return false;

    return true;
  }, [edges]);

  const handleSave = () => {
    onSave({
      ...workflow,
      nodes,
      edges,
      updatedAt: new Date(),
    });
  };

  return (
    <div className="h-full flex">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          isValidConnection={isValidConnection}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <WorkflowToolbar onSave={handleSave} />
      </div>

      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onUpdate={(data) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === selectedNode.id ? { ...n, data } : n))
            );
          }}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
```

### Node Components

```tsx
// components/canvas/nodes/LlmAgentNode.tsx
import { Handle, Position, NodeProps } from '@xyflow/react';

export function LlmAgentNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500">
      <Handle type="target" position={Position.Top} />

      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 bg-blue-500 flex items-center justify-center text-white">
          🤖
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500 text-sm">LLM Agent</div>
        </div>
      </div>

      {data.config?.outputKey && (
        <div className="text-xs text-gray-400 mt-1">
          → {data.config.outputKey}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// components/canvas/nodes/SequentialNode.tsx
export function SequentialNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-50 border-2 border-green-500 min-w-[200px]">
      <Handle type="target" position={Position.Top} />

      <div className="text-lg font-bold text-green-700">{data.label}</div>
      <div className="text-xs text-green-600">Sequential Pipeline</div>

      <div className="border-t border-green-200 mt-2 pt-2">
        {data.children?.length || 0} agents
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// components/canvas/nodes/ParallelNode.tsx
export function ParallelNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-purple-50 border-2 border-purple-500 min-w-[200px]">
      <Handle type="target" position={Position.Top} />

      <div className="text-lg font-bold text-purple-700">{data.label}</div>
      <div className="text-xs text-purple-600">Parallel Execution</div>

      <div className="border-t border-purple-200 mt-2 pt-2">
        {data.children?.length || 0} concurrent agents
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// components/canvas/nodes/LoopNode.tsx
export function LoopNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-orange-50 border-2 border-orange-500 min-w-[200px]">
      <Handle type="target" position={Position.Top} />

      <div className="text-lg font-bold text-orange-700">{data.label}</div>
      <div className="text-xs text-orange-600">
        Loop (max {data.config?.maxIterations || 3} iterations)
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// components/canvas/nodes/ConditionNode.tsx
export function ConditionNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-50 border-2 border-yellow-500 rotate-45 w-24 h-24 flex items-center justify-center">
      <Handle type="target" position={Position.Top} />

      <div className="-rotate-45 text-center">
        <div className="text-sm font-bold">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Right} id="true" />
      <Handle type="source" position={Position.Left} id="false" />
    </div>
  );
}
```

### Code Preview Panel

```tsx
// components/canvas/panels/CodePreview.tsx
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  workflowId: string;
}

export function CodePreview({ workflowId }: CodePreviewProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCode = async () => {
    setLoading(true);
    const res = await fetch(`/api/workflows/${workflowId}/preview`);
    const data = await res.json();
    setCode(data.code);
    setLoading(false);
  };

  useEffect(() => {
    fetchCode();
  }, [workflowId]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 text-white flex justify-between">
        <span>Generated Python Code</span>
        <button onClick={fetchCode} className="text-blue-400">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          Loading...
        </div>
      ) : (
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          className="flex-1 overflow-auto"
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
```

## Backend Implementation

### Directory Structure

```
agent/
├── workflows/
│   ├── __init__.py
│   ├── builder.py      # Canvas → ADK code
│   ├── validator.py    # Workflow validation
│   ├── patterns.py     # Pattern helpers
│   └── serializer.py   # Import/export
├── api/
│   └── workflows.py    # Workflow endpoints
└── tests/
    └── unit/
        └── test_workflows.py
```

### Workflow Builder

```python
# agent/workflows/builder.py
from typing import Dict, List
from agent.state.models import WorkflowCanvas, WorkflowNode

class WorkflowBuilder:
    def compile(self, canvas: WorkflowCanvas) -> str:
        """Compile canvas to Python ADK code."""
        nodes_map = {node.id: node for node in canvas.nodes}

        code = '''"""
Generated workflow: {name}
Description: {description}
"""

from google.adk.agents import LlmAgent, SequentialAgent, ParallelAgent, LoopAgent, BaseAgent
from google.adk.models.lite_llm import LiteLlm

'''.format(name=canvas.name, description=canvas.description)

        # Topological sort to ensure dependencies are defined first
        sorted_nodes = self._topological_sort(canvas.nodes, canvas.edges)

        # Generate agent definitions
        for node in sorted_nodes:
            code += self._compile_node(node, nodes_map)
            code += "\n"

        # Generate root agent assignment
        code += f"\nroot_agent = {self._node_var_name(canvas.rootAgentId)}\n"

        return code

    def _compile_node(self, node: WorkflowNode, nodes_map: Dict) -> str:
        """Compile a single node to Python code."""
        var_name = self._node_var_name(node.id)

        if node.type == 'llm':
            return self._compile_llm_node(var_name, node)
        elif node.type == 'sequential':
            return self._compile_sequential_node(var_name, node, nodes_map)
        elif node.type == 'parallel':
            return self._compile_parallel_node(var_name, node, nodes_map)
        elif node.type == 'loop':
            return self._compile_loop_node(var_name, node, nodes_map)
        else:
            return f"# Unsupported node type: {node.type}\n"

    def _compile_llm_node(self, var_name: str, node: WorkflowNode) -> str:
        config = node.data.get('config', {})
        instruction = config.get('instruction', 'You are a helpful assistant.')
        output_key = config.get('outputKey', '')

        output_key_line = f',\n    output_key="{output_key}"' if output_key else ''

        return f'''{var_name} = LlmAgent(
    name="{node.data['label']}",
    model="gemini-2.5-flash",
    instruction="""{instruction}""",
    description="{node.data.get('label', '')}"{output_key_line}
)
'''

    def _compile_sequential_node(self, var_name: str, node: WorkflowNode, nodes_map: Dict) -> str:
        children = node.data.get('children', [])
        sub_agents = ', '.join([self._node_var_name(c) for c in children])

        return f'''{var_name} = SequentialAgent(
    name="{node.data['label']}",
    sub_agents=[{sub_agents}]
)
'''

    def _compile_parallel_node(self, var_name: str, node: WorkflowNode, nodes_map: Dict) -> str:
        children = node.data.get('children', [])
        sub_agents = ', '.join([self._node_var_name(c) for c in children])

        return f'''{var_name} = ParallelAgent(
    name="{node.data['label']}",
    sub_agents=[{sub_agents}]
)
'''

    def _compile_loop_node(self, var_name: str, node: WorkflowNode, nodes_map: Dict) -> str:
        children = node.data.get('children', [])
        sub_agents = ', '.join([self._node_var_name(c) for c in children])
        max_iterations = node.data.get('config', {}).get('maxIterations', 3)

        return f'''{var_name} = LoopAgent(
    name="{node.data['label']}",
    max_iterations={max_iterations},
    sub_agents=[{sub_agents}]
)
'''

    def _node_var_name(self, node_id: str) -> str:
        """Convert node ID to valid Python variable name."""
        return node_id.replace('-', '_').lower()

    def _topological_sort(self, nodes: List[WorkflowNode], edges: List) -> List[WorkflowNode]:
        """Sort nodes so dependencies come first."""
        # Simple implementation - can be improved
        return nodes
```

### Workflow Validator

```python
# agent/workflows/validator.py
from typing import List, Set
from agent.state.models import WorkflowCanvas, ValidationResult, ValidationError

class WorkflowValidator:
    def validate(self, canvas: WorkflowCanvas) -> ValidationResult:
        """Validate workflow structure."""
        errors: List[ValidationError] = []
        warnings = []

        # Check root agent exists
        root_exists = any(n.id == canvas.rootAgentId for n in canvas.nodes)
        if not root_exists:
            errors.append(ValidationError(
                code="MISSING_ROOT",
                message=f"Root agent '{canvas.rootAgentId}' not found in nodes"
            ))

        # Check for orphan nodes
        connected_nodes = self._get_connected_nodes(canvas)
        for node in canvas.nodes:
            if node.id not in connected_nodes and node.id != canvas.rootAgentId:
                errors.append(ValidationError(
                    nodeId=node.id,
                    code="ORPHAN_NODE",
                    message=f"Node '{node.data.get('label', node.id)}' is not connected"
                ))

        # Check children references exist
        for node in canvas.nodes:
            for child_id in node.data.get('children', []):
                if not any(n.id == child_id for n in canvas.nodes):
                    errors.append(ValidationError(
                        nodeId=node.id,
                        code="INVALID_CHILD",
                        message=f"Child '{child_id}' not found"
                    ))

        # Check for duplicate output keys in parallel
        for node in canvas.nodes:
            if node.type == 'parallel':
                self._check_parallel_output_keys(node, canvas, errors)

        # Check for cycles (except in loop nodes)
        if self._has_cycle(canvas):
            errors.append(ValidationError(
                code="CYCLE_DETECTED",
                message="Workflow contains a cycle (not in a LoopAgent)"
            ))

        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )

    def _get_connected_nodes(self, canvas: WorkflowCanvas) -> Set[str]:
        """Get all nodes connected via edges."""
        connected = set()
        for edge in canvas.edges:
            connected.add(edge.source)
            connected.add(edge.target)
        return connected

    def _check_parallel_output_keys(self, node, canvas, errors):
        """Check parallel children have unique output keys."""
        output_keys = []
        for child_id in node.data.get('children', []):
            child = next((n for n in canvas.nodes if n.id == child_id), None)
            if child:
                key = child.data.get('config', {}).get('outputKey')
                if key:
                    if key in output_keys:
                        errors.append(ValidationError(
                            nodeId=node.id,
                            code="DUPLICATE_OUTPUT_KEY",
                            message=f"Duplicate output_key '{key}' in parallel agents"
                        ))
                    output_keys.append(key)

    def _has_cycle(self, canvas: WorkflowCanvas) -> bool:
        """Detect cycles (excluding loop nodes)."""
        # Simple cycle detection
        return False  # Implement proper DFS
```

### Workflow API

```python
# agent/api/workflows.py
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/workflows")

@router.post("")
async def create_workflow(workflow: WorkflowCanvas):
    """Create a new workflow."""
    # Save to database
    return {"id": workflow.id, "status": "created"}

@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    """Get workflow by ID."""
    # Load from database
    pass

@router.post("/{workflow_id}/validate")
async def validate_workflow(workflow_id: str):
    """Validate workflow structure."""
    workflow = await get_workflow(workflow_id)
    validator = WorkflowValidator()
    result = validator.validate(workflow)
    return result

@router.get("/{workflow_id}/preview")
async def preview_code(workflow_id: str):
    """Get generated Python code."""
    workflow = await get_workflow(workflow_id)
    builder = WorkflowBuilder()
    code = builder.compile(workflow)
    return {"code": code}

@router.post("/{workflow_id}/compile")
async def compile_workflow(workflow_id: str):
    """Compile and save generated code."""
    workflow = await get_workflow(workflow_id)

    # Validate first
    validator = WorkflowValidator()
    result = validator.validate(workflow)
    if not result.valid:
        raise HTTPException(status_code=400, detail=result.errors)

    # Generate code
    builder = WorkflowBuilder()
    code = builder.compile(workflow)

    # Save compiled code
    workflow.compiled_code = code
    # Save to database

    return {"status": "compiled", "code": code}

@router.post("/{workflow_id}/deploy")
async def deploy_workflow(workflow_id: str):
    """Deploy workflow as active agent."""
    # Compile and register as active agent
    pass
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workflows` | POST | Create workflow |
| `/api/workflows` | GET | List workflows |
| `/api/workflows/:id` | GET | Get workflow |
| `/api/workflows/:id` | PUT | Update workflow |
| `/api/workflows/:id` | DELETE | Delete workflow |
| `/api/workflows/:id/validate` | POST | Validate structure |
| `/api/workflows/:id/preview` | GET | Get generated code |
| `/api/workflows/:id/compile` | POST | Compile workflow |
| `/api/workflows/:id/deploy` | POST | Deploy as agent |

## Testing Requirements

### Backend Tests

```python
# tests/unit/test_workflows.py
import pytest
from agent.workflows.builder import WorkflowBuilder
from agent.workflows.validator import WorkflowValidator

def test_compile_simple_workflow():
    canvas = WorkflowCanvas(
        id="test",
        name="Test",
        nodes=[
            WorkflowNode(id="agent1", type="llm", data={"label": "Agent1"})
        ],
        edges=[],
        rootAgentId="agent1"
    )

    builder = WorkflowBuilder()
    code = builder.compile(canvas)

    assert "LlmAgent" in code
    assert "Agent1" in code

def test_validate_orphan_node():
    canvas = WorkflowCanvas(...)  # with orphan node

    validator = WorkflowValidator()
    result = validator.validate(canvas)

    assert not result.valid
    assert any(e.code == "ORPHAN_NODE" for e in result.errors)
```

### E2E Tests

```typescript
// tests/e2e/canvas.spec.ts
import { test, expect } from '@playwright/test';

test('can create and connect nodes', async ({ page }) => {
  await page.goto('/canvas');

  // Drag node onto canvas
  await page.dragAndDrop('[data-testid="llm-node-template"]', '.react-flow');

  // Verify node appears
  await expect(page.locator('.react-flow__node')).toHaveCount(1);
});
```

## Deliverables Checklist

- [ ] Canvas renders with React Flow
- [ ] All node types work (LLM, Sequential, Parallel, Loop, Condition)
- [ ] Nodes can be connected with edges
- [ ] Connection validation works
- [ ] Workflow validation catches errors
- [ ] Code generation produces valid Python
- [ ] Code preview panel works
- [ ] Save/load workflows works
- [ ] Deploy workflow works
- [ ] Tests pass (80% coverage)
