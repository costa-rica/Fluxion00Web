// src/components/chat/ChatMessage.tsx
"use client";

import { Message } from "@/store/features/chat/chatSlice";

interface ChatMessageProps {
	message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.type === "user";
	const isSystem = message.type === "system";
	const isError = message.type === "error";

	if (isSystem) {
		return (
			<div className="flex justify-center my-4">
				<div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
					{message.content}
				</div>
			</div>
		);
	}

	return (
		<div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[70%] px-4 py-3 rounded-lg ${
					isUser
						? "bg-brand-500 text-white rounded-br-none"
						: isError
						? "bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300 rounded-bl-none"
						: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
				}`}
			>
				<p className="text-sm whitespace-pre-wrap break-words">
					{message.content}
				</p>
				<p
					className={`text-xs mt-1 ${
						isUser
							? "text-brand-100"
							: "text-gray-500 dark:text-gray-400"
					}`}
				>
					{new Date(message.timestamp).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
			</div>
		</div>
	);
}
