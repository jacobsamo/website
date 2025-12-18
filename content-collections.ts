import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import {
	transformerMetaHighlight,
	transformerMetaWordHighlight,
	transformerNotationDiff,
} from "@shikijs/transformers";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import type { Root } from "mdast";
import { remarkHeading } from 'fumadocs-core/mdx-plugins';


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
		heroImage: z.string().optional(),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document, {
			cwd: process.cwd(),
			remarkPlugins: [remarkGfm, remarkHeading],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: "catppuccin-frappe",
            transformers: [
              transformerMetaHighlight(),
              transformerMetaWordHighlight(),
              transformerNotationDiff({
                matchAlgorithm: "v3",
              }),
            ],
            onVisitLine(node: any) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [{ type: "text", value: " " }];
              }
            },
            onVisitHighlightedLine(node: any) {
              node.properties.className.push("line--highlighted");
            },
            onVisitHighlightedWord(node: any) {
              node.properties.className = ["word--highlighted"];
            },
          },
        ],
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
		heroImage: z.string(),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document, {
			cwd: process.cwd(),
			remarkPlugins: [remarkGfm, remarkHeading],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: "catppuccin-frappe",
            transformers: [
              transformerMetaHighlight(),
              transformerMetaWordHighlight(),
              transformerNotationDiff({
                matchAlgorithm: "v3",
              }),
            ],
            onVisitLine(node: any) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [{ type: "text", value: " " }];
              }
            },
            onVisitHighlightedLine(node: any) {
              node.properties.className.push("line--highlighted");
            },
            onVisitHighlightedWord(node: any) {
              node.properties.className = ["word--highlighted"];
            },
          },
        ],
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
			slug: document.title.toLowerCase().replace(/ /g, "-"),
		};
	},
});

export default defineConfig({
	collections: [posts, designs],
});
