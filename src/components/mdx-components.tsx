"use client";

import { useMDXComponent } from "@content-collections/mdx/react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { DesignViewer } from "./design-viewer";
import { TweetCard, type TweetCardProps } from "./tweet-card";
import { Pre, CodeTab, CodeTabs, InlineCode } from "./mdx";

const components = {
	h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1
			className={cn(
				"mt-2 scroll-m-20 font-bold text-4xl tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2
			className={cn(
				"mt-10 scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0",
				className,
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3
			className={cn(
				"mt-8 scroll-m-20 font-semibold text-2xl tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h4
			className={cn(
				"mt-8 scroll-m-20 font-semibold text-xl tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h5
			className={cn(
				"mt-8 scroll-m-20 font-semibold text-lg tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h6
			className={cn(
				"mt-8 scroll-m-20 font-semibold text-base tracking-tight",
				className,
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
		<a
			className={cn("font-medium underline underline-offset-4", className)}
			{...props}
		/>
	),
	p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p
			//  [&:not(:first-child)]:mt-6
			className={cn("leading-7", className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
	),
	ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
		<ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
	),
	li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
		<li className={cn("mt-2", className)} {...props} />
	),
	blockquote: ({
		className,
		...props
	}: React.HTMLAttributes<HTMLQuoteElement>) => (
		<blockquote
			className={cn(
				"mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),
	img: ({
		className,
		alt,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement>) => (
		<img className={cn("rounded-md border", className)} alt={alt} {...props} />
	),
	hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="my-6 w-full overflow-y-auto">
			<table className={cn("w-full", className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr
			className={cn("m-0 border-t p-0 even:bg-muted", className)}
			{...props}
		/>
	),
	th: ({
		className,
		...props
	}: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
		<th
			className={cn(
				"border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	td: ({
		className,
		...props
	}: React.HTMLAttributes<HTMLTableDataCellElement>) => (
		<td
			className={cn(
				"border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className,
			)}
			{...props}
		/>
	),
	pre: Pre,
	code: ({
		className,
		children,
		...props
	}: React.HTMLAttributes<HTMLElement>) => {
		// Check if this is inline code (not inside a pre element)
		// rehype-pretty-code adds data-language to code blocks inside pre
		const isInlineCode = !("data-language" in props);

		if (isInlineCode) {
			return (
				<code
					className={cn(
						"relative rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-sm text-[#e6edf3]",
						className,
					)}
					{...props}
				>
					{children}
				</code>
			);
		}

		return (
			<code className={cn("font-mono text-sm", className)} {...props}>
				{children}
			</code>
		);
	},
	CodeTabs,
	CodeTab,
	InlineCode,
	DesignViewer,
	TweetCard: (props: TweetCardProps) => (
		<div className="not-prose relative mx-auto max-w-xl py-6">
			<TweetCard {...props} />
		</div>
	),
};

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return (
		<div className="mdx">
			<Component components={components} />
		</div>
	);
}
