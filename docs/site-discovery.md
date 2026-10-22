# Site discovery

The public page registry in `src/lib/discovery.ts` lists every canonical HTML page and its Markdown representation. It drives both sitemaps and the HTML alternate links. Add a page there when publishing a new route, and add its text rendering in `src/lib/discovery-markdown.ts`.

| HTML page | Markdown representation |
| --- | --- |
| `/` | `/index.md` |
| `/blog` | `/blog.md` |
| `/blog/<slug>` | `/blog/<slug>.md` |
| `/design` | `/design.md` |
| `/design/<slug>` | `/design/<slug>.md` |
| `/photography` | `/photography.md` |
| `/links` | `/links.md` |

`src/server.ts` serves the Markdown documents with `Content-Type: text/markdown` and an HTTP canonical link to the HTML page. It also serves `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, and `/sitemap-markdown.xml`. The older singular LLM URLs redirect permanently to the plural URLs. Unknown `.md` paths return a Markdown 404.

The HTML sitemap is the only sitemap advertised in `robots.txt`, since those are the preferred URLs for search results. `llms.txt` links to the Markdown sitemap for tools that want text representations. HTML pages remain prerendered and do not negotiate `Accept: text/markdown`; request their explicit `.md` URL instead.

These files help text-based tools read and navigate the portfolio. They are not required for Google Search or its AI features; accurate, crawlable HTML remains the main search surface.
