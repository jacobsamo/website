import { allDesigns, allPosts } from "content-collections";
import images from "./data";
import { BASE_URL, siteConfig, skills, socials } from "./config";
import {
	canonicalUrl,
	type DiscoveryPage,
	discoveryPages,
	markdownUrl,
} from "./discovery";
import { stripMdxImports } from "./resource-feeds";

const link = (title: string, url: string, description?: string) =>
	`- [${title}](${url})${description ? `: ${description}` : ""}`;

function renderBody(page: DiscoveryPage) {
	if (page.path === "/") {
		return `Jacob Samorowski is a self-taught software developer and photographer based in Queensland, Australia. He builds web apps, creative tools, and digital experiences.\n\n## Projects\n\n${siteConfig.projects.map((project) => link(project.title, project.url, project.description)).join("\n")}\n\n## Skills\n\n${skills.map((skill) => `- ${skill}`).join("\n")}\n\n## Explore\n\n${discoveryPages
			.filter(
				(item) =>
					item.path !== "/" &&
					!item.path.startsWith("/blog/") &&
					!item.path.startsWith("/design/"),
			)
			.map((item) => link(item.title, markdownUrl(item), item.description))
			.join("\n")}`;
	}
	if (page.path === "/blog") {
		return `Published writing by Jacob Samorowski.\n\n## Articles\n\n${[
			...allPosts,
		]
			.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
			.map((post) =>
				link(
					post.title,
					`${BASE_URL}/blog/${post._meta.path}.md`,
					post.description,
				),
			)
			.join("\n")}`;
	}
	if (page.path.startsWith("/blog/")) {
		const post = allPosts.find(
			(item) => `/blog/${item._meta.path}` === page.path,
		);
		if (!post) throw new Error(`Missing published post: ${page.path}`);
		return `- Author: Jacob Samorowski\n- Published: ${post.pubDate.toISOString().slice(0, 10)}\n- Updated: ${(post.updatedDate ?? post.pubDate).toISOString().slice(0, 10)}\n- Tags: ${post.tags.join(", ")}\n\n${stripMdxImports(post.content)}`;
	}
	if (page.path === "/design") {
		return `Interactive UI designs by Jacob Samorowski. Open the canonical HTML page to use each live demo.\n\n## Designs\n\n${allDesigns.map((design) => link(design.title, `${BASE_URL}/design/${design._meta.path}.md`, design.shortDescription)).join("\n")}`;
	}
	if (page.path.startsWith("/design/")) {
		const design = allDesigns.find(
			(item) => `/design/${item._meta.path}` === page.path,
		);
		if (!design) throw new Error(`Missing published design: ${page.path}`);
		return `This page includes an interactive design preview on its canonical HTML page.\n\n${stripMdxImports(design.content)}`;
	}
	if (page.path === "/photography") {
		return `A selection of Jacob Samorowski's photographs.\n\n## Photographs\n\n${images.map((image) => link(image.title, image.url, image.alt)).join("\n")}`;
	}
	if (page.path === "/links") {
		return `Connect with Jacob Samorowski.\n\n${socials.map((social) => link(social.platform, social.url, social.handle)).join("\n")}`;
	}
	throw new Error(`No Markdown renderer for ${page.path}`);
}

export function renderDiscoveryMarkdown(page: DiscoveryPage) {
	return `# ${page.title}\n\n> ${page.description}\n\nCanonical HTML: ${canonicalUrl(page)}\n\n${renderBody(page).trim()}\n`;
}
