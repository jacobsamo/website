import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CaptureLicense = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [activeMode, setActiveMode] = useState<"Front" | "Back">("Front"); // front or back of the card
	const [isFlipped, setIsFlipped] = useState(false);

	// content for the card itself
	const [frontImage, setFrontImage] = useState<File | null>(null);
	const [backImage, setBackImage] = useState<File | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const getCameraStream = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: "environment",
				},
			});

			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}
		} catch (error) {
			console.error("Error accessing camera stream:", error);
		}
	};

	const stopCameraStream = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
	};

	const captureImageFromStream = async () => {
		if (videoRef.current) {
			const canvas = document.createElement("canvas");
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const context = canvas.getContext("2d");
			if (context) {
				context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
				canvas.toBlob((blob) => {
					if (blob) {
						const file = new File([blob], `license-${activeMode}.png`, {
							type: "image/png",
						});
						if (activeMode === "Front") {
							setFrontImage(file);
							setIsProcessing(true);
							setTimeout(() => {
								setActiveMode("Back");
								setIsProcessing(false);
							}, 1000); // Simulate processing time before switching to back
						} else {
							setBackImage(file);
							setActiveMode("Front");
						}
					}
				}, "image/png");
			}
		}
	};

	useEffect(() => {
		getCameraStream();

		return () => {
			stopCameraStream();
		};
	}, [streamRef.current]);

	return (
		<motion.div className="text-black">
			Capture the{" "}
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={`toptext-${activeMode}`}
					transition={{ type: "spring", duration: 0.3, bounce: 0 }}
					initial={{ opacity: 0, x: -25 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 25 }}
					className="font-bold"
				>
					{activeMode}
				</motion.span>
			</AnimatePresence>{" "}
			side of the license card
			{/*When the state changes we will capture the stream and then flip the card over */}
			<motion.div
				id="license-view"
				className="relative  border-3 border-gray-400 rounded-lg w-[337.33px] h-[212.66px] z-10"
				// style={{ transformStyle: "preserve-3d" }}
				// animate={{ rotateY: isFlipped ? 180 : 0 }}
				// transition={{ duration: 0.6, ease: "easeOut" }}
			>
				{activeMode === "Front" && !frontImage && (
					<video
						ref={videoRef}
						id="license-video"
						className="size-full object-cover object-center z-0"
						autoPlay
						playsInline
					/>
				)}
				{frontImage && isProcessing && (
					<div className="size-full object-cover object-center z-0">
						<Loader2 className="animate-spin z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
						<img
							src={URL.createObjectURL(frontImage)}
							alt="Front License"
							className="z-0"
						/>
					</div>
				)}

				{activeMode === "Back" && !backImage && (
					<video
						ref={videoRef}
						id="license-video"
						className="size-full object-cover object-center z-0"
						autoPlay
						playsInline
					/>
				)}

				{backImage && isProcessing && (
					<img src={URL.createObjectURL(backImage)} alt="Back License" />
				)}
			</motion.div>
			<span>
				<Button
					variant="secondary"
					size="icon"
					onClick={() => {
						setActiveMode((prev) => (prev === "Front" ? "Back" : "Front"));
						setIsFlipped(false);
					}}
					disabled={activeMode === "Back"}
				>
					<ArrowLeft />
				</Button>
				<Button
					size="lg"
					onClick={() => {
						captureImageFromStream();
						setIsFlipped(true);
					}}
				>
					Capture {activeMode}
				</Button>
			</span>
		</motion.div>
	);
};
