import type { AnyRouteMatch } from "@tanstack/react-router";

type HeadElements = {
	links?: AnyRouteMatch["links"];
	scripts?: AnyRouteMatch["headScripts"];
	meta?: AnyRouteMatch["meta"];
	styles?: AnyRouteMatch["styles"];
};

interface HeadProps {
	title: string;
	description?: string;
	keywords?: string[];
	image?: string;
	url?: string;
}

export const head = (
	{ title, description, keywords, image, url }: HeadProps,
	{ links, scripts, meta, styles }: HeadElements,
): HeadElements => {
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

	return {
		links,
		scripts,
		meta: [
			...(meta ?? []),
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
		],
		styles,
	};
};
