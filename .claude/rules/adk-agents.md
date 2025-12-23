---
paths: agent/agents/**/*.py
---

# Google ADK Agent Implementation Rules

## Agent Structure

- Agents extend `LlmAgent` or `BaseAgent`
- Define `name` as unique identifier
- Use `description` for orchestrator routing decisions
- Keep `instruction` focused and actionable

## State Management

- Use `output_key` for state passing between agents
- Access state via `ctx.session.state.get("key")`
- Set state via `ctx.session.state["key"] = value`
- Use unique keys to avoid collisions in parallel execution

## LlmAgent Pattern

```python
agent = LlmAgent(
    name="unique_name",
    model="gemini-2.5-flash",  # or LiteLlm(model="provider/model")
    description="Clear description for routing",
    instruction="Specific instructions for the agent",
    tools=[...],  # MCP tools or FunctionTools
    output_key="result_key"  # For state passing
)
```

## Composite Agents

### SequentialAgent

- Order matters: first to last execution
- Each sub-agent can access previous outputs via state
- Minimum 2 sub-agents required

### ParallelAgent

- All sub-agents run concurrently
- Each MUST have unique `output_key`
- Results collected after all complete

### LoopAgent

- Set `max_iterations` to prevent infinite loops
- Include termination condition in sub-agent logic
- Use for iterative refinement patterns

## Custom Agents

- Extend `BaseAgent` for custom logic
- Implement `_run_async_impl(self, ctx)` method
- Yield events from sub-agents when delegating
- Use for conditional routing or complex workflows

## Tool Integration

- Register MCP tools via `FunctionTool.from_mcp_tool()`
- Use `@FunctionTool` decorator for Python functions
- Include clear parameter descriptions
- Handle tool errors gracefully

## Multi-Model Support

```python
# Native Gemini
model="gemini-2.5-flash"

# Via LiteLLM
from google.adk.models.lite_llm import LiteLlm
model=LiteLlm(model="openai/gpt-4o")
model=LiteLlm(model="anthropic/claude-3-haiku-20240307")
model=LiteLlm(model="ollama_chat/llama3.2")
```

## Testing Agents

- Test agents in isolation before composition
- Mock MCP tools for unit tests
- Use `InMemorySessionService` for testing
- Verify state changes after execution
