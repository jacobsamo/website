import { Bell, Equal, Play, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const badgeVariants = {
	firstLoad: { opacity: 0, scale: 0, x: 0 },
	animatFirstLoad: {
		opacity: 1,
		scale: [0, 1.05, 1],
		x: 4,
		transition: {
			default: { duration: 0.3 },
			x: { duration: 0.3 },
			opacity: { duration: 0.3, ease: [0.2, 0, 0, 1] },
			scale: {
				duration: 0.35, // total: 150ms + 200ms = 350ms
				times: [0, 0.43, 1], // 0.15/0.35 = 0.43 (scale to 1.05 at 43% of timeline)
				ease: [0.2, 0, 0, 1],
			},
		},
	},
	animateCountChange: {},
	initialCountChange: {},
	exitCountChange: {},
};

export const NotificationComponent = () => {
	const [notificationCount, setNotificationCount] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setNotificationCount(1);
		}, 500);

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		if (isPaused) return;

		const timeout = setTimeout(() => {
			setNotificationCount((prevCount) => prevCount + 1);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [isPaused]);

	return (
		<div className="flex h-30 flex-col items-center justify-between">
			<div className="relative flex size-16 cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow ring-2 ring-gray-200 dark:bg-secondary/80 dark:ring-secondary">
				<AnimatePresence mode="popLayout">
					{notificationCount !== 0 && (
						<motion.span
							variants={badgeVariants}
							initial="firstLoad"
							animate="animatFirstLoad"
							layout
							className="-top-2 -right-2 absolute flex size-8 items-center justify-center overflow-hidden rounded-full bg-red-500 p-2 text-white text-xs dark:bg-red-400"
						>
							<motion.span
								key={notificationCount}
								initial={{ filter: "blur(1px)", opacity: 0, scale: 0 }}
								animate={{
									filter: "blur(0px)",
									opacity: 1,
									scale: 1,
									transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
								}}
								exit={{ filter: "blur(1px)", opacity: 0, scale: 0 }}
							>
								{notificationCount <= 99 ? notificationCount : "99+"}
							</motion.span>
						</motion.span>
					)}
				</AnimatePresence>
				<Bell className="size-8" />
			</div>

			<div id="state-actions" className="flex gap-2">
				<Button
					variant="default"
					size="icon"
					onClick={() => setIsPaused(!isPaused)}
					className="relative overflow-hidden"
				>
					<motion.span
						key={`isPaused-${isPaused}`}
						initial={{ filter: "blur(1px)", opacity: 0, scale: 0 }}
						animate={{
							filter: "blur(0px)",
							opacity: 1,
							scale: 1,
							transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
						}}
						exit={{ filter: "blur(1px)", opacity: 0, scale: 0 }}
					>
						{isPaused ? (
							<Play className="size-4" />
						) : (
							<Equal className="size-4 rotate-90" />
						)}
					</motion.span>
				</Button>
				<Button onClick={() => setNotificationCount(notificationCount + 1)}>
					<Plus className="size-4" />
					Increment Count
				</Button>
			</div>
		</div>
	);
};
