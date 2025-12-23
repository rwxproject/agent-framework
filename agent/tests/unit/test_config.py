"""Unit tests for config module."""

import pytest
from config.models import (
    ModelConfig,
    ProviderConfig,
    get_available_providers,
    get_models_for_provider,
    get_active_model_config,
    set_active_model_config,
    PROVIDERS,
)


def test_model_config_defaults():
    """Test ModelConfig default values."""
    config = ModelConfig()
    assert config.provider == "gemini"
    assert config.model == "gemini-2.0-flash"
    assert config.api_key is None
    assert config.base_url is None


def test_model_config_custom_values():
    """Test ModelConfig with custom values."""
    config = ModelConfig(
        provider="openai",
        model="gpt-4o",
        api_key="test-key",
        base_url="https://api.openai.com",
    )
    assert config.provider == "openai"
    assert config.model == "gpt-4o"
    assert config.api_key == "test-key"
    assert config.base_url == "https://api.openai.com"


def test_provider_config_structure():
    """Test ProviderConfig structure."""
    gemini = PROVIDERS["gemini"]
    assert isinstance(gemini, ProviderConfig)
    assert gemini.id == "gemini"
    assert gemini.name == "Google Gemini"
    assert len(gemini.models) > 0
    assert gemini.requires_api_key is True


def test_all_providers_exist():
    """Test that all expected providers are configured."""
    expected = ["gemini", "openai", "anthropic", "ollama"]
    for provider_id in expected:
        assert provider_id in PROVIDERS


def test_get_available_providers():
    """Test get_available_providers returns all providers."""
    providers = get_available_providers()
    assert len(providers) == 4
    assert all(isinstance(p, ProviderConfig) for p in providers)


def test_get_models_for_provider_gemini():
    """Test getting models for Gemini provider."""
    models = get_models_for_provider("gemini")
    assert "gemini-2.0-flash" in models
    assert "gemini-2.5-pro" in models


def test_get_models_for_provider_openai():
    """Test getting models for OpenAI provider."""
    models = get_models_for_provider("openai")
    assert "gpt-4o" in models
    assert "gpt-4-turbo" in models


def test_get_models_for_provider_anthropic():
    """Test getting models for Anthropic provider."""
    models = get_models_for_provider("anthropic")
    assert any("claude" in m for m in models)


def test_get_models_for_provider_ollama():
    """Test getting models for Ollama provider."""
    models = get_models_for_provider("ollama")
    assert "llama3.2" in models


def test_get_models_for_unknown_provider():
    """Test getting models for unknown provider returns empty list."""
    models = get_models_for_provider("unknown")
    assert models == []


def test_active_model_config_get_set():
    """Test getting and setting active model config."""
    original = get_active_model_config()

    new_config = ModelConfig(provider="openai", model="gpt-4o")
    set_active_model_config(new_config)

    active = get_active_model_config()
    assert active.provider == "openai"
    assert active.model == "gpt-4o"

    # Reset to original
    set_active_model_config(original)


def test_ollama_provider_config():
    """Test Ollama provider has correct configuration."""
    ollama = PROVIDERS["ollama"]
    assert ollama.requires_api_key is False
    assert ollama.requires_base_url is True
    assert ollama.default_base_url == "http://localhost:11434"
