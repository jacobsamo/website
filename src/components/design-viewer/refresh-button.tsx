import { RotateCw } from "lucide-react";
import { useState } from "react";

interface RefreshButtonProps {
	onRefresh: () => void;
}

export const RefreshButton = ({ onRefresh }: RefreshButtonProps) => {
	const [key, setKey] = useState(0);

	const handleClick = () => {
		setKey((prev) => prev + 1);
		onRefresh();
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="cursor-pointer active:scale-[0.97] relative flex items-center justify-center size-8 rounded-lg transition-all duration-300 hover:scale-110 bg-gray-100 text-gray-900 dark:bg-[oklch(0.274_0.006_286.033)] dark:text-[oklch(0.985_0_0)]"
			aria-label="Refresh animation"
		>
			<RotateCw
				key={key}
				size={20}
				className="animate-spin-once"
			/>
		</button>
	);
};
