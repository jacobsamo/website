import { useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshButton } from "./refresh-button";
import { ToggleThemeButton } from "./toggle-theme";

interface DesignViewerProps {
	children: React.ReactNode;
}

export const DesignViewer = ({ children }: DesignViewerProps) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div
			className={cn(
				"relative flex items-center justify-center w-full h-[40rem] rounded-md border transition-colors duration-300 mb-8 mt-4",
				{
					"bg-[oklch(0.141_0.005_285.823)] border-[oklch(0.274_0.006_286.033)]":
						theme === "dark",
					"bg-white border-gray-200": theme === "light",
				},
			)}
			data-theme={theme}
		>
			<div className="absolute right-2 top-2 flex gap-2">
				<ToggleThemeButton
					theme={theme}
					onThemeChange={() =>
						setTheme((prev) => (prev === "light" ? "dark" : "light"))
					}
				/>
				<RefreshButton
					theme={theme}
					onRefresh={() => setRefreshKey((prev) => prev + 1)}
				/>
			</div>
			<div
				key={refreshKey}
				className={cn("transition-colors duration-300", {
					"text-[oklch(0.985_0_0)]": theme === "dark",
					"text-gray-900": theme === "light",
				})}
			>
				{children}
			</div>
		</div>
	);
};
