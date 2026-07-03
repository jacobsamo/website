import { createFileRoute } from "@tanstack/react-router";
import { buildLlmFullText, textResponse } from "@/lib/resource-feeds";

export const Route = createFileRoute("/llm-full.txt")({
	server: {
		handlers: {
			GET: async () => textResponse(buildLlmFullText(), "text/plain"),
		},
	},
});
