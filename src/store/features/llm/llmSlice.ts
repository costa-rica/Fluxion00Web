// src/store/features/llm/llmSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	LLMConfig,
	LLMProvider,
	DEFAULT_LLM_CONFIG,
	DEFAULT_MODELS,
} from "@/types/llm";

export interface LLMState {
	config: LLMConfig;
}

const initialState: LLMState = {
	config: DEFAULT_LLM_CONFIG,
};

export const llmSlice = createSlice({
	name: "llm",
	initialState,
	reducers: {
		setProvider: (state, action: PayloadAction<LLMProvider>) => {
			state.config.provider = action.payload;
			// Reset to default model for the selected provider
			state.config.model = DEFAULT_MODELS[action.payload];
		},

		setModel: (state, action: PayloadAction<string>) => {
			state.config.model = action.payload;
		},

		setConfig: (state, action: PayloadAction<LLMConfig>) => {
			state.config = action.payload;
		},
	},
});

export const { setProvider, setModel, setConfig } = llmSlice.actions;

export default llmSlice.reducer;
