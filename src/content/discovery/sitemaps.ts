import { canonicalUrl, discoveryPages, markdownUrl } from "./registry";

function buildSitemapXml(
	getUrl: (page: (typeof discoveryPages)[number]) => string,
) {
	const urls = discoveryPages
		.map((page) => {
			const lastmod = page.lastModified
				? `<lastmod>${page.lastModified.toISOString().slice(0, 10)}</lastmod>`
				: "";
			return `  <url><loc>${getUrl(page)}</loc>${lastmod}</url>`;
		})
		.join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const buildHtmlSitemapXml = () => buildSitemapXml(canonicalUrl);
export const buildMarkdownSitemapXml = () => buildSitemapXml(markdownUrl);
