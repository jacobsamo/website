import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { env } from "env";
import { getContext, Providers } from "@/components/providers";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const rqContext = getContext();

	const router = createRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: "intent",
		defaultPreloadDelay: 100,
		defaultPreloadStaleTime: 30_000,
		defaultGcTime: 1800_000,
		defaultStructuralSharing: true,
		scrollRestoration: true,
		Wrap: (props) => <Providers {...rqContext}>{props.children}</Providers>,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	if (!router.isServer && env.VITE_SENTRY_DSN) {
		Sentry.init({
			dsn: env.VITE_SENTRY_DSN,
			integrations: [
				Sentry.replayIntegration(),
				Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
			],
			tracesSampleRate: 1,
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
			sendDefaultPii: true,
			_experiments: {
				enableLogs: true,
			},
		});
	}

	return router;
};
