import { allDesigns, allPosts } from "content-collections";
import { BASE_URL, siteConfig } from "./config";

export interface DiscoveryPage {
	path: string;
	markdownPath: string;
	title: string;
	description: string;
	lastModified?: Date;
}

const staticPages: DiscoveryPage[] = [
	{
		path: "/",
		markdownPath: "/index.md",
		title: siteConfig.title,
		description: siteConfig.description,
	},
	{
		path: "/blog",
		markdownPath: "/blog.md",
		title: "Blog",
		description:
			"Writing about software, design, and what I learn along the way.",
	},
	{
		path: "/design",
		markdownPath: "/design.md",
		title: "Designs",
		description: "Interactive UI designs and component showcases.",
	},
	{
		path: "/photography",
		markdownPath: "/photography.md",
		title: "Photography",
		description: "Photography by Jacob Samorowski.",
	},
	{
		path: "/links",
		markdownPath: "/links.md",
		title: "Links",
		description: "Social links and ways to connect with Jacob Samorowski.",
	},
];

export const discoveryPages: DiscoveryPage[] = [
	...staticPages,
	...allPosts.map((post) => ({
		path: `/blog/${post._meta.path}`,
		markdownPath: `/blog/${post._meta.path}.md`,
		title: post.title,
		description: post.description,
		lastModified: post.updatedDate ?? post.pubDate,
	})),
	...allDesigns.map((design) => ({
		path: `/design/${design._meta.path}`,
		markdownPath: `/design/${design._meta.path}.md`,
		title: design.title,
		description: design.shortDescription,
	})),
];

export const canonicalUrl = (page: DiscoveryPage) =>
	new URL(page.path, BASE_URL).toString();

export const markdownUrl = (page: DiscoveryPage) =>
	new URL(page.markdownPath, BASE_URL).toString();

const normalizePath = (path: string) =>
	path === "/" ? path : path.replace(/\/+$/, "");

export const findPageByCanonicalPath = (path: string) =>
	discoveryPages.find((page) => page.path === normalizePath(path));

export const findPageByMarkdownPath = (path: string) =>
	discoveryPages.find((page) => page.markdownPath === normalizePath(path));

export function buildSitemapXml() {
	const urls = discoveryPages
		.map((page) => {
			const url = canonicalUrl(page);
			const lastmod = page.lastModified
				? `<lastmod>${page.lastModified.toISOString().slice(0, 10)}</lastmod>`
				: "";
			return `  <url><loc>${url}</loc>${lastmod}</url>`;
		})
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildMarkdownSitemapXml() {
	const urls = discoveryPages
		.map((page) => {
			const lastmod = page.lastModified
				? `<lastmod>${page.lastModified.toISOString().slice(0, 10)}</lastmod>`
				: "";
			return `  <url><loc>${markdownUrl(page)}</loc>${lastmod}</url>`;
		})
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
