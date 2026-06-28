import type {
	Blog,
	BlogPosting,
	BreadcrumbList,
	Graph,
	ListItem,
	Person,
	ProfilePage,
	Thing,
	WebSite,
	WithContext,
} from "schema-dts";
import { BASE_URL, siteConfig, socials } from "@/lib/config";

type JsonLdNode = Thing | WithContext<Thing> | Graph;

const personId = `${BASE_URL}/#person`;
const websiteId = `${BASE_URL}/#website`;
const blogId = `${BASE_URL}/blog/#blog`;

const absoluteUrl = (path: string) => {
	if (path.startsWith("http")) return path;

	return new URL(path, BASE_URL).toString().replace(/\/$/, "");
};

const jsonLdStringify = (data: JsonLdNode) =>
	JSON.stringify(data).replace(/</g, "\\u003c");

export const jsonLdScript = (data: JsonLdNode) => ({
	type: "application/ld+json",
	children: jsonLdStringify(data),
});

export const jsonLdGraph = (nodes: Thing[]): Graph => ({
	"@context": "https://schema.org",
	"@graph": nodes,
});

export const personJsonLd = (): Person => ({
	"@type": "Person",
	"@id": personId,
	name: "Jacob Samorowski",
	url: BASE_URL,
	image: absoluteUrl(siteConfig.og.url),
	jobTitle: ["Software Developer", "Photographer"],
	description:
		"Jacob Samorowski is a software developer and photographer based in Queensland, Australia.",
	knowsAbout: siteConfig.keywords,
	sameAs: socials.map((social) => social.url),
});

export const websiteJsonLd = (): WebSite => ({
	"@type": "WebSite",
	"@id": websiteId,
	name: siteConfig.title,
	url: BASE_URL,
	description: siteConfig.description,
	inLanguage: "en-AU",
	publisher: { "@id": personId },
	author: { "@id": personId },
});

export const profilePageJsonLd = (): ProfilePage => ({
	"@type": "ProfilePage",
	"@id": `${BASE_URL}/#profile`,
	url: BASE_URL,
	name: siteConfig.title,
	description: siteConfig.description,
	inLanguage: "en-AU",
	isPartOf: { "@id": websiteId },
	about: { "@id": personId },
	mainEntity: { "@id": personId },
});

export const blogJsonLd = (
	posts: Array<{
		title: string;
		description: string;
		pubDate: Date;
		_meta: { path: string };
	}>,
): Blog => ({
	"@type": "Blog",
	"@id": blogId,
	url: absoluteUrl("/blog"),
	name: "Jacob Samorowski Blog",
	description:
		"Writing from Jacob Samorowski about software development, startups, design, and learning.",
	inLanguage: "en-AU",
	isPartOf: { "@id": websiteId },
	author: { "@id": personId },
	blogPost: posts.map((post) => ({
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		datePublished: post.pubDate.toISOString(),
		url: absoluteUrl(`/blog/${post._meta.path}`),
		author: { "@id": personId },
	})),
});

export const blogPostingJsonLd = (post: {
	title: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	image: string;
	tags: string[];
	_meta: { path: string };
}): BlogPosting => ({
	"@type": "BlogPosting",
	"@id": `${absoluteUrl(`/blog/${post._meta.path}`)}#article`,
	mainEntityOfPage: absoluteUrl(`/blog/${post._meta.path}`),
	headline: post.title,
	description: post.description,
	image: absoluteUrl(post.image),
	datePublished: post.pubDate.toISOString(),
	dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
	author: { "@id": personId },
	publisher: { "@id": personId },
	isPartOf: { "@id": blogId },
	keywords: post.tags,
	inLanguage: "en-AU",
});

export const breadcrumbJsonLd = (
	items: Array<{ name: string; path: string }>,
): BreadcrumbList => ({
	"@type": "BreadcrumbList",
	itemListElement: items.map<ListItem>((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: absoluteUrl(item.path),
	})),
});
