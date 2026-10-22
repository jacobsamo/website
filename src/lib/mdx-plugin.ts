import { compile } from "@mdx-js/mdx";
import { remarkHeading } from "fumadocs-core/mdx-plugins";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Plugin } from "vite";

const frontmatter = /^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/;

export function contentMdxModules(): Plugin {
	return {
		name: "website:content-mdx-modules",
		enforce: "pre",
		async transform(source, id) {
			if (!/\.mdx?\?mdx$/.test(id)) return;
			const path = id.slice(0, -"?mdx".length);
			const body = source.replace(frontmatter, "");
			const compiled = await compile(
				{ path, value: body },
				{
					format: "mdx",
					remarkPlugins: [remarkGfm, remarkHeading],
					rehypePlugins: [
						rehypeSlug,
						[
							rehypePrettyCode,
							{ theme: "github-dark-dimmed", defaultLang: "typescript" },
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
				},
			);
			return { code: String(compiled), map: null, moduleType: "js" };
		},
	};
}
