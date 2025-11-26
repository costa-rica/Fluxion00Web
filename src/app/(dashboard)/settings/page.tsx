"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProvider, setModel } from "@/store/features/llm/llmSlice";
import {
	setConnected,
	setTyping,
} from "@/store/features/chat/chatSlice";
import {
	LLMProvider,
	PROVIDER_MODELS,
	PROVIDER_LABELS,
} from "@/types/llm";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import { ModalInformationOk } from "@/components/ui/modal/ModalInformationOk";

export default function Settings() {
	const dispatch = useAppDispatch();
	const llmConfig = useAppSelector((state) => state.llm.config);
	const isConnected = useAppSelector((state) => state.chat.isConnected);

	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const handleProviderChange = (provider: LLMProvider) => {
		const oldProvider = llmConfig.provider;
		const oldModel = llmConfig.model;

		// Update provider (this will auto-select default model for the new provider)
		dispatch(setProvider(provider));

		// Get the new default model
		const newModel = PROVIDER_MODELS[provider][0];

		// If connected, trigger reconnection
		if (isConnected) {
			// Clear typing indicator and temporarily disconnect
			dispatch(setTyping(false));
			dispatch(setConnected(false));

			// Show success message
			setSuccessMessage(
				`Successfully switched from ${PROVIDER_LABELS[oldProvider]} (${oldModel}) to ${PROVIDER_LABELS[provider]} (${newModel}).\n\nReconnecting...`
			);
			setShowSuccessModal(true);
		}
	};

	const handleModelChange = (model: string) => {
		const oldModel = llmConfig.model;

		// Update model
		dispatch(setModel(model));

		// If connected, trigger reconnection
		if (isConnected) {
			// Clear typing indicator and temporarily disconnect
			dispatch(setTyping(false));
			dispatch(setConnected(false));

			// Show success message
			setSuccessMessage(
				`Successfully switched from ${oldModel} to ${model}.\n\nReconnecting...`
			);
			setShowSuccessModal(true);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
					Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Configure your AI agent preferences
				</p>
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
					LLM Configuration
				</h2>

				{/* Provider Selection */}
				<div className="mb-6">
					<Label>Select Provider</Label>
					<div className="mt-3 space-y-3">
						<Radio
							id="provider-ollama"
							label={PROVIDER_LABELS.ollama}
							name="provider"
							value="ollama"
							checked={llmConfig.provider === "ollama"}
							onChange={(value) => handleProviderChange(value as LLMProvider)}
						/>
						<Radio
							id="provider-chatgpt"
							label={PROVIDER_LABELS.chatgpt}
							name="provider"
							value="chatgpt"
							checked={llmConfig.provider === "chatgpt"}
							onChange={(value) => handleProviderChange(value as LLMProvider)}
						/>
					</div>
				</div>

				{/* Model Selection */}
				<div className="mb-6">
					<Label>Select Model</Label>
					<Select
						options={PROVIDER_MODELS[llmConfig.provider].map((model) => ({
							value: model,
							label: model,
						}))}
						defaultValue={llmConfig.model}
						onChange={handleModelChange}
						className="mt-2"
					/>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Available models for {PROVIDER_LABELS[llmConfig.provider]}
					</p>
				</div>

				{/* Current Configuration Display */}
				<div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
					<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
						Current Configuration
					</h3>
					<div className="space-y-1 text-sm">
						<p className="text-gray-600 dark:text-gray-400">
							<span className="font-medium">Provider:</span>{" "}
							{PROVIDER_LABELS[llmConfig.provider]}
						</p>
						<p className="text-gray-600 dark:text-gray-400">
							<span className="font-medium">Model:</span> {llmConfig.model}
						</p>
						<p className="text-gray-600 dark:text-gray-400">
							<span className="font-medium">Status:</span>{" "}
							{isConnected ? (
								<span className="text-success-600 dark:text-success-400">
									Connected
								</span>
							) : (
								<span className="text-gray-500 dark:text-gray-400">
									Disconnected
								</span>
							)}
						</p>
					</div>
				</div>

				{/* Info Note */}
				<div className="mt-6 p-4 bg-blue-light-50 dark:bg-blue-light-900/20 border border-blue-light-300 dark:border-blue-light-700 rounded-lg">
					<p className="text-sm text-blue-light-700 dark:text-blue-light-400">
						<span className="font-semibold">Note:</span> Changing the provider
						or model will automatically reconnect your chat session with the new
						settings.
					</p>
				</div>
			</div>

			{/* Success Modal */}
			{showSuccessModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100001]">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
						<ModalInformationOk
							title="Settings Updated"
							message={successMessage}
							variant="success"
							onClose={() => setShowSuccessModal(false)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
