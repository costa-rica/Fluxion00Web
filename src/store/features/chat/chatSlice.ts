// src/store/features/chat/chatSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: ChatState = {
	messages: [],
	isConnected: false,
	isTyping: false,
	clientId: null,
};

export const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setConnected: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload;
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
		},
	},
});

export const { setConnected, setClientId, setTyping, addMessage, clearMessages } =
	chatSlice.actions;

export default chatSlice.reducer;
