import * as Sentry from "@sentry/tanstackstart-react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import posthog from "posthog-js";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset, info }: ErrorComponentProps) {
	useEffect(() => {
		Sentry.captureException(error, {
			data: {
				info,
			},
		});
		posthog.captureException(error);
	}, []);

	return (
		<main className="min-h-screen text-center flex items-center justify-center flex-col gap-2">
			<h1 className="text-2xl font-bold">Error</h1>
			<p>An error occurred: {error.message}</p>
			<Button onClick={() => reset()}>Try again</Button>
		</main>
	);
}
