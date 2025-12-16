import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
	theme: string;
	onRefresh: () => void;
}

export const RefreshButton = ({ theme, onRefresh }: RefreshButtonProps) => {
	return (
		<button
			type="button"
			onClick={onRefresh}
			className={cn(
				"cursor-pointer active:scale-[0.97] relative flex items-center justify-center size-8 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90",
				{
					"bg-[oklch(0.274_0.006_286.033)] text-[oklch(0.985_0_0)]":
						theme === "dark",
					"bg-gray-100 text-gray-900": theme === "light",
				},
			)}
			aria-label="Refresh animation"
		>
			<RotateCw size={20} className="transition-transform duration-300" />
		</button>
	);
};
