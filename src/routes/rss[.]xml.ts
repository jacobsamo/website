import { createFileRoute } from "@tanstack/react-router";
import { buildRssXml, textResponse } from "@/lib/resource-feeds";

export const Route = createFileRoute("/rss.xml")({
	server: {
		handlers: {
			GET: async () => textResponse(buildRssXml(), "application/rss+xml"),
		},
	},
});
