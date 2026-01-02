import type { AnyRouteMatch } from "@tanstack/react-router";
import { BASE_URL } from "./config";

export interface HeadResult {
	meta: NonNullable<AnyRouteMatch["meta"]>;
	links?: NonNullable<AnyRouteMatch["links"]>;
	scripts?: NonNullable<AnyRouteMatch["scripts"]>;
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
	url,
	// Extra head elements
	meta,
	links,
	scripts,
	styles,
}: HeadOptions): HeadResult => {
	const imageUrl = image ? buildUrl(image) : undefined;

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
						{ property: "og:image:type", content: "image/jpg" },
						{ name: "twitter:image", content: imageUrl },
						{ name: "twitter:image:alt", content: title },
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
		styles,
	};
};
