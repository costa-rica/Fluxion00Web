"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "../icons/index";

interface SidebarWidgetProps {
	isExpanded: boolean;
}

export default function SidebarWidget({ isExpanded }: SidebarWidgetProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mt-auto mb-6">
			{/* Expandable Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full flex items-center justify-between px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${
					!isExpanded ? "lg:justify-center" : ""
				}`}
			>
				{isExpanded && <span>Credits</span>}
				<ChevronDownIcon
					className={`w-4 h-4 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					} ${!isExpanded ? "lg:block" : ""}`}
				/>
			</button>

			{/* Expandable Content */}
			{isExpanded && (
				<div
					className={`overflow-hidden transition-all duration-300 ${
						isOpen ? "max-h-40" : "max-h-0"
					}`}
				>
					<div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
						<p className="mb-2">
							Icons: Pixel perfect - Flaticon
						</p>
						<a
							href="https://www.flaticon.com/free-icons/new"
							target="_blank"
							rel="nofollow"
							className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
						>
							Visit Flaticon →
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
