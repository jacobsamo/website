import { allDesigns, allPosts } from "content-collections";
import { BASE_URL, siteConfig } from "./config";

export interface DiscoveryPage {
	path: string;
	title: string;
	description: string;
	lastModified?: Date;
}

const staticPages: DiscoveryPage[] = [
	{ path: "/", title: siteConfig.title, description: siteConfig.description },
	{
		path: "/blog",
		title: "Blog",
		description:
			"Writing about software, design, and what I learn along the way.",
	},
	{
		path: "/design",
		title: "Designs",
		description: "Interactive UI designs and component showcases.",
	},
	{
		path: "/photography",
		title: "Photography",
		description: "Photography by Jacob Samorowski.",
	},
	{
		path: "/links",
		title: "Links",
		description: "Social links and ways to connect with Jacob Samorowski.",
	},
];

export const discoveryPages: DiscoveryPage[] = [
	...staticPages,
	...allPosts.map((post) => ({
		path: `/blog/${post._meta.path}`,
		title: post.title,
		description: post.description,
		lastModified: post.updatedDate ?? post.pubDate,
	})),
	...allDesigns.map((design) => ({
		path: `/design/${design._meta.path}`,
		title: design.title,
		description: design.shortDescription,
	})),
];

export function buildSitemapXml() {
	const urls = discoveryPages
		.map((page) => {
			const url = new URL(page.path, BASE_URL).toString();
			const lastmod = page.lastModified
				? `<lastmod>${page.lastModified.toISOString().slice(0, 10)}</lastmod>`
				: "";
			return `  <url><loc>${url}</loc>${lastmod}</url>`;
		})
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
