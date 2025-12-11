import { siteConfig, socials } from "./config";

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
 * @returns Object with meta and links arrays for TanStack Router
 *
 * @example
 * ```tsx
 * export const Route = createFileRoute('/about')({
 *   head: () => ({
 *     meta: seo({
 *       title: 'About - Jacob Samorowski',
 *       description: 'Learn more about Jacob',
 *       url: 'https://jacobsamo.com/about'
 *     }).meta,
 *     links: seo({
 *       title: 'About - Jacob Samorowski',
 *       description: 'Learn more about Jacob',
 *       url: 'https://jacobsamo.com/about'
 *     }).links
 *   })
 * })
 *
 * // Or destructure for cleaner code:
 * export const Route = createFileRoute('/about')({
 *   head: () => {
 *     const { meta, links } = seo({
 *       title: 'About - Jacob Samorowski',
 *       description: 'Learn more about Jacob',
 *       url: 'https://jacobsamo.com/about'
 *     });
 *     return { meta, links };
 *   }
 * })
 * ```
 */
export function seo({
	title,
	description = siteConfig.description,
	keywords = siteConfig.keywords,
	image = siteConfig.og.url,
	url,
}: SeoOptions) {
	// Get Twitter handle from socials config
	const twitterSocial = socials.find((s) => s.platform === "twitter");
	const twitterHandle = twitterSocial?.handle || "@jacobsamorowski";

	// Build the base URL for images (handle both relative and absolute paths)
	const baseUrl =
		typeof window !== "undefined"
			? window.location.origin
			: "https://jacobsamo.com";
	const imageUrl = image?.startsWith("http")
		? image
		: new URL(image, baseUrl).toString();

	const meta = [
		// Page title
		{ title },

		// Basic meta tags
		{ name: "description", content: description },
		{ name: "keywords", content: keywords.join(", ") },
		{ name: "author", content: "Jacob Samorowski" },

		// Open Graph meta tags
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image", content: imageUrl },
		{ property: "og:image:type", content: "image/jpg" },
		...(url ? [{ property: "og:url", content: url }] : []),

		// Twitter meta tags
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: imageUrl },
		{ name: "twitter:creator", content: twitterHandle },
		{ name: "twitter:site", content: twitterHandle },
	];

	const links = url ? [{ rel: "canonical", href: url }] : [];

	return { meta, links };
}
