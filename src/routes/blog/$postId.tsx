import { createFileRoute, redirect } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Mdx } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { head } from "@/lib/head";
import { upperCaseFirstLetter } from "@/lib/utils";

export const Route = createFileRoute("/blog/$postId")({
	component: BlogPostPage,
	loader: ({ params }) => {
		const post = allPosts.find((d) => d._meta.path === params.postId);
		if (!post) {
			throw redirect({ to: "/blog" });
		}
		return { post };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [] };
		return head({
			title: loaderData.post.title ?? "Blog Post",
			description: loaderData.post.description,
			image: loaderData.post.image,
		});
	},
});

function BlogPostPage() {
	const { post } = Route.useLoaderData();

	return (
		<main className="container mx-auto min-h-screen px-4 pt-8 pb-16">
			<h1 className="mt-2 scroll-m-20 font-bold text-4xl tracking-tight">
				{post.title}
			</h1>
			<div className="mt-1 flex flex-wrap gap-2">
				{post.tags.map((tag) => (
					<Badge key={tag} variant="outline">
						{upperCaseFirstLetter(tag)}
					</Badge>
				))}
			</div>
			<Mdx code={post.mdx} />
		</main>
	);
}
