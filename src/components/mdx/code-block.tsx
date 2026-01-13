"use client";

import { cn } from "@/lib/utils";
import {
	Children,
	isValidElement,
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactElement,
	type ReactNode,
} from "react";

interface CopyButtonProps {
	text: string;
	className?: string;
}

function CopyButton({ text, className }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [text]);

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
					copied
						? "scale-100 opacity-100"
						: "scale-0 opacity-0",
				)}
			>
				<polyline points="20 6 9 17 4 12" />
			</svg>
		</button>
	);
}

interface CodeBlockHeaderProps {
	language?: string;
	title?: string;
	showCopy?: boolean;
	codeText: string;
}

function CodeBlockHeader({
	language,
	title,
	showCopy = true,
	codeText,
}: CodeBlockHeaderProps) {
	const displayName = title || language;

	return (
		<div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
			<div className="flex items-center gap-2">
				{displayName && (
					<span className="font-mono text-xs text-muted-foreground">
						{displayName}
					</span>
				)}
			</div>
			{showCopy && <CopyButton text={codeText} />}
		</div>
	);
}

interface CodeBlockProps {
	children: ReactNode;
	className?: string;
	showLineNumbers?: boolean;
	caption?: string;
	"data-language"?: string;
	"data-theme"?: string;
	title?: string;
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

export function CodeBlock({
	children,
	className,
	caption,
	"data-language": language,
	"data-theme": theme,
	title,
	...props
}: CodeBlockProps) {
	const preRef = useRef<HTMLPreElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [showStickyButton, setShowStickyButton] = useState(false);
	const [isLongCode, setIsLongCode] = useState(false);

	const codeText = extractTextFromChildren(children).trim();

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Check if code block is tall enough to warrant sticky button
		const checkHeight = () => {
			const height = container.offsetHeight;
			setIsLongCode(height > 300);
		};

		checkHeight();
		window.addEventListener("resize", checkHeight);
		return () => window.removeEventListener("resize", checkHeight);
	}, []);

	useEffect(() => {
		if (!isLongCode) return;

		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const rect = container.getBoundingClientRect();
			const headerHeight = 48; // Height of header
			// Show sticky button when header is scrolled past
			setShowStickyButton(rect.top < -headerHeight && rect.bottom > 100);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLongCode]);

	return (
		<figure className="group/codeblock my-6">
			<div
				ref={containerRef}
				className={cn(
					"relative overflow-hidden rounded-xl border border-white/10 bg-[#22272e]",
					className,
				)}
			>
				<CodeBlockHeader
					language={language}
					title={title}
					codeText={codeText}
				/>
				<div className="relative">
					<pre
						ref={preRef}
						className="overflow-x-auto py-4 text-sm leading-relaxed"
						data-language={language}
						data-theme={theme}
						{...props}
					>
						{children}
					</pre>
					{/* Sticky copy button for long code blocks */}
					{isLongCode && (
						<div
							className={cn(
								"fixed right-8 top-20 z-50 transition-all duration-300",
								showStickyButton
									? "translate-y-0 opacity-100"
									: "-translate-y-4 pointer-events-none opacity-0",
							)}
						>
							<CopyButton
								text={codeText}
								className="size-10 rounded-lg border border-white/10 bg-[#22272e]/95 shadow-lg backdrop-blur-sm"
							/>
						</div>
					)}
				</div>
			</div>
			{caption && (
				<figcaption className="mt-2 text-center text-sm text-muted-foreground">
					{caption}
				</figcaption>
			)}
		</figure>
	);
}

// Pre component that wraps CodeBlock for MDX
interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
	children?: ReactNode;
	"data-language"?: string;
	"data-theme"?: string;
	title?: string;
	caption?: string;
	raw?: string;
}

export function Pre({
	children,
	className,
	"data-language": language,
	"data-theme": theme,
	title,
	caption,
	...props
}: PreProps) {
	return (
		<CodeBlock
			data-language={language}
			data-theme={theme}
			title={title}
			caption={caption}
			className={className}
		>
			{children}
		</CodeBlock>
	);
}
