"""Shared state models for the orchestrator agent."""

from pydantic import BaseModel


class OrchestratorState(BaseModel):
    """State shared between the orchestrator agent and the frontend.

    This state is synchronized via CopilotKit's useCoAgent hook.
    """

    current_task: str | None = None
    progress: float = 0.0
    active_agents: list[str] = []
    conversation_context: dict = {}
