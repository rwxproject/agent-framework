"""FastAPI application entrypoint for Agent Framework."""

from contextlib import asynccontextmanager

from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agents import orchestrator


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("Agent Framework starting up...")
    yield
    # Shutdown
    print("Agent Framework shutting down...")


app = FastAPI(
    title="Agent Framework",
    description="Agentic Application Platform with Google ADK and CopilotKit",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "0.1.0"}


# Create ADK agent wrapper for CopilotKit
adk_agent = ADKAgent(
    adk_agent=orchestrator,
    app_name="agent_framework",
    user_id="default_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True,
)

# CopilotKit runtime endpoint
add_adk_fastapi_endpoint(app, adk_agent, path="/api/copilotkit")
