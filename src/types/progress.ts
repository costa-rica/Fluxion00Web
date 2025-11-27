// src/types/progress.ts

export type ProgressStage =
	| "processing"
	| "analyzing"
	| "tool_execution"
	| "tool_success"
	| "tool_error"
	| "sql_generation"
	| "sql_executed"
	| "sql_error"
	| "llm_summarizing"
	| "generating_response"
	| "completed";

export interface ProgressUpdate {
	stage: ProgressStage;
	message: string;
	timestamp: number; // Unix timestamp in seconds
	details?: {
		tool?: string;
		arguments?: Record<string, unknown>;
		sql?: string;
		row_count?: number;
		error?: string;
		output_length?: number;
		[key: string]: unknown;
	};
}
