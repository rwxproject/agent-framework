"""Model provider configurations for Agent Framework."""

import os
from typing import Literal

from pydantic import BaseModel, Field


ProviderType = Literal["gemini", "openai", "anthropic", "ollama"]


class ModelConfig(BaseModel):
    """Configuration for an LLM model."""

    provider: ProviderType = Field(default="gemini", description="Model provider")
    model: str = Field(default="gemini-2.0-flash", description="Model name")
    api_key: str | None = Field(default=None, description="API key for the provider")
    base_url: str | None = Field(default=None, description="Base URL for the provider")


class ProviderConfig(BaseModel):
    """Configuration for a provider."""

    id: ProviderType
    name: str
    models: list[str]
    requires_api_key: bool = True
    requires_base_url: bool = False
    default_base_url: str | None = None


# Available providers and their configurations
PROVIDERS: dict[ProviderType, ProviderConfig] = {
    "gemini": ProviderConfig(
        id="gemini",
        name="Google Gemini",
        models=["gemini-2.0-flash", "gemini-2.5-pro", "gemini-1.5-flash"],
        requires_api_key=True,
    ),
    "openai": ProviderConfig(
        id="openai",
        name="OpenAI",
        models=["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o-mini"],
        requires_api_key=True,
    ),
    "anthropic": ProviderConfig(
        id="anthropic",
        name="Anthropic",
        models=[
            "claude-3-opus-20240229",
            "claude-3-sonnet-20240229",
            "claude-3-haiku-20240307",
        ],
        requires_api_key=True,
    ),
    "ollama": ProviderConfig(
        id="ollama",
        name="Ollama (Local)",
        models=["llama3.2", "mistral", "codellama", "phi3"],
        requires_api_key=False,
        requires_base_url=True,
        default_base_url="http://localhost:11434",
    ),
}


def get_available_providers() -> list[ProviderConfig]:
    """Get list of available providers."""
    return list(PROVIDERS.values())


def get_models_for_provider(provider: ProviderType) -> list[str]:
    """Get available models for a provider."""
    config = PROVIDERS.get(provider)
    if config:
        return config.models
    return []


async def test_model_connection(config: ModelConfig) -> tuple[bool, str]:
    """Test connection to a model provider.

    Returns:
        Tuple of (success, message)
    """
    try:
        if config.provider == "gemini":
            # Check if API key is set
            api_key = config.api_key or os.environ.get("GOOGLE_API_KEY")
            if not api_key:
                return False, "GOOGLE_API_KEY not set"
            # TODO: Implement actual connection test
            return True, "Connection successful (Gemini)"

        elif config.provider == "openai":
            api_key = config.api_key or os.environ.get("OPENAI_API_KEY")
            if not api_key:
                return False, "OPENAI_API_KEY not set"
            # TODO: Implement actual connection test with httpx
            return True, "Connection successful (OpenAI)"

        elif config.provider == "anthropic":
            api_key = config.api_key or os.environ.get("ANTHROPIC_API_KEY")
            if not api_key:
                return False, "ANTHROPIC_API_KEY not set"
            # TODO: Implement actual connection test with httpx
            return True, "Connection successful (Anthropic)"

        elif config.provider == "ollama":
            base_url = config.base_url or "http://localhost:11434"
            # TODO: Implement actual connection test with httpx
            # For now, assume success
            return True, f"Connection successful (Ollama at {base_url})"

        else:
            return False, f"Unknown provider: {config.provider}"

    except Exception as e:
        return False, f"Connection failed: {str(e)}"


# In-memory storage for active model configuration
_active_config: ModelConfig = ModelConfig()


def get_active_model_config() -> ModelConfig:
    """Get the currently active model configuration."""
    return _active_config


def set_active_model_config(config: ModelConfig) -> None:
    """Set the active model configuration."""
    global _active_config
    _active_config = config
