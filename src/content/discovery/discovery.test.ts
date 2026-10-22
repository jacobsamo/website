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
import {
	getDiscoveryResponse,
	getNegotiatedResponse,
	withMissingPageRobots,
} from "./response";
import { buildHtmlSitemapXml, buildMarkdownSitemapXml } from "./sitemaps";
import { organizationJsonLd, personJsonLd } from "@/lib/structured-data";

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

	it("negotiates Markdown on the canonical homepage and leaves HTML requests to the router", async () => {
		const url = "https://jacobsamo.com/";
		const markdown = getNegotiatedResponse(
			new Request(url, { headers: { Accept: "text/markdown" } }),
		);
		expect(markdown?.status).toBe(200);
		expect(markdown?.headers.get("Content-Type")).toBe(
			"text/markdown; charset=utf-8",
		);
		expect(markdown?.headers.get("Vary")).toBe("Accept");
		expect(await markdown?.text()).toContain("# Jacob Samorowski");
		expect(
			getNegotiatedResponse(
				new Request(url, { headers: { Accept: "text/html" } }),
			),
		).toBeNull();
		const unknown = getNegotiatedResponse(
			new Request("https://jacobsamo.com/does-not-exist", {
				headers: { Accept: "text/markdown" },
			}),
		);
		expect(unknown?.status).toBe(404);
		expect(unknown?.headers.get("Content-Type")).toBe(
			"text/markdown; charset=utf-8",
		);
		expect(await unknown?.text()).toContain("/llms.txt");
		expect(
			getNegotiatedResponse(
				new Request(url, { headers: { Accept: "text/markdown;q=0" } }),
			),
		).toBeNull();
		const head = getNegotiatedResponse(
			new Request(url, {
				method: "HEAD",
				headers: { Accept: "text/markdown" },
			}),
		);
		expect(await head?.text()).toBe("");
	});

	it("returns a useful Markdown body for missing paths and retains HTML 404s", async () => {
		const url = "https://jacobsamo.com/does-not-exist";
		const missing = new Response("<h1>Not found</h1>", {
			status: 404,
			headers: { "Content-Type": "text/html" },
		});
		const markdown = withMissingPageRobots(
			new Request(url, { headers: { Accept: "text/markdown" } }),
			missing,
		);
		expect(markdown.status).toBe(404);
		expect(markdown.headers.get("Content-Type")).toBe(
			"text/markdown; charset=utf-8",
		);
		expect(markdown.headers.get("Vary")).toBe("Accept");
		expect(await markdown.text()).toContain("/llms.txt");
		const html = withMissingPageRobots(
			new Request(url, { headers: { Accept: "text/html" } }),
			missing,
		);
		expect(html.status).toBe(404);
		expect(html.headers.get("Content-Type")).toBe("text/html");
	});

	it("marks published HTML responses as varying by Accept", () => {
		const response = withMissingPageRobots(
			new Request("https://jacobsamo.com/", {
				headers: { Accept: "text/html" },
			}),
			new Response("<main>Home</main>", {
				headers: { "Content-Type": "text/html" },
			}),
		);
		expect(response.headers.get("Vary")).toBe("Accept");
		expect(response.headers.get("Content-Type")).toBe("text/html");
	});

	it("does not publish removed trust pages", () => {
		for (const name of ["about", "contact", "privacy"]) {
			expect(findPageByCanonicalPath(`/${name}`)).toBeUndefined();
			expect(findPageByMarkdownPath(`/${name}.md`)).toBeUndefined();
			expect(buildHtmlSitemapXml()).not.toContain(`/${name}<`);
			expect(buildMarkdownSitemapXml()).not.toContain(`/${name}.md<`);
			expect(buildLlmText()).not.toContain(`/${name}.md`);
		}
	});

	it("identifies the person and provides an organization contact and regional address", () => {
		expect(personJsonLd()).toMatchObject({ name: "Jacob Samorowski" });
		const organization = organizationJsonLd();
		expect(organization).toMatchObject({
			"@type": "Organization",
			contactPoint: { email: "jacob@jacobsamo.com" },
			address: { addressCountry: "AU" },
		});
	});
});
