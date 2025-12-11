import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useMatches,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import ErrorPage from "@/components/layouts/error-page";
import NotFound from "@/components/layouts/not-found";
import TanStackQueryDevtools from "@/components/providers/devtools";
import { siteConfig } from "@/lib/config";
import { seo } from "@/lib/seo";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => {
		return {
			meta: [
				{
					charSet: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					httpEquiv: "Content-Language",
					content: "en",
				},
				{
					name: "robots",
					content: "index, follow",
				},
				// Open Graph / Facebook - Static meta tags
				{
					property: "og:site_name",
					content: siteConfig.title,
				},
				{
					property: "og:locale",
					content: "en_AU",
				},
				{
					property: "og:type",
					content: "website",
				},
				...seo({
					title: siteConfig.title,
					url: "https://jacobsamo.com",
				}).meta,
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
				// Favicon
				{
					rel: "icon",
					href: "/profile-picture.jpg",
				},
				{
					rel: "apple-touch-icon",
					href: "/profile-picture.jpg",
				},
				{
					rel: "sitemap",
					href: "/sitemap-index.xml",
				},
				{
					rel: "manifest",
					href: "/manifest.webmanifest",
				},
			],
		};
	},
	shellComponent: RootDocument,
	notFoundComponent: (props) => <NotFound {...props} />,
	errorComponent: (props) => <ErrorPage {...props} />,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const matches = useMatches();
	const currentRoute = matches[matches.length - 1];
	// Check if the current route has showLayout metadata (default: true)
	const showLayout = currentRoute?.staticData?.meta?.showLayout ?? true;

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{showLayout && <Header />}
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
				{/*This is the div for the dot background*/}
				<div className="fixed inset-0 -z-50 min-h-screen w-full bg-[radial-gradient(#7979792e_1px,transparent_1px)] [background-size:16px_16px]" />
				{showLayout && <Footer />}
			</body>
		</html>
	);
}
