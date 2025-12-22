import { createFileRoute, redirect } from "@tanstack/react-router";
import { allDesigns } from "content-collections";
import { Mdx } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/design/$slug")({
	component: RouteComponent,
	beforeLoad: () => ({
		allDesigns,
	}),
	loader: async ({ params, context: { allDesigns } }) => {
		const slug = params.slug;
		const design = allDesigns.find((d) => d._meta.path === slug);
		if (!design) {
			throw redirect({
				to: "/design",
			});
		}

		return { design };
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? seo({
					title: loaderData.design.title ?? "Design",
					description: loaderData.design.shortDescription,
				})
			: undefined,
	}),
});

function RouteComponent() {
	const { design } = Route.useLoaderData();
	return (
		<main className="container mx-auto min-h-screen px-4 py-8">
			<h1 className="mt-2 scroll-m-20 font-bold text-4xl tracking-tight">
				{design.title}
			</h1>
			{design.tags.map((tag) => (
				<Badge key={tag} variant="outline">
					{tag}
				</Badge>
			))}
			<Mdx code={design.mdx} />
		</main>
	);
}
