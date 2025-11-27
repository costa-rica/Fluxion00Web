// src/store/features/chat/chatSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProgressUpdate } from "@/types/progress";

export interface Message {
	id: string;
	type: "user" | "agent" | "system" | "error";
	content: string;
	timestamp: number;
}

export interface ChatState {
	messages: Message[];
	isConnected: boolean;
	isTyping: boolean;
	clientId: string | null;
	progressHistory: ProgressUpdate[];
}

const initialState: ChatState = {
	messages: [],
	isConnected: false,
	isTyping: false,
	clientId: null,
	progressHistory: [],
};

export const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setConnected: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload;
			// Reset typing indicator when connection state changes
			if (action.payload === true) {
				state.isTyping = false;
			}
		},
		setClientId: (state, action: PayloadAction<string>) => {
			state.clientId = action.payload;
		},
		setTyping: (state, action: PayloadAction<boolean>) => {
			state.isTyping = action.payload;
		},
		addMessage: (state, action: PayloadAction<Message>) => {
			state.messages.push(action.payload);
		},
		clearMessages: (state) => {
			state.messages = [];
			state.progressHistory = [];
			state.isTyping = false;
		},
		addProgress: (state, action: PayloadAction<ProgressUpdate>) => {
			state.progressHistory.push(action.payload);
		},
		clearProgress: (state) => {
			state.progressHistory = [];
		},
	},
});

export const { setConnected, setClientId, setTyping, addMessage, clearMessages, addProgress, clearProgress } =
	chatSlice.actions;

export default chatSlice.reducer;
