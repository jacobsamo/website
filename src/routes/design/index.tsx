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
		<main className="container mx-auto mt-32 h-screen">
			{allDesigns.map((post, _index) => (
				<Link
					to={`/design/${post._meta.path}`}
					key={post._meta.path}
					className="group relative block h-60 w-sm overflow-hidden rounded-md bg-linear-270 from-10% from-gray-950 to-90% to-transparent"
					aria-label={`View ${post.title} design`}
				>
					<Image
						src={post.heroImage}
						width={400}
						height={300}
						layout="constrained"
						alt={post.title}
						className="inset-0 size-full rounded-md object-cover object-center opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
					/>
					<h2 className="absolute bottom-4 left-4 font-normal text-gray-900 text-lg transition-all duration-300 group-hover:opacity-100 md:opacity-0">
						{post.title}
					</h2>
				</Link>
			))}
		</main>
	);
}
