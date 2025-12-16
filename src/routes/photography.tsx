import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import images from "@/lib/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/photography")({
	component: PhotographyPage,
	head: () => ({
		meta: seo({
			title: "Photography - Jacob Samorowski",
			description:
				"A collection of my photography work capturing moments and stories",
			url: "https://jacobsamo.com/photography",
		}),
	}),
});

function PhotographyPage() {
	return (
		<div className="masonry-container mt-16 columns-2 gap-2 sm:columns-3 lg:columns-5 mb-16">
			{images.map((image) => (
				<Image
					key={image.fileName}
					src={image.url}
					alt={image.alt}
					title={image.title}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					width={image.width}
					height={image.height}
					loading="lazy"
					decoding="async"
					className="mb-1 break-inside-avoid h-auto w-full rounded-lg object-cover object-center"
					background="linear-gradient(135deg, oklch(0.28 0.008 265) 0%, oklch(0.21 0.01 265) 100%)"
				/>
			))}
		</div>
	);
}
