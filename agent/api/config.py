"""Configuration API endpoints for Agent Framework."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.models import (
    ModelConfig,
    ProviderConfig,
    get_available_providers,
    get_models_for_provider,
    get_active_model_config,
    set_active_model_config,
    test_model_connection,
)


router = APIRouter(prefix="/api/config", tags=["configuration"])


class ProvidersResponse(BaseModel):
    """Response for available providers."""

    providers: list[ProviderConfig]


class ModelsResponse(BaseModel):
    """Response for available models."""

    models: list[str]


class ActiveModelResponse(BaseModel):
    """Response for active model configuration."""

    config: ModelConfig


class TestConnectionRequest(BaseModel):
    """Request to test a model connection."""

    provider: str
    model: str
    api_key: str | None = None
    base_url: str | None = None


class TestConnectionResponse(BaseModel):
    """Response for connection test."""

    success: bool
    message: str


@router.get("/models", response_model=ProvidersResponse)
async def get_models() -> ProvidersResponse:
    """Get list of available model providers and their models."""
    providers = get_available_providers()
    return ProvidersResponse(providers=providers)


@router.get("/models/{provider}", response_model=ModelsResponse)
async def get_provider_models(provider: str) -> ModelsResponse:
    """Get available models for a specific provider."""
    models = get_models_for_provider(provider)  # type: ignore
    if not models:
        raise HTTPException(status_code=404, detail=f"Provider not found: {provider}")
    return ModelsResponse(models=models)


@router.get("/models/active", response_model=ActiveModelResponse)
async def get_active_model() -> ActiveModelResponse:
    """Get the currently active model configuration."""
    config = get_active_model_config()
    return ActiveModelResponse(config=config)


@router.post("/models/active", response_model=ActiveModelResponse)
async def set_active_model(config: ModelConfig) -> ActiveModelResponse:
    """Set the active model configuration."""
    set_active_model_config(config)
    return ActiveModelResponse(config=config)


@router.post("/models/test", response_model=TestConnectionResponse)
async def test_connection(request: TestConnectionRequest) -> TestConnectionResponse:
    """Test connection to a model provider."""
    config = ModelConfig(
        provider=request.provider,  # type: ignore
        model=request.model,
        api_key=request.api_key,
        base_url=request.base_url,
    )
    success, message = await test_model_connection(config)
    return TestConnectionResponse(success=success, message=message)
