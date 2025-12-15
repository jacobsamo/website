import { createFileRoute, redirect } from "@tanstack/react-router";
import { allDesigns } from "content-collections";
import { Mdx } from "@/components/mdx-components";
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
		meta: seo({
			title: loaderData?.design.title ?? "Design",
			description: loaderData?.design.description,
		}).meta,
	}),
});

function RouteComponent() {
	const { design } = Route.useLoaderData();
	return (
		<main className="h-screen container mx-auto px-4 py-8">
			<Mdx code={design.mdx} />
		</main>
	);
}
