"use client";

import { cn } from "@/lib/utils";
import {
	Children,
	isValidElement,
	useState,
	type ReactElement,
	type ReactNode,
} from "react";

interface CodeTabProps {
	label: string;
	children: ReactNode;
}

export function CodeTab({ children }: CodeTabProps) {
	return <>{children}</>;
}

interface CodeTabsProps {
	children: ReactNode;
	defaultTab?: number;
	className?: string;
}

function extractTextFromChildren(children: ReactNode): string {
	if (typeof children === "string") return children;
	if (typeof children === "number") return String(children);
	if (!children) return "";

	if (Array.isArray(children)) {
		return children.map(extractTextFromChildren).join("");
	}

	if (isValidElement(children)) {
		const element = children as ReactElement<{ children?: ReactNode }>;
		return extractTextFromChildren(element.props.children);
	}

	return "";
}

function CopyButton({
	text,
	className,
}: { text: string; className?: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={cn(
				"group/copy relative flex size-8 items-center justify-center rounded-md transition-all duration-200",
				"text-muted-foreground hover:text-foreground hover:bg-white/10",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				className,
			)}
			aria-label={copied ? "Copied!" : "Copy code"}
		>
			<span className="sr-only">{copied ? "Copied!" : "Copy code"}</span>
			{/* Copy icon */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={cn(
					"absolute size-4 transition-all duration-200",
					copied
						? "scale-0 opacity-0"
						: "scale-100 opacity-100 group-hover/copy:scale-110",
				)}
			>
				<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
				<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
			</svg>
			{/* Check icon */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={cn(
					"absolute size-4 text-green-400 transition-all duration-200",
					copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
				)}
			>
				<polyline points="20 6 9 17 4 12" />
			</svg>
		</button>
	);
}

export function CodeTabs({
	children,
	defaultTab = 0,
	className,
}: CodeTabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab);

	const tabs = Children.toArray(children).filter(
		(child): child is ReactElement<CodeTabProps> =>
			isValidElement(child) && child.type === CodeTab,
	);

	if (tabs.length === 0) {
		return null;
	}

	const activeContent = tabs[activeTab]?.props.children;
	const activeCode = extractTextFromChildren(activeContent).trim();

	return (
		<figure className="group/codeblock my-6">
			<div
				className={cn(
					"overflow-hidden rounded-xl border border-white/10 bg-[#22272e]",
					className,
				)}
			>
				{/* Tab header */}
				<div className="flex items-center justify-between border-b border-white/10 bg-white/5">
					<div className="flex">
						{tabs.map((tab, index) => (
							<button
								key={tab.props.label}
								type="button"
								onClick={() => setActiveTab(index)}
								className={cn(
									"relative px-4 py-2 font-mono text-xs transition-colors",
									activeTab === index
										? "text-foreground"
										: "text-muted-foreground hover:text-foreground/80",
								)}
							>
								{tab.props.label}
								{activeTab === index && (
									<span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
								)}
							</button>
						))}
					</div>
					<CopyButton text={activeCode} className="mr-2" />
				</div>

				{/* Tab content */}
				<div className="relative">
					{tabs.map((tab, index) => (
						<div
							key={tab.props.label}
							className={cn(
								"transition-opacity duration-200",
								activeTab === index
									? "opacity-100"
									: "hidden opacity-0",
							)}
						>
							{tab.props.children}
						</div>
					))}
				</div>
			</div>
		</figure>
	);
}
