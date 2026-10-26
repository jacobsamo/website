import { createFileRoute, redirect } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { Mdx } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { head } from "@/lib/head";
import {
	blogPostingJsonLd,
	breadcrumbJsonLd,
	jsonLdGraph,
	jsonLdScript,
} from "@/lib/structured-data";
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
			imageAlt: loaderData.post.title,
			url: `/blog/${loaderData.post._meta.path}`,
			headScripts: [
				jsonLdScript(
					jsonLdGraph([
						blogPostingJsonLd(loaderData.post),
						breadcrumbJsonLd([
							{ name: "Home", path: "/" },
							{ name: "Blog", path: "/blog" },
							{
								name: loaderData.post.title,
								path: `/blog/${loaderData.post._meta.path}`,
							},
						]),
					]),
				),
			],
		});
	},
});

function BlogPostPage() {
	const { post } = Route.useLoaderData();

	return (
		<main className="mx-auto min-h-screen max-w-3xl px-5 pt-20 pb-20 sm:px-6">
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
			<img
				src={post.image}
				alt=""
				className="mt-8 aspect-[1200/630] w-full rounded-xl border border-white/10 object-cover"
			/>
			<Mdx collection="posts" filePath={post._meta.filePath} />
		</main>
	);
}
