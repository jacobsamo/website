import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { head } from "@/lib/head";
import {
	blogJsonLd,
	breadcrumbJsonLd,
	jsonLdGraph,
	jsonLdScript,
} from "@/lib/structured-data";

const postsByDate = [...allPosts].sort(
	(a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
);

export const Route = createFileRoute("/blog/")({
	component: BlogPage,
	head: () =>
		head({
			title: "Blog - Jacob Samorowski",
			description:
				"Thoughts, tutorials, and stories from a software developer and photographer",
			headScripts: [
				jsonLdScript(
					jsonLdGraph([
						blogJsonLd(postsByDate),
						breadcrumbJsonLd([
							{ name: "Home", path: "/" },
							{ name: "Blog", path: "/blog" },
						]),
					]),
				),
			],
		}),
});

function BlogPage() {
	return (
		<main className="relative flex h-full w-full flex-col items-center justify-center">
			<div className="items-center justify-center text-center">
				<h1>No blog posts from me just yet</h1>
				<p>Check back in later</p>
			</div>
		</main>
	);
}
