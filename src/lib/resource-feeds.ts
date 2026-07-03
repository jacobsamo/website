import { allPosts } from "content-collections";
import { BASE_URL, siteConfig, skills, socials } from "@/lib/config";

const sortedPosts = [...allPosts].sort(
	(a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
);

const absoluteUrl = (path: string) => {
	if (path.startsWith("http")) return path;

	return new URL(path, BASE_URL).toString().replace(/\/$/, "");
};

const escapeXml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

const cdata = (value: string) => value.replace(/]]>/g, "]]]]><![CDATA[>");

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const stripMdxImports = (content: string) =>
	content
		.replace(/^import\s+.*?;?\s*$/gm, "")
		.replace(/<([A-Z][\w.]*)\b[^>]*\/>/g, "")
		.replace(/<([A-Z][\w.]*)\b[^>]*>[\s\S]*?<\/\1>/g, "")
		.trim();

const projectLines = siteConfig.projects
	.map(
		(project) => `- ${project.title}: ${project.description} (${project.url})`,
	)
	.join("\n");

const socialLines = socials
	.map((social) => `- ${social.platform}: ${social.handle} (${social.url})`)
	.join("\n");

const postLines = sortedPosts
	.map(
		(post) =>
			`- ${post.title} (${formatDate(post.pubDate)}): ${post.description} ${absoluteUrl(`/blog/${post._meta.path}`)}`,
	)
	.join("\n");

export const buildLlmText = () => `# ${siteConfig.title}

> ${siteConfig.description}

Jacob Samorowski is a software developer and photographer based in Queensland, Australia. He builds full-stack web apps, creative tools, mapping products, and digital experiences.

## Canonical URLs

- Website: ${BASE_URL}
- Blog: ${absoluteUrl("/blog")}
- Photography: ${absoluteUrl("/photography")}
- Designs: ${absoluteUrl("/design")}
- RSS: ${absoluteUrl("/rss.xml")}
- Full LLM index: ${absoluteUrl("/llm-full.txt")}

## Focus Areas

${skills.map((skill) => `- ${skill}`).join("\n")}

## Projects

${projectLines}

## Writing

${postLines || "- No public blog posts are listed yet."}

## Profiles

${socialLines}
`;

export const buildLlmFullText = () => {
	const postSections = sortedPosts
		.map(
			(post) => `## ${post.title}

URL: ${absoluteUrl(`/blog/${post._meta.path}`)}
Published: ${formatDate(post.pubDate)}
Updated: ${formatDate(post.updatedDate ?? post.pubDate)}
Tags: ${post.tags.join(", ")}
Description: ${post.description}
Image: ${absoluteUrl(post.image)}

${stripMdxImports(post.content)}
`,
		)
		.join("\n---\n\n");

	return `# ${siteConfig.title} Full LLM Index

This is a machine-readable index of Jacob Samorowski's personal website content.

## Identity

Name: Jacob Samorowski
Location: Queensland, Australia
Primary roles: Software Developer, Photographer
Website: ${BASE_URL}
Description: ${siteConfig.description}
Keywords: ${siteConfig.keywords.join(", ")}

## Profiles

${socialLines}

## Projects

${projectLines}

## Skills

${skills.join(", ")}

## Work

${siteConfig.work
	.map(
		(work) =>
			`- ${work.jobTitle}, ${work.companyName} (${formatDate(work.startDate)} - ${work.endDate ? formatDate(work.endDate) : "present"}): ${work.description}`,
	)
	.join("\n")}

## Education

${siteConfig.education
	.map(
		(education) =>
			`- ${education.degree}, ${education.schoolName} (${formatDate(education.startDate)} - ${education.endDate ? formatDate(education.endDate) : "present"})${education.description ? `: ${education.description}` : ""}`,
	)
	.join("\n")}

## Blog Posts

${postSections || "No public blog posts are listed yet."}
`;
};

export const buildRssXml = () => {
	const lastBuildDate =
		sortedPosts[0]?.updatedDate ?? sortedPosts[0]?.pubDate ?? new Date();

	const items = sortedPosts
		.map((post) => {
			const url = absoluteUrl(`/blog/${post._meta.path}`);
			const date = post.updatedDate ?? post.pubDate;

			return `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${escapeXml(url)}</link>
			<guid isPermaLink="true">${escapeXml(url)}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${post.pubDate.toUTCString()}</pubDate>
			<dc:creator>${escapeXml(siteConfig.title)}</dc:creator>
${post.tags.map((tag) => `			<category>${escapeXml(tag)}</category>`).join("\n")}
				<content:encoded><![CDATA[${cdata(stripMdxImports(post.content))}]]></content:encoded>
			<atom:updated>${date.toISOString()}</atom:updated>
		</item>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
	<channel>
		<title>${escapeXml(`${siteConfig.title} Blog`)}</title>
		<link>${escapeXml(BASE_URL)}</link>
		<atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
		<description>${escapeXml("Writing from Jacob Samorowski about software development, startups, design, and learning.")}</description>
		<language>en-AU</language>
		<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
		<ttl>60</ttl>
${items}
	</channel>
</rss>
`;
};

export const textResponse = (body: string, contentType: string) =>
	new Response(body, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": `${contentType}; charset=utf-8`,
		},
	});
