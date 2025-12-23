"""Unit tests for state models."""

from state.models import OrchestratorState


def test_orchestrator_state_defaults():
    """Test that OrchestratorState has correct defaults."""
    state = OrchestratorState()
    assert state.current_task is None
    assert state.progress == 0.0
    assert state.active_agents == []
    assert state.conversation_context == {}


def test_orchestrator_state_with_values():
    """Test that OrchestratorState accepts values."""
    state = OrchestratorState(
        current_task="research",
        progress=0.5,
        active_agents=["orchestrator", "researcher"],
        conversation_context={"topic": "AI agents"},
    )
    assert state.current_task == "research"
    assert state.progress == 0.5
    assert len(state.active_agents) == 2
    assert state.conversation_context["topic"] == "AI agents"


def test_orchestrator_state_serialization():
    """Test that OrchestratorState can be serialized to dict."""
    state = OrchestratorState(current_task="test")
    data = state.model_dump()
    assert data["current_task"] == "test"
    assert "progress" in data
    assert "active_agents" in data
