import { Bell, Divide } from "lucide-react";
import {
	AnimatePresence,
	motion,
	stagger,
	useMotionValue,
	useMotionValueEvent,
	useSpring,
	useTransform,
} from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const badgeVariants = {
	hidden: { opacity: 0, scale: 0, x: 0 },
	shown: {
		opacity: 1,
		scale: 1.05,
		x: 4,
		transition: {
			default: { duration: 0.3 },
			x: { duration: 0.3 },
			opacity: { duration: 0.3, ease: [0.2, 0, 0, 1] },
			scale: { duration: 0.15, ease: [0.2, 0, 0, 1] },
		},
	},
};

export const AnimationComponent = () => {
	const notificationCount = useSpring(1, {
		mass: 0.8,
		stiffness: 75,
		damping: 15,
	});
	const count = useTransform(notificationCount, (current) =>
		Math.round(current).toLocaleString(),
	);
	const [displayCount, setDisplayCount] = useState("1");

	// Use Motion's hook for listening to MotionValue changes (handles cleanup automatically)
	useMotionValueEvent(count, "change", (latest) => {
		setDisplayCount(latest);
	});

	return (
		<div className="flex flex-col items-center justify-between h-30">
			<div className="relative ring-2 ring-gray-200 shadow p-2 rounded-full size-16 flex items-center justify-center cursor-pointer">
				<motion.span
					initial={{ opacity: 0, scale: 0, x: 0 }}
					animate={{ opacity: 1, scale: [0, 1.05, 1], x: 4 }}
					transition={{
						default: { duration: 0.3 },
						x: { duration: 0.3 },
						opacity: { duration: 0.3, ease: [0.2, 0, 0, 1] },
						scale: {
							duration: 0.35, // total: 150ms + 200ms = 350ms
							times: [0, 0.43, 1], // 0.15/0.35 = 0.43 (scale to 1.05 at 43% of timeline)
							ease: [0.2, 0, 0, 1],
						},
					}}
					layout
					className="bg-red-500 rounded-full p-2 text-xs absolute -top-2 -right-2 size-8 flex items-center justify-center text-white overflow-hidden"
				>
					<AnimatePresence mode="popLayout">
						<motion.span
							key={displayCount}
							initial={{ y: -20, filter: "blur(1px)", opacity: 0 }}
							animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
							exit={{ y: 20, filter: "blur(1px)", opacity: 0 }}
							transition={{
								duration: 0.3,
								ease: [0.4, 0, 0.2, 1],
							}}
						>
							{displayCount}
						</motion.span>
					</AnimatePresence>
				</motion.span>
				<Bell className="size-8" />
			</div>

			<Button
				onClick={() => notificationCount.set(notificationCount.get() + 1)}
			>
				Update Notification Count
			</Button>
		</div>
	);
};
