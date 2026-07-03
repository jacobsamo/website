"use client";
import {
	PostHogErrorBoundary,
	PostHogProvider as PostHog,
} from "@posthog/react";
import { env } from "env";
import posthog from "posthog-js";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function PostHogErrorFallback({ error }: { error: unknown }) {
	const message =
		error instanceof Error ? error.message : "Something went wrong";

	return (
		<main className="min-h-screen text-center flex items-center justify-center flex-col gap-2">
			<h1 className="text-2xl font-bold">Error</h1>
			<p>An error occurred: {message}</p>
			<Button onClick={() => window.location.reload()}>Reload</Button>
		</main>
	);
}

export default function PostHogProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		if (env.VITE_POSTHOG_KEY && env.VITE_POSTHOG_HOST) {
			posthog.init(env.VITE_POSTHOG_KEY, {
				api_host: env.VITE_POSTHOG_HOST,
				ui_host: env.VITE_POSTHOG_HOST,
				defaults: "2026-05-30",
				person_profiles: "identified_only",
				enable_heatmaps: true,
				session_recording: {
					maskAllInputs: false,
					maskInputOptions: {
						password: true,
						email: true,
					},
				},
				loaded: (ph) => {
					if (
						location.hostname === "localhost" ||
						location.hostname === "127.0.0.1"
					) {
						ph.opt_out_capturing();
						ph.set_config({ disable_session_recording: true });
					}
				},
			});
		} else {
			console.log("Posthog not initialized");
		}
	}, []);

	return (
		<PostHog client={posthog}>
			<PostHogErrorBoundary
				additionalProperties={{ source: "react-error-boundary" }}
				fallback={PostHogErrorFallback}
			>
				{children}
			</PostHogErrorBoundary>
		</PostHog>
	);
}
