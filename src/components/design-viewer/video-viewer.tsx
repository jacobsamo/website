"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Video, type VideoProps } from "@/components/video";

/**
 * Utility type for className strings to enable Tailwind CSS IntelliSense
 */
type ClassNameValue = string;

export interface DesignVideoViewerProps
	extends Omit<VideoProps, "fill" | "controls" | "className"> {
	/**
	 * Custom class names for different parts of the DesignVideoViewer
	 */
	classes?: {
		/** Class names for the main container */
		containerClassName?: ClassNameValue;
	};
}

/**
 * A specialized video viewer designed for the design showcase pages.
 * Fills the full container space and is optimized for displaying design videos.
 *
 * Features:
 * - Fills the full container (no aspect ratio constraints)
 * - Autoplay, loop, and muted by default for seamless playback
 * - No visible controls for cleaner design presentation
 * - Supports both relative and absolute video URLs
 * - Supports YouTube videos (auto-detected)
 *
 * @example
 * ```tsx
 * // Basic usage with a relative URL
 * <DesignVideoViewer src="/videos/my-design.mp4" />
 *
 * // With a YouTube video
 * <DesignVideoViewer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
 *
 * // With custom options
 * <DesignVideoViewer
 *   src="/videos/my-design.mp4"
 *   poster="/images/poster.jpg"
 *   autoPlay={false}
 *   loop={false}
 * />
 * ```
 */
export const DesignVideoViewer: React.FC<DesignVideoViewerProps> = ({
	src,
	poster,
	autoPlay = true,
	loop = true,
	muted = true,
	playsInline = true,
	lazy = false,
	classes,
	...props
}) => {
	return (
		<div
			id="design-video-viewer-container"
			className={cn(
				"group relative mt-4 mb-8 h-[25rem] w-full overflow-hidden rounded-md border transition-colors duration-300 sm:h-[30rem] md:h-[40rem]",
				"border-gray-200 bg-black",
				"dark:border-[oklch(0.274_0.006_286.033)]",
				classes?.containerClassName,
			)}
		>
			<Video
				src={src}
				poster={poster}
				autoPlay={autoPlay}
				loop={loop}
				muted={muted}
				playsInline={playsInline}
				lazy={lazy}
				fill
				controls={false}
				{...props}
			/>
		</div>
	);
};

export default DesignVideoViewer;
