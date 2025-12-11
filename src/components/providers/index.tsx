import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PosthogProvider from "./posthog";

export function getContext() {
	const queryClient = new QueryClient();
	return {
		queryClient,
	};
}

export function Providers({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<PosthogProvider>{children}</PosthogProvider>
		</QueryClientProvider>
	);
}
