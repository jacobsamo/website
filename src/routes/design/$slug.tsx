import { createFileRoute, redirect } from "@tanstack/react-router";
import { allDesigns } from "content-collections";
import { Suspense } from "react";
import { DesignViewer } from "@/components/design-viewer";
import { Mdx } from "@/components/mdx-components";
import { Badge } from "@/components/ui/badge";
import { DesignDemo, hasDesignDemo } from "@/designs/registry";
import { head } from "@/lib/head";
import { upperCaseFirstLetter } from "@/lib/utils";

export const Route = createFileRoute("/design/$slug")({
	component: RouteComponent,
	loader: ({ params }) => {
		const design = allDesigns.find((d) => d._meta.path === params.slug);
		if (!design) {
			throw redirect({ to: "/design" });
		}
		return { design };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [] };
		return head({
			title: loaderData.design.title ?? "Design",
			description: loaderData.design.shortDescription,
			image: loaderData.design.image,
		});
	},
});

function RouteComponent() {
	const { design } = Route.useLoaderData();

	return (
		<main className="container mx-auto min-h-screen px-4 pt-8 pb-16">
			<h1 className="mt-2 scroll-m-20 font-bold text-4xl tracking-tight">
				{design.title}
			</h1>
			<div className="mt-1 flex flex-wrap gap-2">
				{design.tags.map((tag) => (
					<Badge key={tag} variant="outline">
						{upperCaseFirstLetter(tag)}
					</Badge>
				))}
			</div>
			{hasDesignDemo(design._meta.path) ? (
				<DesignViewer>
					<Suspense
						fallback={
							<div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
								Loading preview...
							</div>
						}
					>
						<DesignDemo slug={design._meta.path} />
					</Suspense>
				</DesignViewer>
			) : null}
			<Mdx code={design.mdx} />
		</main>
	);
}
