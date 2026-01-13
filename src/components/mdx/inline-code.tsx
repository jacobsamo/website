"use client";

import { cn } from "@/lib/utils";
import { useCallback, useState, type ReactNode } from "react";

type ColorVariant =
	| "default"
	| "primary"
	| "success"
	| "warning"
	| "error"
	| "info";

interface InlineCodeProps {
	children: ReactNode;
	className?: string;
	color?: ColorVariant;
	copyable?: boolean;
}

const colorVariants: Record<ColorVariant, string> = {
	default: "bg-white/10 text-[#e6edf3]",
	primary: "bg-blue-500/20 text-blue-300",
	success: "bg-green-500/20 text-green-300",
	warning: "bg-yellow-500/20 text-yellow-300",
	error: "bg-red-500/20 text-red-300",
	info: "bg-cyan-500/20 text-cyan-300",
};

function extractText(children: ReactNode): string {
	if (typeof children === "string") return children;
	if (typeof children === "number") return String(children);
	if (!children) return "";

	if (Array.isArray(children)) {
		return children.map(extractText).join("");
	}

	return "";
}

export function InlineCode({
	children,
	className,
	color = "default",
	copyable = true,
}: InlineCodeProps) {
	const [copied, setCopied] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);

	const text = extractText(children);

	const handleCopy = useCallback(async () => {
		if (!copyable) return;

		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [copyable, text]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (copyable && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				handleCopy();
			}
		},
		[copyable, handleCopy],
	);

	return (
		<span className="relative inline-block">
			<code
				onClick={handleCopy}
				onKeyDown={handleKeyDown}
				onMouseEnter={() => copyable && setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
				role={copyable ? "button" : undefined}
				tabIndex={copyable ? 0 : undefined}
				className={cn(
					"relative rounded-md px-1.5 py-0.5 font-mono text-sm transition-all duration-200",
					colorVariants[color],
					copyable && [
						"cursor-pointer",
						"hover:ring-2 hover:ring-white/20",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						"active:scale-95",
					],
					className,
				)}
			>
				{children}
			</code>
			{/* Tooltip */}
			{copyable && (
				<span
					className={cn(
						"pointer-events-none absolute -top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md transition-all duration-200",
						showTooltip || copied
							? "translate-y-0 opacity-100"
							: "translate-y-1 opacity-0",
					)}
				>
					{copied ? "Copied!" : "Click to copy"}
				</span>
			)}
		</span>
	);
}
