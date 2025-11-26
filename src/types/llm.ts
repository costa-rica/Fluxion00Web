// src/types/llm.ts

export type LLMProvider = "ollama" | "chatgpt";

export interface LLMConfig {
	provider: LLMProvider;
	model: string;
}

// Available models per provider
export const PROVIDER_MODELS: Record<LLMProvider, string[]> = {
	ollama: ["mistral:instruct"],
	chatgpt: ["gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
};

// Default models per provider
export const DEFAULT_MODELS: Record<LLMProvider, string> = {
	ollama: "mistral:instruct",
	chatgpt: "gpt-4o-mini",
};

export const DEFAULT_LLM_CONFIG: LLMConfig = {
	provider: "ollama",
	model: "mistral:instruct",
};

// Provider display names
export const PROVIDER_LABELS: Record<LLMProvider, string> = {
	ollama: "Ollama",
	chatgpt: "ChatGPT",
};

// Map frontend provider to backend provider
export const PROVIDER_TO_BACKEND: Record<LLMProvider, string> = {
	ollama: "ollama",
	chatgpt: "openai",
};
