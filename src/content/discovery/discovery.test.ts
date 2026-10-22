import { describe, expect, it } from "vitest";
import { pageCopy } from "../site";
import { buildLlmFullText, buildLlmText } from "./agents";
import {
	canonicalUrl,
	discoveryPages,
	findPageByCanonicalPath,
	findPageByMarkdownPath,
	markdownUrl,
} from "./registry";
import { renderDiscoveryMarkdown } from "./markdown";
import { getDiscoveryResponse } from "./response";
import { buildHtmlSitemapXml, buildMarkdownSitemapXml } from "./sitemaps";

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
		const htmlSitemap = buildHtmlSitemapXml();
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

	it("reuses authored page copy and lists every Markdown page for agents", () => {
		const home = discoveryPages.find((page) => page.path === "/");
		expect(home).toBeDefined();
		expect(renderDiscoveryMarkdown(home!)).toContain(pageCopy.home.about);
		for (const page of discoveryPages) {
			expect(buildLlmText()).toContain(markdownUrl(page));
			expect(buildLlmFullText()).toContain(
				`Canonical HTML: ${canonicalUrl(page)}`,
			);
		}
	});

	it("serves every published Markdown URL with an HTML canonical link", async () => {
		for (const page of discoveryPages) {
			const response = getDiscoveryResponse(new Request(markdownUrl(page)));
			expect(response?.status).toBe(200);
			expect(response?.headers.get("Content-Type")).toBe(
				"text/markdown; charset=utf-8",
			);
			expect(response?.headers.get("Link")).toBe(
				`<${canonicalUrl(page)}>; rel="canonical"`,
			);
			expect(await response?.text()).toContain(page.title);
		}
	});

	it("handles HEAD, legacy URLs, and missing Markdown pages", async () => {
		const head = getDiscoveryResponse(
			new Request("https://jacobsamo.com/blog.md", { method: "HEAD" }),
		);
		expect(head?.status).toBe(200);
		expect(await head?.text()).toBe("");

		const legacy = getDiscoveryResponse(
			new Request("https://jacobsamo.com/llm.txt"),
		);
		expect(legacy?.status).toBe(308);
		expect(legacy?.headers.get("Location")).toBe(
			"https://jacobsamo.com/llms.txt",
		);

		const missing = getDiscoveryResponse(
			new Request("https://jacobsamo.com/unknown.md"),
		);
		expect(missing?.status).toBe(404);
		expect(missing?.headers.get("X-Robots-Tag")).toBe("noindex");
	});
});
