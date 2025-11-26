// src/components/chat/ChatInterface.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { clearMessages } from "@/store/features/chat/chatSlice";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";

export default function ChatInterface() {
	const [inputValue, setInputValue] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	const { sendMessage, clearHistory } = useWebSocket();
	const messages = useAppSelector((state) => state.chat.messages);
	const isConnected = useAppSelector((state) => state.chat.isConnected);
	const isTyping = useAppSelector((state) => state.chat.isTyping);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	const handleSend = () => {
		if (inputValue.trim() && isConnected) {
			sendMessage(inputValue.trim());
			setInputValue("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleClearHistory = () => {
		if (window.confirm("Are you sure you want to clear the conversation history?")) {
			dispatch(clearMessages());
			clearHistory();
		}
	};

	return (
		<div className="flex flex-col h-full bg-white dark:bg-gray-900">
			{/* Header with connection status and clear button */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-3">
					<div
						className={`w-3 h-3 rounded-full ${
							isConnected ? "bg-success-500" : "bg-error-500"
						}`}
						title={isConnected ? "Connected" : "Disconnected"}
					></div>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
						{process.env.NEXT_PUBLIC_APP_NAME || "Fluxion"} AI Chat
					</h2>
				</div>
				<Button
					onClick={handleClearHistory}
					variant="outline"
					size="sm"
					disabled={!isConnected || messages.length === 0}
				>
					Clear History
				</Button>
			</div>

			{/* Messages area */}
			<div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
				{messages.length === 0 && (
					<div className="flex items-center justify-center h-full">
						<p className="text-gray-500 dark:text-gray-400 text-center">
							{isConnected
								? "Start a conversation with the AI agent..."
								: "Connecting to the AI agent..."}
						</p>
					</div>
				)}

				{messages.map((message) => (
					<ChatMessage key={message.id} message={message} />
				))}

				{isTyping && <TypingIndicator />}

				<div ref={messagesEndRef} />
			</div>

			{/* Input area */}
			<div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-end space-x-3">
					<div className="flex-1">
						<TextArea
							value={inputValue}
							onChange={(value) => setInputValue(value)}
							onKeyDown={handleKeyPress}
							placeholder="Type your message..."
							rows={2}
							disabled={!isConnected}
							className="resize-none"
						/>
					</div>
					<Button
						onClick={handleSend}
						disabled={!isConnected || !inputValue.trim()}
						size="sm"
						className="mb-1"
					>
						Send
					</Button>
				</div>
				<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
					Press Enter to send, Shift+Enter for new line
				</p>
			</div>
		</div>
	);
}
