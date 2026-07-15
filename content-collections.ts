import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import {
	transformerNotationDiff,
	transformerNotationFocus,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { remarkHeading } from "fumadocs-core/mdx-plugins";
import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
	type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

const prettyCodeOptions: RehypePrettyCodeOptions = {
	theme: "github-dark-dimmed",
	defaultLang: "typescript",
	keepBackground: true,
	transformers: [
		transformerNotationDiff({
			matchAlgorithm: "v3",
		}),
		transformerNotationHighlight(),
		transformerNotationWordHighlight(),
		transformerNotationFocus(),
		// transformerCopyButton({
		//   visibility: 'hover',
		//   feedbackDuration: 3_000,
		// })
	],
	onVisitLine(node: any) {
		// Prevent lines from collapsing in `display: grid` mode, and allow empty
		// lines to be copy/pasted
		if (node.children.length === 0) {
			node.children = [{ type: "text", value: " " }];
		}
	},
	onVisitHighlightedLine(node: any) {
		if (!node.properties.className) {
			node.properties.className = [];
		}
		node.properties.className.push("line--highlighted");
	},
	onVisitHighlightedChars(node: any) {
		node.properties.className = ["word--highlighted"];
	},
};

export interface TableOfContentsItem {
	id: string;
	title: string;
	depth: 2 | 3;
}

function getTableOfContents(content: string): TableOfContentsItem[] {
	const slugger = new GithubSlugger();
	const items: TableOfContentsItem[] = [];
	let isInCodeBlock = false;

	for (const line of content.split(/\r?\n/)) {
		const trimmedLine = line.trim();

		if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
			isInCodeBlock = !isInCodeBlock;
			continue;
		}

		if (isInCodeBlock) continue;

		const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(trimmedLine);
		if (!match) continue;

		const depth = match[1].length;
		if (depth !== 2 && depth !== 3) continue;

		const headingText = cleanHeadingText(match[2]);
		const title = headingText.replace(/\s+/g, " ").trim();
		if (!title) continue;

		items.push({
			id: slugger.slug(headingText),
			title,
			depth,
		});
	}

	return items;
}

function cleanHeadingText(value: string) {
	return value
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/<[^>]+>/g, "")
		.replace(/[*_~]/g, "")
		.trim();
}

const posts = defineCollection({
	name: "posts",
	directory: "src/content/posts",
	include: ["**/*.md", "**/*.mdx"],
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.string().array().min(1),
		/**
		 * A url to either a image or gif, used for the og image
		 */
		image: z.string(),
		/**
		 * Optional video URL for design showcase
		 */
		videoUrl: z.string().optional(),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document, {
			cwd: process.cwd(),
			remarkPlugins: [remarkGfm, remarkHeading],
			rehypePlugins: [
				rehypeSlug,
				[rehypePrettyCode, prettyCodeOptions],
				[
					rehypeAutolinkHeadings,
					{
						properties: {
							className: ["subheading-anchor"],
							ariaLabel: "Link to section",
						},
					},
				],
			],
		});
		return {
			...document,
			mdx,
			toc: getTableOfContents(document.content),
			slug: document.title.toLowerCase().replace(/ /g, "-"),
		};
	},
});

const designs = defineCollection({
	name: "designs",
	directory: "src/content/designs",
	include: ["**/*.md", "**/*.mdx"],
	schema: z.object({
		title: z.string(),
		shortDescription: z.string(),
		tags: z.string().array().min(1),
		/**
		 * A url to either a image or gif, used for the og image
		 */
		image: z.string(),
		/**
		 * Optional video URL for design showcase
		 */
		videoUrl: z.string().optional(),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document, {
			cwd: process.cwd(),
			remarkPlugins: [remarkGfm, remarkHeading],
			rehypePlugins: [
				rehypeSlug,
				[rehypePrettyCode, prettyCodeOptions],
				[
					rehypeAutolinkHeadings,
					{
						properties: {
							className: ["subheading-anchor"],
							ariaLabel: "Link to section",
						},
					},
				],
			],
		});
		return {
			...document,
			mdx,
			toc: getTableOfContents(document.content),
			slug: document.title.toLowerCase().replace(/ /g, "-"),
		};
	},
});

export default defineConfig({
	collections: [posts, designs],
});
