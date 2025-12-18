import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { allDesigns } from "content-collections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/design/")({
	component: DesignPage,
	head: () => ({
		meta: seo({
			title: "Design - Jacob Samorowski",
			description: "Coding challenges and exercises I've completed",
			url: "https://jacobsamo.com/challenges",
		}),
	}),
});

function DesignPage() {
	return (
		<main className="h-screen container mx-auto mt-32">
			{allDesigns.map((post, index) => (
				<Link
					to={`/design/${post._meta.path}`}
					key={post._meta.path}
					className="group relative block rounded-md w-sm h-60 overflow-hidden bg-linear-270 from-gray-950 from-10% to-transparent to-90% "
					aria-label={`View ${post.title} design`}
				>
					<Image
						src={post.heroImage}
						width={400}
						height={300}
						layout="constrained"
						alt={post.title}
						className="size-full rounded-md object-center object-cover inset-0 opacity-90 transition group-hover:opacity-85 group-hover:scale-105 duration-500"
					/>
					<h2 className="absolute bottom-4 left-4 opacity-0 transition-all group-hover:opacity-100 text-gray-900 duration-300 font-normal text-lg">
						{post.title}
					</h2>
				</Link>
			))}
		</main>
	);
}
