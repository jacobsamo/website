import type { AnyRouteMatch } from "@tanstack/react-router";

interface SeoOptions {
	title: string;
	description?: string;
	keywords?: string[];
	image?: string;
	url?: string;
}

/**
 * Generate SEO configuration for TanStack Router head management
 * @param options - SEO configuration options
 * @returns Array of meta tags for TanStack Router
 *
 * @example
 * ```tsx
 * export const Route = createFileRoute('/about')({
 *   head: () => ({
 *     meta: seo({
 *       title: 'About - Jacob Samorowski',
 *       description: 'Learn more about Jacob',
 *       url: 'https://jacobsamo.com/about'
 *     }),
 *   })
 * })
 * ```
 */
export function seo({
	title,
	description,
	keywords,
	image,
	url,
}: SeoOptions): NonNullable<AnyRouteMatch["meta"]> {
	// Build the base URL for images (handle both relative and absolute paths)
	const baseUrl =
		typeof window !== "undefined"
			? window.location.origin
			: "https://jacobsamo.com";
	const imageUrl = image
		? image?.startsWith("http")
			? image
			: new URL(image, baseUrl).toString()
		: undefined;

	return [
		// Page title
		{ title },
		{ property: "og:title", content: title },
		{ name: "twitter:title", content: title },

		...(description
			? [
					{ name: "description", content: description },
					{ name: "twitter:description", content: description },
					{ property: "og:description", content: description },
				]
			: []),

		// Basic meta tags
		...(keywords ? [{ name: "keywords", content: keywords.join(", ") }] : []),

		// Open Graph meta tags
		...(imageUrl
			? [
					{ property: "og:image", content: imageUrl },
					{ property: "og:image:type", content: "image/jpg" },
					{ name: "twitter:image", content: imageUrl },
					{ name: "twitter:image:alt", content: title },
				]
			: []),

		...(url
			? [
					{ property: "og:url", content: url },
					{ name: "twitter:url", content: url },
				]
			: []),
	];
}
