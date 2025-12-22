import { Image } from "@unpic/react";

export interface ProjectCardProps {
	title: string;
	description: string;
	image: string;
	details: string;
	link: string;
}

export const ProjectCard = ({
	title,
	description,
	image,
	details,
	link,
}: ProjectCardProps) => {
	return (
		<a
			href={link}
			className="relative overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl"
		>
			<div className="p-6">
				<h3 className="font-bold text-xl">{title}</h3>
				<p className="text-gray-400 text-sm">{description}</p>
			</div>
			<div className="relative aspect-video">
				<Image
					src={image}
					alt={title}
					width={320}
					height={120}
					className="mx-auto h-11/12 w-11/12 rounded-md object-cover"
				/>
			</div>
		</a>
	);
};
