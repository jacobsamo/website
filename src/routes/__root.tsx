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
import { siteConfig, socials, BASE_URL } from "@/lib/config";
import { head } from "@/lib/head";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

/**
 * Generate a human-readable title from a pathname
 * /photography -> "Photography"
 * /blog -> "Blog"
 * /some-page -> "Some Page"
 * / -> null (use default)
 */
function generateTitleFromPathname(pathname: string): string | null {
	if (pathname === "/") return null;

	const segments = pathname.split("/").filter(Boolean);
	const firstSegment = segments[0];

	if (!firstSegment || firstSegment.startsWith("$")) return null;

	// Capitalize and handle hyphenated words
	return firstSegment
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: ({ matches }) => {
		const twitterSocial = socials.find((s) => s.platform === "twitter");
		const twitterHandle = twitterSocial?.handle || "@jacobsamorowski";

		// Get current pathname from deepest match
		const currentMatch = matches[matches.length - 1];
		const pathname = currentMatch?.pathname ?? "/";

		// Always generate canonical URL
		const canonicalUrl = `${BASE_URL}${pathname === "/" ? "" : pathname.replace(/\/$/, "")}`;

		// Auto-generate title from pathname as fallback
		// TanStack dedupes meta tags - child routes' titles will override this
		const autoTitle = generateTitleFromPathname(pathname);
		const fallbackTitle = autoTitle
			? `${autoTitle} - ${siteConfig.title}`
			: siteConfig.title;

		return head({
			title: fallbackTitle,
			description: siteConfig.description,
			image: siteConfig.og.url,
			keywords: siteConfig.keywords,
			url: canonicalUrl,
			meta: [
				// Document metadata
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ httpEquiv: "Content-Language", content: "en" },
				{ name: "robots", content: "index, follow" },
				{ name: "author", content: "Jacob Samorowski" },

				// Open Graph - Static site-wide values
				{ property: "og:site_name", content: siteConfig.title },
				{ property: "og:locale", content: "en_AU" },
				{ property: "og:type", content: "website" },

				// Twitter - Static site-wide values
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:creator", content: twitterHandle },
				{ name: "twitter:site", content: twitterHandle },
			],
			links: [
				// Canonical link (always generated from current pathname)
				{ rel: "canonical", href: canonicalUrl },
				// Stylesheet
				{ rel: "stylesheet", href: appCss },
				// Font preload for faster loading
				{
					rel: "preload",
					href: "/fonts/MatrixSans-Regular-Print.woff2",
					as: "font",
					type: "font/woff2",
					crossOrigin: "anonymous",
				},
				// Favicon
				{ rel: "icon", href: "/profile-picture.jpg" },
				{ rel: "apple-touch-icon", href: "/profile-picture.jpg" },
				// Discovery
				{ rel: "sitemap", href: "/sitemap-index.xml" },
				{ rel: "manifest", href: "/manifest.webmanifest" },
			],
		});
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
				<div className="-z-50 fixed inset-0 min-h-screen w-full bg-[radial-gradient(#7979792e_1px,transparent_1px)] [background-size:16px_16px]" />
				{showLayout && <Footer />}
			</body>
		</html>
	);
}
