"use client";

import {
	Loader2,
	Maximize,
	Minimize,
	Pause,
	Play,
	Volume2,
	VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

// ============================================================================
// Types
// ============================================================================

export interface VideoProps {
	/** Video source URL - can be relative, absolute, or YouTube URL */
	src: string;
	/** Poster/thumbnail image to show before video loads */
	poster?: string;
	/** Alt text for accessibility */
	alt?: string;
	/** Whether to autoplay the video */
	autoPlay?: boolean;
	/** Whether to loop the video */
	loop?: boolean;
	/** Whether to start muted */
	muted?: boolean;
	/** Whether to show controls */
	controls?: boolean;
	/** Playback speed (0.25 to 2) */
	playbackRate?: number;
	/** Whether to lazy load the video */
	lazy?: boolean;
	/** Custom className for the container */
	className?: string;
	/** Custom className for the video element */
	videoClassName?: string;
	/** Callback when video starts playing */
	onPlay?: () => void;
	/** Callback when video pauses */
	onPause?: () => void;
	/** Callback when video ends */
	onEnded?: () => void;
	/** Callback when video time updates */
	onTimeUpdate?: (currentTime: number, duration: number) => void;
	/** Whether to play inline on mobile */
	playsInline?: boolean;
	/** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
	aspectRatio?: string;
	/** Fill mode - fills container without controls overlay (for design viewer) */
	fill?: boolean;
}

export interface VideoRef {
	play: () => void;
	pause: () => void;
	toggle: () => void;
	seek: (time: number) => void;
	setPlaybackRate: (rate: number) => void;
	getCurrentTime: () => number;
	getDuration: () => number;
	getVideoElement: () => HTMLVideoElement | null;
}

// ============================================================================
// YouTube Utilities
// ============================================================================

/**
 * Detect if URL is a YouTube video and extract video ID
 */
function parseYouTubeUrl(url: string): { isYouTube: boolean; videoId?: string } {
	if (!url) return { isYouTube: false };

	// Match various YouTube URL formats
	const patterns = [
		// youtube.com/watch?v=VIDEO_ID
		/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&\s]+)/,
		// youtu.be/VIDEO_ID
		/youtu\.be\/([^?\s]+)/,
		// youtube.com/embed/VIDEO_ID
		/youtube\.com\/embed\/([^?\s]+)/,
		// youtube.com/v/VIDEO_ID
		/youtube\.com\/v\/([^?\s]+)/,
		// youtube.com/shorts/VIDEO_ID
		/youtube\.com\/shorts\/([^?\s]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match?.[1]) {
			return { isYouTube: true, videoId: match[1] };
		}
	}

	return { isYouTube: false };
}

// ============================================================================
// Time Formatting
// ============================================================================

function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================================
// YouTube Embed Component
// ============================================================================

interface YouTubeEmbedProps {
	videoId: string;
	autoPlay?: boolean;
	muted?: boolean;
	loop?: boolean;
	className?: string;
	aspectRatio?: string;
	fill?: boolean;
}

