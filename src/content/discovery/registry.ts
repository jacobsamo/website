import { allDesigns, allPosts } from "content-collections";
import { BASE_URL, siteConfig } from "@/lib/config";
import { pageCopy } from "../site";

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
		description: pageCopy.home.description,
	},
	{
		path: "/blog",
		markdownPath: "/blog.md",
		title: "Blog",
		description: pageCopy.blog.description,
	},
	{
		path: "/design",
		markdownPath: "/design.md",
		title: "Designs",
		description: pageCopy.design.description,
	},
	{
		path: "/photography",
		markdownPath: "/photography.md",
		title: "Photography",
		description: pageCopy.photography.description,
	},
	{
		path: "/links",
		markdownPath: "/links.md",
		title: "Links",
		description: pageCopy.links.description,
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
