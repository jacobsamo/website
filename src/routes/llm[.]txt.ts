import { createFileRoute } from "@tanstack/react-router";
import { buildLlmText, textResponse } from "@/lib/resource-feeds";

export const Route = createFileRoute("/llm.txt")({
	server: {
		handlers: {
			GET: async () => textResponse(buildLlmText(), "text/plain"),
		},
	},
});
