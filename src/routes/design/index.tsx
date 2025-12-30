import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { allDesigns } from "content-collections";
import { Video } from "@/components/video";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/design/")({
	component: DesignPage,
	head: () => ({
		meta: seo({
			title: "Designs - Jacob Samorowski",
			description: "Interactive UI designs and component showcases",
			url: "https://jacobsamo.com/design",
		}),
	}),
});

function DesignPage() {
	return (
		<main className="container mx-auto mt-32 h-screen">
			{allDesigns.map((post, _index) => (
				<Link
					to="/design/$slug"
					params={{ slug: post._meta.path }}
					key={post._meta.path}
					className="group relative block h-60 w-sm overflow-hidden rounded-md bg-linear-270 from-10% from-gray-950 to-90% to-transparent"
					aria-label={`View ${post.title} design`}
				>
					{post.videoUrl ? (
						<div className="inset-0 size-full transform-gpu overflow-hidden rounded-md opacity-90 transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.02] group-hover:opacity-95">
							<Video
								src={post.videoUrl}
								poster={post.image}
								alt={`${post.title} design preview`}
								autoPlay
								loop
								muted
								playsInline
								lazy={false}
								fill
								controls={false}
								videoClassName="rounded-md"
							/>
						</div>
					) : (
						<div className="inset-0 size-full transform-gpu rounded-md object-cover object-center opacity-90 transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.02] group-hover:opacity-95">
							<Image
								src={post.image}
								width={800}
								height={600}
								layout="constrained"
								alt={`${post.title} design preview`}
								className="h-full w-full rounded-md object-cover object-center"
							/>
						</div>
					)}
					<h2 className="absolute bottom-4 left-4 font-normal text-gray-700 text-lg opacity-100 transition-all duration-300 group-hover:opacity-100 md:opacity-0">
						{post.title}
					</h2>
				</Link>
			))}
		</main>
	);
}
