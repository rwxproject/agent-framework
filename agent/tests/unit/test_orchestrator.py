"""Unit tests for the orchestrator agent."""

from agents.orchestrator import orchestrator


def test_orchestrator_initialization():
    """Test that the orchestrator agent is properly initialized."""
    assert orchestrator.name == "orchestrator"
    assert orchestrator.model == "gemini-2.0-flash"


def test_orchestrator_has_description():
    """Test that the orchestrator has a description for routing."""
    assert orchestrator.description is not None
    assert len(orchestrator.description) > 0


def test_orchestrator_has_instruction():
    """Test that the orchestrator has system instructions."""
    assert orchestrator.instruction is not None
    assert "helpful" in orchestrator.instruction.lower()
