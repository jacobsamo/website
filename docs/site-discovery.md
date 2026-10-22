# Site discovery

The public content is kept in `src/content/`:

- `site.ts` holds the static page copy shared by HTML and Markdown.
- `posts/` and `designs/` hold the authored MDX. Their published collection entries supply page titles, descriptions, dates, and article bodies.
- `discovery/registry.ts` lists every canonical HTML page and its Markdown URL. It drives HTML alternate links and both sitemaps.
- `discovery/markdown.ts` generates each page's Markdown body from the shared copy, collections, photography data, and social links.
- `discovery/agents.ts` generates `llms.txt` and `llms-full.txt`; the full document reuses the page Markdown renderer.
- `discovery/sitemaps.ts` generates the HTML and Markdown sitemaps from the registry.

When publishing a new public route, add it to the registry and give it a renderer in `markdown.ts`. The discovery tests check for missing representations and links.

| HTML page | Markdown representation |
| --- | --- |
| `/` | `/index.md` |
| `/blog` | `/blog.md` |
| `/blog/<slug>` | `/blog/<slug>.md` |
| `/design` | `/design.md` |
| `/design/<slug>` | `/design/<slug>.md` |
| `/photography` | `/photography.md` |
| `/links` | `/links.md` |

`src/server.ts` serves the generated Markdown documents with `Content-Type: text/markdown` and an HTTP canonical link to the HTML page. These are URL representations generated from content sources, not duplicate files to edit by hand. The server also serves `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, and `/sitemap-markdown.xml`. The older singular LLM URLs redirect permanently to the plural URLs. Unknown `.md` paths return a Markdown 404.

The HTML sitemap is the only sitemap advertised in `robots.txt`, since those are the preferred URLs for search results. `llms.txt` links to the Markdown sitemap for tools that want text representations. HTML pages remain prerendered and do not negotiate `Accept: text/markdown`; request their explicit `.md` URL instead.

These files help text-based tools read and navigate the portfolio. They are not required for Google Search or its AI features; accurate, crawlable HTML remains the main search surface.
