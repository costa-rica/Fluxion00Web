// src/hooks/useWebSocket.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setConnected,
	setClientId,
	setTyping,
	addMessage,
} from "@/store/features/chat/chatSlice";

export const useWebSocket = () => {
	const dispatch = useAppDispatch();
	const ws = useRef<WebSocket | null>(null);
	const token = useAppSelector((state) => state.user.token);
	const clientId = useAppSelector((state) => state.chat.clientId);

	// Generate or use existing client ID
	useEffect(() => {
		if (!clientId) {
			const newClientId = crypto.randomUUID();
			dispatch(setClientId(newClientId));
		}
	}, [clientId, dispatch]);

	// Connect to WebSocket
	useEffect(() => {
		if (!token || !clientId) return;

		const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
		const wsUrl = baseUrl.replace(/^http/, "ws");
		const url = `${wsUrl}/ws/${clientId}?token=${token}`;

		console.log("Connecting to WebSocket:", url);

		const websocket = new WebSocket(url);
		ws.current = websocket;

		websocket.onopen = () => {
			console.log("WebSocket connected");
			dispatch(setConnected(true));
		};

		websocket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				console.log("WebSocket message received:", message);

				switch (message.type) {
					case "system":
						dispatch(
							addMessage({
								id: crypto.randomUUID(),
								type: "system",
								content: message.content,
								timestamp: Date.now(),
							})
						);
						break;

					case "user_echo":
						// User message already added when sent, skip
						break;

					case "typing":
						dispatch(setTyping(message.content === true));
						break;

					case "agent_message":
						dispatch(
							addMessage({
								id: crypto.randomUUID(),
								type: "agent",
								content: message.content,
								timestamp: Date.now(),
							})
						);
						break;

					case "error":
						dispatch(
							addMessage({
								id: crypto.randomUUID(),
								type: "error",
								content: message.content,
								timestamp: Date.now(),
							})
						);
						break;

					case "pong":
						// Pong received, keep-alive working
						console.log("Pong received");
						break;

					default:
						console.log("Unknown message type:", message.type);
				}
			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
			}
		};

		websocket.onerror = (error) => {
			console.error("WebSocket error:", error);
			dispatch(setConnected(false));
		};

		websocket.onclose = (event) => {
			console.log("WebSocket closed:", event.code, event.reason);
			dispatch(setConnected(false));
		};

		// Cleanup on unmount
		return () => {
			if (websocket.readyState === WebSocket.OPEN) {
				websocket.close();
			}
		};
	}, [token, clientId, dispatch]);

	// Send message function
	const sendMessage = useCallback(
		(content: string) => {
			if (ws.current && ws.current.readyState === WebSocket.OPEN) {
				// Add user message to Redux immediately
				dispatch(
					addMessage({
						id: crypto.randomUUID(),
						type: "user",
						content,
						timestamp: Date.now(),
					})
				);

				// Send to server
				ws.current.send(
					JSON.stringify({
						type: "user_message",
						content,
					})
				);
			} else {
				console.error("WebSocket is not connected");
			}
		},
		[dispatch]
	);

	// Clear history function
	const clearHistory = useCallback(() => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(
				JSON.stringify({
					type: "clear_history",
				})
			);
		}
	}, []);

	return {
		sendMessage,
		clearHistory,
	};
};
