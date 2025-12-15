import { createFileRoute, Link } from "@tanstack/react-router";
import { allDesigns } from "content-collections";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/design/")({
	component: DesignPage,
	head: () => {
		const { meta, links } = seo({
			title: "Design - Jacob Samorowski",
			description: "Coding challenges and exercises I've completed",
			url: "https://jacobsamo.com/challenges",
		});
		return { meta, links };
	},
});

function DesignPage() {
	return (
		<main className="h-screen">
			{allDesigns.map((post, index) => (
				<Link
					to={`/design/${post._meta.path}`}
					key={post._meta.path}
					className="block p-4 rounded-md bg-white text-black"
				>
					<h2>{post.title}</h2>
					<p>{post.description}</p>
				</Link>
			))}
		</main>
	);
}
