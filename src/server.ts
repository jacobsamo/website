import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { buildSitemapXml } from "./lib/discovery";
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
		}
		return handler.fetch(request, options);
	},
});
