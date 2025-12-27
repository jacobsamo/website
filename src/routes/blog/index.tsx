import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
	component: BlogPage,
	head: () => ({
		meta: seo({
			title: "Blog - Jacob Samorowski",
			description:
				"Thoughts, tutorials, and stories from a software developer and photographer",
		}),
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
	)
}
