"""Pytest configuration and shared fixtures."""

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from main import app


@pytest.fixture
def client():
    """Synchronous test client for simple tests."""
    return TestClient(app)


@pytest.fixture
async def async_client():
    """Async test client for async tests."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
