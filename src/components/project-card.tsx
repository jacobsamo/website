import { buttonVariants } from "@/components/ui/button";
import { Image } from "@unpic/react";
import { ExternalLink } from "lucide-react";

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
    <a href={link} className="relative overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl">
      <div className="p-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          width={320}
          height={120}
          className="h-11/12 w-11/12 object-cover mx-auto rounded-md"
        />
      </div>
    </a>
  );
};
