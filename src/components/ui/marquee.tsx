import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
	className?: string;
	reverse?: boolean;
	pauseOnHover?: boolean;
	vertical?: boolean;
	repeat?: number;
	fade?: boolean;
	children: ReactNode;
}

export const Marquee = ({
	className,
	reverse = false,
	pauseOnHover = false,
	vertical = false,
	repeat = 4,
	fade = true,
	children,
}: MarqueeProps) => {
	return (
		<div
			className={cn(
				"group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
				{
					"flex-row": !vertical,
					"flex-col": vertical,
				},
				fade &&
					!vertical &&
					"[mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]",
				fade &&
					vertical &&
					"[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]",
				className,
			)}
		>
			{Array(repeat)
				.fill(0)
				.map((_, index) => (
					<div
						key={index}
						className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
							"animate-marquee flex-row": !vertical,
							"animate-marquee-vertical flex-col": vertical,
							"group-hover:[animation-play-state:paused]": pauseOnHover,
							"[animation-direction:reverse]": reverse,
						})}
					>
						{children}
					</div>
				))}
		</div>
	);
};
