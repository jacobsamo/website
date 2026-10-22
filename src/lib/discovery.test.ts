import { describe, expect, it } from "vitest";
import {
	buildMarkdownSitemapXml,
	buildSitemapXml,
	canonicalUrl,
	discoveryPages,
	findPageByCanonicalPath,
	findPageByMarkdownPath,
	markdownUrl,
} from "./discovery";
import { renderDiscoveryMarkdown } from "./discovery-markdown";

describe("published discovery pages", () => {
	it("gives every canonical page a unique Markdown representation", () => {
		expect(new Set(discoveryPages.map((page) => page.path)).size).toBe(
			discoveryPages.length,
		);
		expect(new Set(discoveryPages.map((page) => page.markdownPath)).size).toBe(
			discoveryPages.length,
		);
		for (const page of discoveryPages) {
			expect(findPageByCanonicalPath(page.path)).toBe(page);
			expect(findPageByMarkdownPath(page.markdownPath)).toBe(page);
			expect(renderDiscoveryMarkdown(page)).toContain(
				`Canonical HTML: ${canonicalUrl(page)}`,
			);
			expect(renderDiscoveryMarkdown(page).length).toBeGreaterThan(
				page.description.length + 40,
			);
		}
	});

	it("lists only published pages in both sitemaps", () => {
		const htmlSitemap = buildSitemapXml();
		const markdownSitemap = buildMarkdownSitemapXml();
		for (const page of discoveryPages) {
			expect(htmlSitemap).toContain(`<loc>${canonicalUrl(page)}</loc>`);
			expect(markdownSitemap).toContain(`<loc>${markdownUrl(page)}</loc>`);
		}
		expect(htmlSitemap).not.toContain("/playground");
		expect(markdownSitemap).not.toContain("/playground");
	});

	it("keeps interactive MDX components out of the text version", () => {
		const design = discoveryPages.find(
			(page) => page.path === "/design/01-notification",
		);
		expect(design).toBeDefined();
		const markdown = renderDiscoveryMarkdown(design!);
		expect(markdown).toContain("interactive design preview");
		expect(markdown).not.toContain("<TweetCard");
	});
});
