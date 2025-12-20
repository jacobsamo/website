import { Moon, Sun } from "lucide-react";
import { useDesignViewer } from "./index";

interface ToggleThemeButtonProps {
	onThemeChange: () => void;
}

export const ToggleThemeButton = ({
	onThemeChange,
}: ToggleThemeButtonProps) => {
	const { theme } = useDesignViewer();

	return (
		<button
			type="button"
			onClick={onThemeChange}
			className="cursor-pointer active:scale-[0.97] relative flex items-center justify-center size-8 rounded-lg transition-all duration-300 hover:scale-110 bg-gray-100 text-gray-900 dark:bg-[oklch(0.274_0.006_286.033)] dark:text-[oklch(0.985_0_0)]"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<div className="relative w-5 h-5">
				<Sun
					className="absolute inset-0 transition-all duration-300 opacity-100 rotate-0 scale-100 dark:opacity-0 dark:rotate-90 dark:scale-0"
					size={20}
				/>
				<Moon
					className="absolute inset-0 transition-all duration-300 opacity-0 -rotate-90 scale-0 dark:opacity-100 dark:rotate-0 dark:scale-100"
					size={20}
				/>
			</div>
		</button>
	);
};
