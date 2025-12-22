import { RotateCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
		<Button
			type="button"
			onClick={handleClick}
			variant="ghost"
			size="icon-sm"
			className="hover:scale-110 !bg-gray-100 !text-gray-900 dark:!bg-[oklch(0.274_0.006_286.033)] dark:!text-[oklch(0.985_0_0)] hover:!bg-gray-200/80 dark:hover:!bg-[oklch(0.32_0.008_286.033)]"
			aria-label="Refresh animation"
		>
			<RotateCw
				key={key}
				size={20}
				className="animate-spin-once"
			/>
		</Button>
	);
};
