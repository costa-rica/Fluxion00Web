// src/components/chat/ModalAgentStatus.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { ProgressUpdate, ProgressStage } from "@/types/progress";

interface ModalAgentStatusProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ModalAgentStatus({
	isOpen,
	onClose,
}: ModalAgentStatusProps) {
	const progressHistory = useAppSelector((state) => state.chat.progressHistory || []);
	const terminalRef = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);
	const [expandedIndices, setExpandedIndices] = useState<Set<number>>(
		new Set()
	);

	// Auto-scroll to bottom when new progress arrives (unless user scrolled up)
	useEffect(() => {
		if (!isPaused && terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [progressHistory, isPaused]);

	// Scroll to bottom when modal first opens
	useEffect(() => {
		if (isOpen && terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
			setIsPaused(false);
		}
	}, [isOpen]);

	// Detect user scroll
	const handleScroll = () => {
		if (!terminalRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
		const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

		setIsPaused(!isAtBottom);
	};

	const toggleDetails = (index: number) => {
		setExpandedIndices((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100001] p-4"
			onClick={onClose}
		>
			<div
				className="bg-black border-2 border-green-500 rounded-lg w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl shadow-green-500/20"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Terminal Header */}
				<div className="bg-gray-900 border-b-2 border-green-500 px-4 py-3 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 rounded-full bg-red-500"></div>
						<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div className="w-3 h-3 rounded-full bg-green-500"></div>
						<span className="ml-4 text-green-400 font-mono text-sm">
							$ agent-status --live
						</span>
					</div>
					<button
						onClick={onClose}
						className="text-green-400 hover:text-green-300 font-mono text-sm transition-colors"
					>
						[ESC]
					</button>
				</div>

				{/* Terminal Body */}
				<div
					ref={terminalRef}
					onScroll={handleScroll}
					className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 bg-black"
					style={{ fontFamily: "Monaco, Courier New, monospace" }}
				>
					{progressHistory.length === 0 ? (
						<div className="text-gray-500">
							<span className="text-green-400">$</span> Waiting for agent
							activity...
						</div>
					) : (
						progressHistory.map((update, index) => (
							<ProgressEntry
								key={index}
								update={update}
								isExpanded={expandedIndices.has(index)}
								onToggle={() => toggleDetails(index)}
							/>
						))
					)}
				</div>

				{/* Scroll indicator */}
				{isPaused && (
					<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded text-xs font-mono">
						AUTO-SCROLL PAUSED
					</div>
				)}

				{/* Terminal Footer */}
				<div className="bg-gray-900 border-t-2 border-green-500 px-4 py-2 flex items-center justify-between text-xs font-mono">
					<span className="text-gray-400">
						{progressHistory.length} log entries
					</span>
					<span className="text-gray-400">
						Press ESC or click outside to close
					</span>
				</div>
			</div>
		</div>
	);
}

interface ProgressEntryProps {
	update: ProgressUpdate;
	isExpanded: boolean;
	onToggle: () => void;
}

function ProgressEntry({
	update,
	isExpanded,
	onToggle,
}: ProgressEntryProps) {
	const stageColor = getStageColor(update.stage);
	const timestamp = new Date(update.timestamp * 1000).toLocaleTimeString();
	const hasDetails = update.details && Object.keys(update.details).length > 0;

	return (
		<div className="border-l-2 border-gray-700 pl-3 py-1">
			{/* Main log line */}
			<div className="flex items-start space-x-2">
				<span className="text-gray-500 text-xs">[{timestamp}]</span>
				<span className={`${stageColor} font-semibold`}>
					{getStageIcon(update.stage)} {update.stage.toUpperCase()}
				</span>
				<span className="text-gray-300 flex-1">{update.message}</span>
			</div>

			{/* Details toggle */}
			{hasDetails && (
				<div className="mt-1 ml-2">
					<button
						onClick={onToggle}
						className="text-cyan-400 hover:text-cyan-300 text-xs underline transition-colors"
					>
						{isExpanded ? "▼ hide details" : "▶ show details"}
					</button>

					{isExpanded && (
						<div className="mt-2 bg-gray-900 border border-gray-700 rounded p-2 text-xs">
							{update.details?.tool && (
								<div>
									<span className="text-purple-400">tool:</span>{" "}
									<span className="text-green-300">{update.details.tool}</span>
								</div>
							)}
							{update.details?.sql && (
								<div className="mt-1">
									<span className="text-purple-400">sql:</span>{" "}
									<pre className="text-amber-300 mt-1 overflow-x-auto">
										{update.details.sql}
									</pre>
								</div>
							)}
							{update.details?.row_count !== undefined && (
								<div>
									<span className="text-purple-400">rows:</span>{" "}
									<span className="text-cyan-300">
										{update.details.row_count}
									</span>
								</div>
							)}
							{update.details?.error && (
								<div>
									<span className="text-purple-400">error:</span>{" "}
									<span className="text-red-400">{update.details.error}</span>
								</div>
							)}
							{update.details?.arguments && (
								<div className="mt-1">
									<span className="text-purple-400">args:</span>
									<pre className="text-gray-400 mt-1 overflow-x-auto">
										{JSON.stringify(update.details.arguments, null, 2)}
									</pre>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function getStageColor(stage: ProgressStage): string {
	switch (stage) {
		case "completed":
		case "tool_success":
		case "sql_executed":
			return "text-green-400";
		case "tool_error":
		case "sql_error":
			return "text-red-400";
		case "processing":
		case "analyzing":
		case "llm_summarizing":
		case "generating_response":
			return "text-cyan-400";
		case "tool_execution":
		case "sql_generation":
			return "text-amber-400";
		default:
			return "text-gray-400";
	}
}

function getStageIcon(stage: ProgressStage): string {
	switch (stage) {
		case "completed":
		case "tool_success":
		case "sql_executed":
			return "✓";
		case "tool_error":
		case "sql_error":
			return "✗";
		case "processing":
		case "analyzing":
			return "⟳";
		case "tool_execution":
		case "sql_generation":
			return "⚡";
		case "llm_summarizing":
		case "generating_response":
			return "✎";
		default:
			return "•";
	}
}
