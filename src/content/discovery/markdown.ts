import { allDesigns, allPosts } from "content-collections";
import images from "@/lib/data";
import { siteConfig, skills, socials } from "@/lib/config";
import { pageCopy } from "../site";
import {
	canonicalUrl,
	type DiscoveryPage,
	discoveryPages,
	findPageByCanonicalPath,
	markdownUrl,
} from "./registry";
import { cleanMdxForMarkdown } from "./clean-mdx";

const link = (title: string, url: string, description?: string) =>
	`- [${title}](${url})${description ? `: ${description}` : ""}`;

function renderBody(page: DiscoveryPage) {
	if (page.path === "/") {
		return `${pageCopy.home.about}\n\n## Projects\n\n${siteConfig.projects.map((project) => link(project.title, project.url, project.description)).join("\n")}\n\n## Skills\n\n${skills.map((skill) => `- ${skill}`).join("\n")}\n\n## Explore\n\n${discoveryPages
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
			.map((post) => {
				const article = findPageByCanonicalPath(`/blog/${post._meta.path}`);
				if (!article)
					throw new Error(`Missing published post: ${post._meta.path}`);
				return link(article.title, markdownUrl(article), article.description);
			})
			.join("\n")}`;
	}
	if (page.path.startsWith("/blog/")) {
		const post = allPosts.find(
			(item) => `/blog/${item._meta.path}` === page.path,
		);
		if (!post) throw new Error(`Missing published post: ${page.path}`);
		return `- Author: Jacob Samorowski\n- Published: ${post.pubDate.toISOString().slice(0, 10)}\n- Updated: ${(post.updatedDate ?? post.pubDate).toISOString().slice(0, 10)}\n- Tags: ${post.tags.join(", ")}\n- Image: ${post.image}\n\n${cleanMdxForMarkdown(post.content)}`;
	}
	if (page.path === "/design") {
		return `Interactive UI designs by Jacob Samorowski. Open the canonical HTML page to use each live demo.\n\n## Designs\n\n${allDesigns
			.map((design) => {
				const designPage = findPageByCanonicalPath(
					`/design/${design._meta.path}`,
				);
				if (!designPage)
					throw new Error(`Missing published design: ${design._meta.path}`);
				return link(
					designPage.title,
					markdownUrl(designPage),
					designPage.description,
				);
			})
			.join("\n")}`;
	}
	if (page.path.startsWith("/design/")) {
		const design = allDesigns.find(
			(item) => `/design/${item._meta.path}` === page.path,
		);
		if (!design) throw new Error(`Missing published design: ${page.path}`);
		return `This page includes an interactive design preview on its canonical HTML page.\n\n- Preview image: ${design.image}${design.videoUrl ? `\n- Preview video: ${design.videoUrl}` : ""}\n\n${cleanMdxForMarkdown(design.content)}`;
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
