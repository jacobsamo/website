import { AnimatePresence, motion, stagger } from "motion/react";

export const AnimationComponent = () => {
	return (
		<div className="flex flex-row gap-2">
			<motion.div
				className="size-32 rounded-md bg-amber-400"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.1 * 1 }}
			/>
			<motion.div
				className="size-32 rounded-md bg-amber-400"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.1 * 2 }}
			/>
			<motion.div
				className="size-32 rounded-md bg-amber-400"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.1 * 3 }}
			/>
			<motion.div
				className="size-32 rounded-md bg-amber-400"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.1 * 4 }}
			/>
		</div>
	);
};
