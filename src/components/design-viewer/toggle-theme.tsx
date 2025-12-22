import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDesignViewer } from "./index";

interface ToggleThemeButtonProps {
	onThemeChange: () => void;
}

export const ToggleThemeButton = ({
	onThemeChange,
}: ToggleThemeButtonProps) => {
	const { theme } = useDesignViewer();

	return (
		<Button
			type="button"
			onClick={onThemeChange}
			variant="ghost"
			size="icon-sm"
			className="hover:scale-110 !bg-gray-100 !text-gray-900 dark:!bg-[oklch(0.274_0.006_286.033)] dark:!text-[oklch(0.985_0_0)] hover:!bg-gray-200/80 dark:hover:!bg-[oklch(0.32_0.008_286.033)]"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<span className="relative inline-flex items-center justify-center w-5 h-5">
				<Sun
					className="absolute transition-all duration-300 opacity-100 rotate-0 scale-100 dark:opacity-0 dark:rotate-90 dark:scale-0"
					size={20}
				/>
				<Moon
					className="absolute transition-all duration-300 opacity-0 -rotate-90 scale-0 dark:opacity-100 dark:rotate-0 dark:scale-100"
					size={20}
				/>
			</span>
		</Button>
	);
};
