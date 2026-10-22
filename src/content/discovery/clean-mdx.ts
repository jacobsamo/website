/** Remove client-only MDX imports and components from text representations. */
export const cleanMdxForMarkdown = (content: string) =>
	content
		.replace(/^import\s+.*?;?\s*$/gm, "")
		.replace(/<([A-Z][\w.]*)\b[^>]*\/>/g, "")
		.replace(/<([A-Z][\w.]*)\b[^>]*>[\s\S]*?<\/\1>/g, "")
		.trim();
