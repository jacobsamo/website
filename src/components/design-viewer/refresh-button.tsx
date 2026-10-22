import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
	refreshKey: number;
	onRefresh: () => void;
}

export function RefreshButton({ refreshKey, onRefresh }: RefreshButtonProps) {
	return (
		<Button
			type="button"
			onClick={onRefresh}
			variant="ghost"
			size="icon-sm"
			className="!bg-gray-100 !text-gray-900 hover:!bg-gray-200/80 hover:scale-110 dark:!bg-[oklch(0.274_0.006_286.033)] dark:!text-[oklch(0.985_0_0)] dark:hover:!bg-[oklch(0.32_0.008_286.033)]"
			aria-label="Refresh animation"
		>
			<RotateCw key={refreshKey} size={20} className="animate-spin-once" />
		</Button>
	);
}
