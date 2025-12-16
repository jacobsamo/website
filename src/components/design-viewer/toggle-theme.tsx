import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleThemeButtonProps {
	theme: string;
	onThemeChange: () => void;
}

export const ToggleThemeButton = ({
	theme,
	onThemeChange,
}: ToggleThemeButtonProps) => {
	return (
		<button
			type="button"
			onClick={onThemeChange}
			className={cn(
				"cursor-pointer active:scale-[0.97] relative flex items-center justify-center size-8 rounded-lg transition-all duration-300 hover:scale-110",
				{
					"bg-[oklch(0.274_0.006_286.033)] text-[oklch(0.985_0_0)]":
						theme === "dark",
					"bg-gray-100 text-gray-900": theme === "light",
				},
			)}
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<div className="relative w-5 h-5">
				<Sun
					className={cn("absolute inset-0 transition-all duration-300", {
						"opacity-100 rotate-0 scale-100": theme === "light",
						"opacity-0 rotate-90 scale-0": theme === "dark",
					})}
					size={20}
				/>
				<Moon
					className={cn("absolute inset-0 transition-all duration-300", {
						"opacity-100 rotate-0 scale-100": theme === "dark",
						"opacity-0 -rotate-90 scale-0": theme === "light",
					})}
					size={20}
				/>
			</div>
		</button>
	);
};
