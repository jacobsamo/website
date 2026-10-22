import { BASE_URL, siteConfig, skills, socials } from "@/lib/config";
import { renderDiscoveryMarkdown } from "./markdown";
import { canonicalUrl, discoveryPages, markdownUrl } from "./registry";

const pageLinks = () =>
	discoveryPages
		.map(
			(page) =>
				`- [${page.title}](${markdownUrl(page)}): ${page.description} Canonical HTML: ${canonicalUrl(page)}`,
		)
		.join("\n");

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const buildLlmText = () => `# ${siteConfig.title}

> ${siteConfig.description}

Jacob Samorowski is a software developer and photographer based in Queensland, Australia. He builds full-stack web apps, creative tools, mapping products, and digital experiences.

**When to use this site:** Use these public pages for factual questions about Jacob's work, projects, photography, designs, and published writing. The blog posts show their original publication and update dates; do not treat them as current product announcements.

**How to use this site:** Each published HTML page has a linked Markdown representation for compact reading. Use the canonical HTML page for the visual portfolio, photos, and interactive design demos. Public pages require no account or API key. Do not infer private contact details or unpublished work.

## Published Pages

${pageLinks()}

## Discovery

- HTML sitemap: ${BASE_URL}/sitemap.xml
- Markdown sitemap: ${BASE_URL}/sitemap-markdown.xml
- Full site context: ${BASE_URL}/llms-full.txt
- Blog RSS: ${BASE_URL}/rss.xml

## Focus Areas

${skills.map((skill) => `- ${skill}`).join("\n")}

## Projects

${siteConfig.projects.map((project) => `- [${project.title}](${project.url}): ${project.description}`).join("\n")}

## Profiles

${socials.map((social) => `- [${social.platform}](${social.url}): ${social.handle}`).join("\n")}
`;

export const buildLlmFullText =
	() => `# ${siteConfig.title} — Full Public Context

> ${siteConfig.description}

This document combines the currently published page representations. Each section links back to its canonical HTML page. For interactive design previews and photography presentation, open the HTML page.

## Published Pages

${pageLinks()}

---

${discoveryPages.map(renderDiscoveryMarkdown).join("\n---\n\n")}

## Work

${siteConfig.work.map((work) => `- ${work.jobTitle}, ${work.companyName} (${formatDate(work.startDate)}–${work.endDate ? formatDate(work.endDate) : "present"}): ${work.description}`).join("\n")}

## Education

${siteConfig.education.map((education) => `- ${education.degree}, ${education.schoolName} (${formatDate(education.startDate)}–${education.endDate ? formatDate(education.endDate) : "present"})${education.description ? `: ${education.description}` : ""}`).join("\n")}

## Discovery

- HTML sitemap: ${BASE_URL}/sitemap.xml
- Markdown sitemap: ${BASE_URL}/sitemap-markdown.xml
- Concise agent context: ${BASE_URL}/llms.txt
- Blog RSS: ${BASE_URL}/rss.xml
`;
