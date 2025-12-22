import { platforms as allPlatforms, type Social, socials } from "@/lib/config";

export interface SocialProps {
	size?: number;
	platforms?: readonly Social["platform"][];
}

export const Socials = ({
	size = 24,
	platforms = allPlatforms,
}: SocialProps) => {
	return (
		<span
			id="social-links"
			className="flex flex-row items-center justify-center gap-4"
		>
			{socials
				.filter((s) => platforms.includes(s.platform))
				.map((s) => {
					return (
						<a
							key={s.platform}
							href={s.url}
							target="_blank"
							rel="noopener noreferrer"
							className="touch-hitbox"
						>
							<img
								src={`/assets/icons/socials/${s.platform}.svg`}
								alt={`${s.platform} icon`}
								width={size}
								height={size}
							/>
						</a>
					);
				})}
		</span>
	);
};