function YouTubeEmbed({
	videoId,
	autoPlay = false,
	muted = false,
	loop = false,
	className,
	aspectRatio = "16/9",
	fill = false,
}: YouTubeEmbedProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [showPlayer, setShowPlayer] = useState(autoPlay);

	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

	const embedParams = new URLSearchParams({
		autoplay: "1",
		mute: muted ? "1" : "0",
		loop: loop ? "1" : "0",
		playlist: loop ? videoId : "",
		rel: "0",
		modestbranding: "1",
	});

	const handleClick = () => {
		setShowPlayer(true);
	};

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg bg-black",
				fill ? "h-full w-full" : "",
				className,
			)}
			style={!fill ? { aspectRatio } : undefined}
		>
			{showPlayer ? (
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${videoId}?${embedParams.toString()}`}
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					className="absolute inset-0 h-full w-full"
					onLoad={() => setIsLoaded(true)}
				/>
			) : (
				<button
					type="button"
					onClick={handleClick}
					className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center"
					aria-label="Play YouTube video"
				>
					<img
						src={thumbnailUrl}
						alt="Video thumbnail"
						className="absolute inset-0 h-full w-full object-cover"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
					<motion.div
						className="relative z-10 flex size-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg md:size-20"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
					>
						<Play className="size-6 fill-current md:size-8" />
					</motion.div>
				</button>
			)}

			{/* Loading indicator for iframe */}
			{showPlayer && !isLoaded && (
				<div className="absolute inset-0 flex items-center justify-center bg-black">
					<Loader2 className="size-8 animate-spin text-white" />
				</div>
			)}
		</div>
	);
}

// ============================================================================
// Custom Video Player Component
// ============================================================================

interface CustomVideoPlayerProps extends Omit<VideoProps, "src"> {
	src: string;
}

const CustomVideoPlayer = forwardRef<VideoRef, CustomVideoPlayerProps>(
	(
		{
			src,
			poster,
			alt,
			autoPlay = false,
			loop = false,
			muted = false,
			controls = true,
			playbackRate = 1,
			lazy = true,
			className,
			videoClassName,
			onPlay,
			onPause,
			onEnded,
			onTimeUpdate,
			playsInline = true,
			aspectRatio = "16/9",
			fill = false,
		},
		ref,
	) => {
		const videoRef = useRef<HTMLVideoElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);
		const progressRef = useRef<HTMLDivElement>(null);

		const [isPlaying, setIsPlaying] = useState(false);
		const [isLoaded, setIsLoaded] = useState(false);
		const [isBuffering, setIsBuffering] = useState(false);
		const [showControls, setShowControls] = useState(true);
		const [currentTime, setCurrentTime] = useState(0);
		const [duration, setDuration] = useState(0);
		const [buffered, setBuffered] = useState(0);
		const [volume, setVolume] = useState(muted ? 0 : 1);
		const [isMuted, setIsMuted] = useState(muted);
		const [isFullscreen, setIsFullscreen] = useState(false);
		const [speed, setSpeed] = useState(playbackRate);
		const [showSpeedMenu, setShowSpeedMenu] = useState(false);
		const [hasStarted, setHasStarted] = useState(autoPlay);

		const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
			null,
		);

		// Expose methods via ref
		useImperativeHandle(ref, () => ({
			play: () => videoRef.current?.play(),
			pause: () => videoRef.current?.pause(),
			toggle: () => {
				if (videoRef.current?.paused) {
					videoRef.current.play();
				} else {
					videoRef.current?.pause();
				}
			},
			seek: (time: number) => {
				if (videoRef.current) {
					videoRef.current.currentTime = time;
				}
			},
			setPlaybackRate: (rate: number) => {
				if (videoRef.current) {
					videoRef.current.playbackRate = rate;
					setSpeed(rate);
				}
			},
			getCurrentTime: () => videoRef.current?.currentTime ?? 0,
			getDuration: () => videoRef.current?.duration ?? 0,
			getVideoElement: () => videoRef.current,
		}));

		// Hide controls after inactivity
		const resetControlsTimeout = useCallback(() => {
			if (controlsTimeoutRef.current) {
				clearTimeout(controlsTimeoutRef.current);
			}
			setShowControls(true);

			if (isPlaying && !fill) {
				controlsTimeoutRef.current = setTimeout(() => {
					setShowControls(false);
				}, 3000);
			}
		}, [isPlaying, fill]);

		// Handle play/pause toggle
		const togglePlay = useCallback(() => {
			if (!hasStarted) {
				setHasStarted(true);
			}
			if (videoRef.current?.paused) {
				videoRef.current.play();
			} else {
				videoRef.current?.pause();
			}
		}, [hasStarted]);

		// Handle mute toggle
		const toggleMute = useCallback(() => {
			if (videoRef.current) {
				videoRef.current.muted = !videoRef.current.muted;
				setIsMuted(!isMuted);
				if (!isMuted) {
					setVolume(0);
				} else {
					setVolume(1);
					videoRef.current.volume = 1;
				}
			}
		}, [isMuted]);

		// Handle volume change
		const handleVolumeChange = useCallback((value: number[]) => {
			const newVolume = value[0] / 100;
			if (videoRef.current) {
				videoRef.current.volume = newVolume;
				videoRef.current.muted = newVolume === 0;
				setVolume(newVolume);
				setIsMuted(newVolume === 0);
			}
		}, []);

		// Handle seek
		const handleSeek = useCallback((value: number[]) => {
			const newTime = (value[0] / 100) * (videoRef.current?.duration ?? 0);
			if (videoRef.current) {
				videoRef.current.currentTime = newTime;
				setCurrentTime(newTime);
			}
		}, []);

		// Handle progress bar click
		const handleProgressClick = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!progressRef.current || !videoRef.current) return;

				const rect = progressRef.current.getBoundingClientRect();
				const percent = (e.clientX - rect.left) / rect.width;
				const newTime = percent * videoRef.current.duration;
				videoRef.current.currentTime = newTime;
				setCurrentTime(newTime);
			},
			[],
		);

		// Handle fullscreen toggle
		const toggleFullscreen = useCallback(() => {
			if (!containerRef.current) return;

			if (!document.fullscreenElement) {
				containerRef.current.requestFullscreen();
				setIsFullscreen(true);
			} else {
				document.exitFullscreen();
				setIsFullscreen(false);
			}
		}, []);

		// Handle speed change
		const handleSpeedChange = useCallback((newSpeed: number) => {
			if (videoRef.current) {
				videoRef.current.playbackRate = newSpeed;
				setSpeed(newSpeed);
			}
			setShowSpeedMenu(false);
		}, []);

		// Video event handlers
		useEffect(() => {
			const video = videoRef.current;
			if (!video) return;

			const handlePlay = () => {
				setIsPlaying(true);
				onPlay?.();
			};

			const handlePause = () => {
				setIsPlaying(false);
				onPause?.();
			};

			const handleTimeUpdate = () => {
				setCurrentTime(video.currentTime);
				onTimeUpdate?.(video.currentTime, video.duration);
			};

			const handleDurationChange = () => {
				setDuration(video.duration);
			};

			const handleLoadedData = () => {
				setIsLoaded(true);
				setDuration(video.duration);
			};

			const handleWaiting = () => {
				setIsBuffering(true);
			};

			const handleCanPlay = () => {
				setIsBuffering(false);
			};

			const handleProgress = () => {
				if (video.buffered.length > 0) {
					const bufferedEnd = video.buffered.end(video.buffered.length - 1);
					setBuffered((bufferedEnd / video.duration) * 100);
				}
			};

			const handleEnded = () => {
				setIsPlaying(false);
				onEnded?.();
			};

			video.addEventListener("play", handlePlay);
			video.addEventListener("pause", handlePause);
			video.addEventListener("timeupdate", handleTimeUpdate);
			video.addEventListener("durationchange", handleDurationChange);
			video.addEventListener("loadeddata", handleLoadedData);
			video.addEventListener("waiting", handleWaiting);
			video.addEventListener("canplay", handleCanPlay);
			video.addEventListener("progress", handleProgress);
			video.addEventListener("ended", handleEnded);

			return () => {
				video.removeEventListener("play", handlePlay);
				video.removeEventListener("pause", handlePause);
				video.removeEventListener("timeupdate", handleTimeUpdate);
				video.removeEventListener("durationchange", handleDurationChange);
				video.removeEventListener("loadeddata", handleLoadedData);
				video.removeEventListener("waiting", handleWaiting);
				video.removeEventListener("canplay", handleCanPlay);
				video.removeEventListener("progress", handleProgress);
				video.removeEventListener("ended", handleEnded);
			};
		}, [onPlay, onPause, onEnded, onTimeUpdate]);

		// Set initial playback rate
		useEffect(() => {
			if (videoRef.current) {
				videoRef.current.playbackRate = playbackRate;
			}
		}, [playbackRate]);

		// Handle keyboard controls
		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (!containerRef.current?.contains(document.activeElement)) return;

				switch (e.key) {
					case " ":
					case "k":
						e.preventDefault();
						togglePlay();
						break;
					case "ArrowLeft":
						e.preventDefault();
						if (videoRef.current) {
							videoRef.current.currentTime = Math.max(
								0,
								videoRef.current.currentTime - 5,
							);
						}
						break;
					case "ArrowRight":
						e.preventDefault();
						if (videoRef.current) {
							videoRef.current.currentTime = Math.min(
								videoRef.current.duration,
								videoRef.current.currentTime + 5,
							);
						}
						break;
					case "ArrowUp":
						e.preventDefault();
						if (videoRef.current) {
							videoRef.current.volume = Math.min(
								1,
								videoRef.current.volume + 0.1,
							);
							setVolume(videoRef.current.volume);
						}
						break;
					case "ArrowDown":
						e.preventDefault();
						if (videoRef.current) {
							videoRef.current.volume = Math.max(
								0,
								videoRef.current.volume - 0.1,
							);
							setVolume(videoRef.current.volume);
						}
						break;
					case "m":
						e.preventDefault();
						toggleMute();
						break;
					case "f":
						e.preventDefault();
						toggleFullscreen();
						break;
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [togglePlay, toggleMute, toggleFullscreen]);

		// Fullscreen change listener
		useEffect(() => {
			const handleFullscreenChange = () => {
				setIsFullscreen(!!document.fullscreenElement);
			};

			document.addEventListener("fullscreenchange", handleFullscreenChange);
			return () =>
				document.removeEventListener("fullscreenchange", handleFullscreenChange);
		}, []);

		const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

		const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

		// Fill mode - simplified view for design viewer
		if (fill) {
			return (
				<div
					ref={containerRef}
					className={cn(
						"group relative h-full w-full overflow-hidden bg-black",
						className,
					)}
					onMouseMove={resetControlsTimeout}
					onMouseLeave={() => isPlaying && setShowControls(false)}
				>
					<video
						ref={videoRef}
						src={src}
						poster={poster}
						autoPlay={autoPlay}
						loop={loop}
						muted={muted}
						playsInline={playsInline}
						preload={lazy ? "metadata" : "auto"}
						className={cn("h-full w-full object-cover", videoClassName)}
						aria-label={alt}
					/>

					{/* Buffering indicator */}
					<AnimatePresence>
						{isBuffering && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 flex items-center justify-center bg-black/30"
							>
								<Loader2 className="size-12 animate-spin text-white" />
							</motion.div>
						)}
					</AnimatePresence>

					{/* Play/Pause overlay - only show when paused */}
					<AnimatePresence>
						{!isPlaying && hasStarted && (
							<motion.button
								type="button"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.2 }}
								onClick={togglePlay}
								className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30"
								aria-label="Play video"
							>
								<motion.div
									className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
								>
									<Play className="size-8 fill-white text-white" />
								</motion.div>
							</motion.button>
						)}
					</AnimatePresence>

					{/* Initial play button */}
					{!hasStarted && (
						<button
							type="button"
							onClick={togglePlay}
							className="absolute inset-0 flex cursor-pointer items-center justify-center"
							aria-label="Play video"
						>
							{poster && (
								<img
									src={poster}
									alt="Video thumbnail"
									className="absolute inset-0 h-full w-full object-cover"
								/>
							)}
							<div className="absolute inset-0 bg-black/20" />
							<motion.div
								className="relative z-10 flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm md:size-20"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<Play className="size-6 fill-white text-white md:size-8" />
							</motion.div>
						</button>
					)}
				</div>
			);
		}

		return (
			<div
				ref={containerRef}
				className={cn(
					"group relative overflow-hidden rounded-lg bg-black",
					className,
				)}
				style={{ aspectRatio }}
				onMouseMove={resetControlsTimeout}
				onMouseLeave={() => isPlaying && setShowControls(false)}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: Video container needs focus for keyboard controls
				tabIndex={0}
			>
				<video
					ref={videoRef}
					src={src}
					poster={poster}
					autoPlay={autoPlay}
					loop={loop}
					muted={muted}
					playsInline={playsInline}
					preload={lazy ? "metadata" : "auto"}
					className={cn(
						"absolute inset-0 h-full w-full cursor-pointer object-contain",
						videoClassName,
					)}
					onClick={togglePlay}
					aria-label={alt}
				/>

				{/* Buffering indicator */}
				<AnimatePresence>
					{isBuffering && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="pointer-events-none absolute inset-0 flex items-center justify-center"
						>
							<Loader2 className="size-12 animate-spin text-white drop-shadow-lg" />
						</motion.div>
					)}
				</AnimatePresence>

				{/* Play/Pause center animation */}
				<AnimatePresence>
					{!isPlaying && hasStarted && !isBuffering && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.15 }}
							className="pointer-events-none absolute inset-0 flex items-center justify-center"
						>
							<div className="flex size-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm md:size-20">
								<Play className="size-6 fill-white text-white md:size-8" />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Initial play button with poster */}
				{!hasStarted && (
					<button
						type="button"
						onClick={togglePlay}
						className="absolute inset-0 flex cursor-pointer items-center justify-center"
						aria-label="Play video"
					>
						{poster && (
							<img
								src={poster}
								alt="Video thumbnail"
								className="absolute inset-0 h-full w-full object-cover"
							/>
						)}
						<div className="absolute inset-0 bg-black/20 transition-colors hover:bg-black/40" />
						<motion.div
							className="relative z-10 flex size-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm md:size-20"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<Play className="size-6 fill-white text-white md:size-8" />
						</motion.div>
					</button>
				)}

				{/* Controls overlay */}
				{controls && hasStarted && (
					<AnimatePresence>
						{showControls && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pt-16 pb-4"
							>
								{/* Progress bar */}
								<div
									ref={progressRef}
									className="group/progress relative mb-3 h-1 w-full cursor-pointer rounded-full bg-white/30"
									onClick={handleProgressClick}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
										}
									}}
									// biome-ignore lint/a11y/useSemanticElements: Custom progress bar with click interaction
									role="slider"
									aria-label="Video progress"
									aria-valuemin={0}
									aria-valuemax={100}
									aria-valuenow={progressPercent}
									tabIndex={0}
								>
									{/* Buffered progress */}
									<div
										className="absolute inset-y-0 left-0 rounded-full bg-white/30"
										style={{ width: `${buffered}%` }}
									/>
									{/* Played progress */}
									<div
										className="absolute inset-y-0 left-0 rounded-full bg-white transition-all group-hover/progress:h-1.5 group-hover/progress:-translate-y-0.5"
										style={{ width: `${progressPercent}%` }}
									/>
									{/* Thumb */}
									<div
										className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover/progress:opacity-100"
										style={{ left: `calc(${progressPercent}% - 6px)` }}
									/>
								</div>

								{/* Controls row */}
								<div className="flex items-center gap-4">
									{/* Play/Pause */}
									<button
										type="button"
										onClick={togglePlay}
										className="text-white transition-transform hover:scale-110"
										aria-label={isPlaying ? "Pause" : "Play"}
									>
										{isPlaying ? (
											<Pause className="size-5 fill-current" />
										) : (
											<Play className="size-5 fill-current" />
										)}
									</button>

									{/* Volume */}
									<div className="group/volume flex items-center gap-2">
										<button
											type="button"
											onClick={toggleMute}
											className="text-white transition-transform hover:scale-110"
											aria-label={isMuted ? "Unmute" : "Mute"}
										>
											{isMuted || volume === 0 ? (
												<VolumeX className="size-5" />
											) : (
												<Volume2 className="size-5" />
											)}
										</button>
										<div className="w-0 overflow-hidden transition-all group-hover/volume:w-20">
											<Slider
												value={[volume * 100]}
												onValueChange={handleVolumeChange}
												max={100}
												step={1}
												className="w-20"
												aria-label="Volume"
											/>
										</div>
									</div>

									{/* Time */}
									<span className="font-mono text-sm text-white tabular-nums">
										{formatTime(currentTime)} / {formatTime(duration)}
									</span>

									{/* Spacer */}
									<div className="flex-1" />

									{/* Speed */}
									<div className="relative">
										<button
											type="button"
											onClick={() => setShowSpeedMenu(!showSpeedMenu)}
											className="rounded px-2 py-1 font-mono text-sm text-white transition-colors hover:bg-white/20"
											aria-label="Playback speed"
										>
											{speed}x
										</button>
										<AnimatePresence>
											{showSpeedMenu && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													className="absolute bottom-full right-0 mb-2 rounded-lg bg-black/90 py-2 backdrop-blur-sm"
												>
													{speedOptions.map((option) => (
														<button
															key={option}
															type="button"
															onClick={() => handleSpeedChange(option)}
															className={cn(
																"block w-full px-4 py-1.5 text-left font-mono text-sm transition-colors hover:bg-white/20",
																speed === option
																	? "text-white"
																	: "text-white/70",
															)}
														>
															{option}x
														</button>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</div>

									{/* Fullscreen */}
									<button
										type="button"
										onClick={toggleFullscreen}
										className="text-white transition-transform hover:scale-110"
										aria-label={
											isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
										}
									>
										{isFullscreen ? (
											<Minimize className="size-5" />
										) : (
											<Maximize className="size-5" />
										)}
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>
		);
	},
);

CustomVideoPlayer.displayName = "CustomVideoPlayer";

// ============================================================================
// Main Video Component
// ============================================================================

export const Video = forwardRef<VideoRef, VideoProps>((props, ref) => {
	const { src, aspectRatio = "16/9", fill = false, ...rest } = props;

	// Check if it's a YouTube video
	const { isYouTube, videoId } = parseYouTubeUrl(src);

	if (isYouTube && videoId) {
		return (
			<YouTubeEmbed
				videoId={videoId}
				autoPlay={rest.autoPlay}
				muted={rest.muted}
				loop={rest.loop}
				className={rest.className}
				aspectRatio={aspectRatio}
				fill={fill}
			/>
		);
	}

	return (
		<CustomVideoPlayer
			ref={ref}
			src={src}
			aspectRatio={aspectRatio}
			fill={fill}
			{...rest}
		/>
	);
});

Video.displayName = "Video";

export default Video;
