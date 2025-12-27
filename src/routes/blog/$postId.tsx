import { createFileRoute, redirect } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Mdx } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { seo } from "@/lib/seo";
import { upperCaseFirstLetter } from "@/lib/utils";

export const Route = createFileRoute("/blog/$postId")({
	component: BlogPostPage,
	beforeLoad: () => ({
		allPosts,
	}),
	loader: async ({ params, context: { allPosts } }) => {
		const slug = params.postId;
		const post = allPosts.find((d) => d._meta.path === slug);
		if (!post) {
			throw redirect({
				to: "/blog",
			});
		}

		return { post };
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? seo({
					title: loaderData.post.title ?? "post",
					description: loaderData.post.description,
					image: loaderData.post.image,
				})
			: undefined,
	}),
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
