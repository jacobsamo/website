import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToggleThemeButtonProps {
	theme: "light" | "dark";
	onThemeChange: () => void;
}

export function ToggleThemeButton({
	theme,
	onThemeChange,
}: ToggleThemeButtonProps) {
	return (
		<Button
			type="button"
			onClick={onThemeChange}
			variant="ghost"
			size="icon-sm"
			className="!bg-gray-100 !text-gray-900 hover:!bg-gray-200/80 hover:scale-110 dark:!bg-[oklch(0.274_0.006_286.033)] dark:!text-[oklch(0.985_0_0)] dark:hover:!bg-[oklch(0.32_0.008_286.033)]"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<span className="relative inline-flex h-5 w-5 items-center justify-center">
				<Sun
					className={cn(
						"absolute transition-all duration-300",
						theme === "light"
							? "rotate-0 scale-100 opacity-100"
							: "rotate-90 scale-0 opacity-0",
					)}
					size={20}
				/>
				<Moon
					className={cn(
						"absolute transition-all duration-300",
						theme === "dark"
							? "rotate-0 scale-100 opacity-100"
							: "-rotate-90 scale-0 opacity-0",
					)}
					size={20}
				/>
			</span>
		</Button>
	);
}
