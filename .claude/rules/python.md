---
paths: agent/**/*.py
---

# Python Development Rules

## Type Safety

- Use type hints for all function parameters and return types
- Use `TypeVar` and `Generic` for generic types
- Prefer `list[T]` over `List[T]` (Python 3.9+ syntax)
- Use `T | None` instead of `Optional[T]`

## Data Models

- Use Pydantic `BaseModel` for all data structures
- Define `model_config` for serialization settings
- Use `Field()` with descriptions for documentation
- Validate input at API boundaries

## Async Patterns

- Use `async/await` for all IO operations
- Use `asyncio.gather()` for parallel operations
- Handle cancellation with `try/except asyncio.CancelledError`
- Use `httpx.AsyncClient` for HTTP requests

## Code Style

- Follow PEP 8 with ruff formatting
- Maximum line length: 88 characters
- Use absolute imports from project root
- Group imports: stdlib, third-party, local

## Documentation

- Include docstrings for public functions and classes
- Use Google-style docstring format
- Document exceptions that can be raised
- Keep docstrings concise and actionable

## Error Handling

- Use custom exception classes for domain errors
- Log errors with structured context
- Return meaningful error messages to clients
- Don't catch broad exceptions unless re-raising

## Package Management

- Always use `uv` (NOT pip or poetry)
- Add dependencies: `uv add <package>`
- Dev dependencies: `uv add --dev <package>`
- Run commands: `uv run <command>`
