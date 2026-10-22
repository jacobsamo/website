import { buildLlmFullText, buildLlmText } from "./agents";
import { renderDiscoveryMarkdown } from "./markdown";
import { canonicalUrl, findPageByMarkdownPath } from "./registry";
import { buildHtmlSitemapXml, buildMarkdownSitemapXml } from "./sitemaps";

const legacyPaths: Record<string, string> = {
	"/llm.txt": "/llms.txt",
	"/llm-full.txt": "/llms-full.txt",
};

const documents: Record<string, { body: () => string; type: string }> = {
	"/sitemap.xml": { body: buildHtmlSitemapXml, type: "application/xml" },
	"/sitemap-markdown.xml": {
		body: buildMarkdownSitemapXml,
		type: "application/xml",
	},
	"/llms.txt": { body: buildLlmText, type: "text/plain" },
	"/llms-full.txt": { body: buildLlmFullText, type: "text/plain" },
};

function plainResponse(request: Request, body: string, contentType: string) {
	return new Response(request.method === "HEAD" ? null : body, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": `${contentType}; charset=utf-8`,
		},
	});
}

export function getDiscoveryResponse(request: Request): Response | null {
	if (request.method !== "GET" && request.method !== "HEAD") return null;

	const url = new URL(request.url);
	const redirectPath = legacyPaths[url.pathname];
	if (redirectPath) {
		return new Response(null, {
			status: 308,
			headers: { Location: new URL(redirectPath, url).toString() },
		});
	}

	const document = documents[url.pathname];
	if (document) return plainResponse(request, document.body(), document.type);

	const page = findPageByMarkdownPath(url.pathname);
	if (page) {
		return new Response(
			request.method === "HEAD" ? null : renderDiscoveryMarkdown(page),
			{
				headers: {
					"Cache-Control": "public, max-age=0, s-maxage=86400",
					"Content-Disposition": "inline",
					"Content-Type": "text/markdown; charset=utf-8",
					Link: `<${canonicalUrl(page)}>; rel="canonical"`,
					"X-Content-Type-Options": "nosniff",
				},
			},
		);
	}

	if (url.pathname.endsWith(".md")) {
		return new Response(
			request.method === "HEAD"
				? null
				: "# Page not found\n\nNo published page has this Markdown representation.\n",
			{
				status: 404,
				headers: {
					"Cache-Control": "no-store",
					"Content-Type": "text/markdown; charset=utf-8",
					"X-Content-Type-Options": "nosniff",
					"X-Robots-Tag": "noindex",
				},
			},
		);
	}

	return null;
}

export function withMissingPageRobots(response: Response) {
	if (response.status !== 404) return response;
	const headers = new Headers(response.headers);
	headers.set("X-Robots-Tag", "noindex, nofollow");
	headers.set("Cache-Control", "no-store");
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}
