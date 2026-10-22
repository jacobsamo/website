import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import {
	buildMarkdownSitemapXml,
	buildSitemapXml,
	canonicalUrl,
	findPageByMarkdownPath,
} from "./lib/discovery";
import { renderDiscoveryMarkdown } from "./lib/discovery-markdown";
import {
	buildLlmFullText,
	buildLlmText,
	textResponse,
} from "./lib/resource-feeds";

const legacyPaths: Record<string, string> = {
	"/llm.txt": "/llms.txt",
	"/llm-full.txt": "/llms-full.txt",
};

export default createServerEntry({
	fetch(request, options) {
		if (request.method === "GET" || request.method === "HEAD") {
			const url = new URL(request.url);
			const redirectPath = legacyPaths[url.pathname];
			if (redirectPath) {
				return new Response(null, {
					status: 308,
					headers: { Location: new URL(redirectPath, url).toString() },
				});
			}
			const body =
				url.pathname === "/sitemap.xml"
					? buildSitemapXml()
					: url.pathname === "/sitemap-markdown.xml"
						? buildMarkdownSitemapXml()
						: url.pathname === "/llms.txt"
							? buildLlmText()
							: url.pathname === "/llms-full.txt"
								? buildLlmFullText()
								: null;
			if (body !== null) {
				return textResponse(
					request.method === "HEAD" ? "" : body,
					url.pathname.endsWith(".xml") ? "application/xml" : "text/plain",
				);
			}
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
		}
		return Promise.resolve(handler.fetch(request, options)).then((response) => {
			if (response.status !== 404) return response;
			const headers = new Headers(response.headers);
			headers.set("X-Robots-Tag", "noindex, nofollow");
			headers.set("Cache-Control", "no-store");
			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers,
			});
		});
	},
});
