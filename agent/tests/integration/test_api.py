"""Integration tests for the FastAPI application."""

import pytest


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_copilotkit_endpoint_exists(client):
    """Test that the CopilotKit endpoint is registered."""
    # The endpoint should exist but may return 405 for GET
    # since it expects POST with specific payload
    response = client.get("/api/copilotkit")
    # Either 405 Method Not Allowed or 200 means endpoint exists
    assert response.status_code in [200, 405, 422]


@pytest.mark.asyncio
async def test_health_check_async(async_client):
    """Test health check with async client."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
