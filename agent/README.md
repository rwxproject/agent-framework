# Agent Framework - Backend

Python backend for the Agent Framework platform using Google ADK and FastAPI.

## Setup

```bash
uv venv --python 3.13
source .venv/bin/activate
uv sync --all-extras
```

## Development

```bash
# Run server
uv run uvicorn main:app --reload

# Run tests
uv run pytest

# Lint
uv run ruff check .
uv run ruff format .
```

## Structure

```
agent/
├── main.py           # FastAPI entrypoint
├── agents/           # ADK agent definitions
├── state/            # Shared state models
├── api/              # API endpoints
└── tests/            # Test suites
```
