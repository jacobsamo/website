import { allPosts } from "content-collections";
import { cleanMdxForMarkdown } from "@/content/discovery/clean-mdx";
import { BASE_URL, siteConfig } from "@/lib/config";

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
				<content:encoded><![CDATA[${cdata(cleanMdxForMarkdown(post.content))}]]></content:encoded>
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
