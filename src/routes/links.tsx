import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ExternalLink, Globe2 } from "lucide-react";
import { CopyRight } from "@/components/footer";
import { socials } from "@/lib/config";
import { head } from "@/lib/head";

export const Route = createFileRoute("/links")({
	component: LinksPage,
	staticData: {
		meta: {
			showLayout: false,
		},
	},
	head: () =>
		head({
			title: "Links - Jacob Samorowski",
			description: "All my social links and ways to connect with me",
		}),
});

function LinksPage() {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto max-w-md px-4 py-12">
				{/* Header */}
				<div className="mb-12 text-center">
					<div className="mb-6">
						<Image
							src="/profile-picture.jpg"
							alt="Jacob's profile picture"
							width={128}
							height={128}
							className="mx-auto rounded-full object-cover object-center"
						/>
					</div>
					<h1 className="mb-3 text-balance font-bold font-serif text-4xl text-white">
						Jacob Samorowski
					</h1>
					<p className="font-sans text-gray-400 text-lg">
						Software Developer & Photographer
					</p>
				</div>

				{/* Social Links */}
				<div className="space-y-3">
					<Link
						to="/"
						className="group flex flex-row items-center justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-4 py-6 text-card-foreground shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-gray-700 hover:bg-gray-800/50 active:scale-[0.99]"
					>
						<div className="flex items-center gap-4">
							<Globe2 />

							<div>
								<div className="font-semibold text-base text-white capitalize">
									Website
								</div>
							</div>
						</div>
						<ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-white" />
					</Link>
					{socials.map((social) => (
						<a
							key={social.url}
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex flex-row items-center justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-4 py-6 text-card-foreground shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-gray-700 hover:bg-gray-800/50 active:scale-[0.99]"
						>
							<div className="flex items-center gap-4">
								<img
									src={`/assets/icons/socials/${social.platform}.svg`}
									alt={`${social.platform} icon`}
									width={24}
									height={24}
								/>
								<div>
									<div className="font-semibold text-base text-white capitalize">
										{social.platform === "twitter"
											? "X (Twitter)"
											: social.platform}
									</div>
									<div className="text-gray-400 text-sm">{social.handle}</div>
								</div>
							</div>
							<ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-white" />
						</a>
					))}
				</div>

				{/* Footer */}
				<div className="mt-12 border-secondary border-t pt-8 text-center">
					<p className="text-gray-500 text-sm">
						<CopyRight />, Jacob Samorowski
					</p>
				</div>
			</div>
		</div>
	);
}
