"use client";

import { useState, useEffect } from "react";

interface ModelConfig {
  provider: "gemini" | "openai" | "anthropic" | "ollama";
  model: string;
  apiKey: string;
  baseUrl: string;
}

const PROVIDER_MODELS: Record<string, string[]> = {
  gemini: ["gemini-2.0-flash", "gemini-2.5-pro", "gemini-1.5-flash"],
  openai: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o-mini"],
  anthropic: [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  ollama: ["llama3.2", "mistral", "codellama", "phi3"],
};

const PROVIDER_LABELS: Record<string, string> = {
  gemini: "Google Gemini",
  openai: "OpenAI",
  anthropic: "Anthropic",
  ollama: "Ollama (Local)",
};

const DEFAULT_CONFIG: ModelConfig = {
  provider: "gemini",
  model: "gemini-2.0-flash",
  apiKey: "",
  baseUrl: "",
};

export function ModelConfigPanel() {
  const [config, setConfig] = useState<ModelConfig>(DEFAULT_CONFIG);
  const [customModel, setCustomModel] = useState("");
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [testMessage, setTestMessage] = useState("");
  const [saved, setSaved] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("agent-framework-model-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  const handleProviderChange = (provider: ModelConfig["provider"]) => {
    const models = PROVIDER_MODELS[provider];
    setConfig({
      ...config,
      provider,
      model: models[0],
      baseUrl: provider === "ollama" ? "http://localhost:11434" : "",
    });
    setCustomModel("");
  };

  const handleModelChange = (model: string) => {
    if (model === "custom") {
      setConfig({ ...config, model: customModel || "" });
    } else {
      setConfig({ ...config, model });
      setCustomModel("");
    }
  };

  const handleSave = () => {
    const finalConfig = {
      ...config,
      model: customModel || config.model,
    };
    localStorage.setItem(
      "agent-framework-model-config",
      JSON.stringify(finalConfig)
    );
    setConfig(finalConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    setTestMessage("Testing connection...");

    try {
      const response = await fetch("/api/config/models/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: config.provider,
          model: customModel || config.model,
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
        }),
      });

      if (response.ok) {
        setTestStatus("success");
        setTestMessage("Connection successful!");
      } else {
        const error = await response.json();
        setTestStatus("error");
        setTestMessage(error.detail || "Connection failed");
      }
    } catch {
      setTestStatus("error");
      setTestMessage("Could not reach server. Is the backend running?");
    }

    setTimeout(() => {
      setTestStatus("idle");
      setTestMessage("");
    }, 3000);
  };

  const models = PROVIDER_MODELS[config.provider];
  const showApiKey = config.provider !== "ollama";
  const showBaseUrl = config.provider === "ollama";

  return (
    <div className="rounded-lg border p-6 space-y-6">
      {/* Provider Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Provider</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(PROVIDER_MODELS) as ModelConfig["provider"][]).map(
            (provider) => (
              <button
                key={provider}
                onClick={() => handleProviderChange(provider)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  config.provider === provider
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {PROVIDER_LABELS[provider]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Model</label>
        <select
          value={customModel ? "custom" : config.model}
          onChange={(e) => handleModelChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
          <option value="custom">Custom model...</option>
        </select>

        {(customModel ||
          (!models.includes(config.model) && config.model !== "")) && (
          <input
            type="text"
            value={customModel || config.model}
            onChange={(e) => {
              setCustomModel(e.target.value);
              setConfig({ ...config, model: e.target.value });
            }}
            placeholder="Enter custom model name"
            className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* API Key */}
      {showApiKey && (
        <div>
          <label className="block text-sm font-medium mb-2">
            API Key
            <span className="text-gray-500 font-normal ml-2">
              (stored locally)
            </span>
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder={`Enter your ${PROVIDER_LABELS[config.provider]} API key`}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Base URL (for Ollama) */}
      {showBaseUrl && (
        <div>
          <label className="block text-sm font-medium mb-2">Base URL</label>
          <input
            type="text"
            value={config.baseUrl}
            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            placeholder="http://localhost:11434"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {saved ? "Saved!" : "Save Configuration"}
        </button>
        <button
          onClick={handleTestConnection}
          disabled={testStatus === "testing"}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {testStatus === "testing" ? "Testing..." : "Test Connection"}
        </button>

        {/* Status Indicator */}
        {testMessage && (
          <span
            className={`text-sm ${
              testStatus === "success"
                ? "text-green-600"
                : testStatus === "error"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {testMessage}
          </span>
        )}
      </div>

      {/* Current Config Display */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Current:</strong> {PROVIDER_LABELS[config.provider]} /{" "}
          {customModel || config.model}
        </p>
      </div>
    </div>
  );
}
