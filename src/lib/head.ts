import type { AnyRouteMatch } from "@tanstack/react-router";
import { BASE_URL } from "./config";

export interface HeadResult {
	meta: NonNullable<AnyRouteMatch["meta"]>;
	links?: NonNullable<AnyRouteMatch["links"]>;
	scripts?: NonNullable<AnyRouteMatch["scripts"]>;
	headScripts?: NonNullable<AnyRouteMatch["headScripts"]>;
	styles?: NonNullable<AnyRouteMatch["styles"]>;
}

export interface HeadOptions extends Partial<HeadResult> {
	/** Page title - will be used for title tag, og:title, twitter:title */
	title: string;
	/** Page description - used for meta description, og:description, twitter:description */
	description?: string;
	/** Keywords for SEO */
	keywords?: string[];
	/** Image URL for social sharing (relative or absolute) */
	image?: string;
	/** Accessible description of the social image */
	imageAlt?: string;
	imageWidth?: number;
	imageHeight?: number;
	/** URL for social sharing (relative or absolute) */
	url?: string;
}

const buildUrl = (url: string) => {
	if (url.startsWith("http")) {
		return url;
	}

	return new URL(url, BASE_URL).toString().replace(/\/$/, "");
};

export const head = ({
	title,
	description,
	keywords,
	image,
	imageAlt,
	imageWidth,
	imageHeight,
	url,
	// Extra head elements
	meta,
	links,
	scripts,
	headScripts,
	styles,
}: HeadOptions): HeadResult => {
	const imageUrl = image ? buildUrl(image) : undefined;
	const imageType = imageUrl?.match(/\.png(?:\?|$)/i)
		? "image/png"
		: imageUrl?.match(/\.webp(?:\?|$)/i)
			? "image/webp"
			: imageUrl?.match(/\.jpe?g(?:\?|$)/i)
				? "image/jpeg"
				: undefined;

	// remove trailing slash
	const normalizedUrl = url ? buildUrl(url).trim() : undefined;

	return {
		meta: [
			// Title tags
			{ title },
			{ property: "og:title", content: title },
			{ name: "twitter:title", content: title },

			// Description tags
			...(description
				? [
						{ name: "description", content: description },
						{ property: "og:description", content: description },
						{ name: "twitter:description", content: description },
					]
				: []),

			// Keywords
			...(keywords?.length
				? [{ name: "keywords", content: keywords.join(", ") }]
				: []),

			// Image tags
			...(imageUrl
				? [
						{ property: "og:image", content: imageUrl },
						...(imageType
							? [{ property: "og:image:type", content: imageType }]
							: []),
						{ property: "og:image:alt", content: imageAlt ?? title },
						...(imageWidth
							? [{ property: "og:image:width", content: String(imageWidth) }]
							: []),
						...(imageHeight
							? [{ property: "og:image:height", content: String(imageHeight) }]
							: []),
						{ name: "twitter:image", content: imageUrl },
						{ name: "twitter:image:alt", content: imageAlt ?? title },
					]
				: []),

			// URL tags
			...(normalizedUrl
				? [
						{ property: "og:url", content: normalizedUrl },
						{ name: "twitter:url", content: normalizedUrl },
					]
				: []),
			...(meta ?? []),
		],
		links,
		scripts,
		headScripts,
		styles,
	};
};
