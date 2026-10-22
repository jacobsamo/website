import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { pageCopy } from "@/content/site";
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
			description: pageCopy.blog.description,
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
		<main className="container mx-auto min-h-screen px-4 pt-12 pb-20">
			<h1 className="text-4xl font-bold tracking-tight">Blog</h1>
			<p className="mt-3 text-muted-foreground">
				Writing about software, design, and what I learn along the way.
			</p>
			<div className="mt-10 grid gap-6">
				{postsByDate.map((post) => (
					<article key={post._meta.path}>
						<Link
							to="/blog/$postId"
							params={{ postId: post._meta.path }}
							className="group block rounded-lg border p-6 hover:bg-muted/30"
						>
							<time
								dateTime={post.pubDate.toISOString()}
								className="text-sm text-muted-foreground"
							>
								{post.pubDate.toLocaleDateString("en-AU", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</time>
							<h2 className="mt-2 text-2xl font-semibold group-hover:underline">
								{post.title}
							</h2>
							<p className="mt-2 text-muted-foreground">{post.description}</p>
						</Link>
					</article>
				))}
			</div>
		</main>
	);
}
