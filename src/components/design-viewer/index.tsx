import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshButton } from "./refresh-button";
import { ToggleThemeButton } from "./toggle-theme";

interface DesignViewerProps {
	children: React.ReactNode;
	showThemeSwitcher?: boolean;
	showRefreshButton?: boolean;
}

interface ThemeContextValue {
	theme: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
	undefined,
);

export const useTheme = () => {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a DesignViewer");
	}
	return context;
};

export const DesignViewer = ({
	children,
	showThemeSwitcher = true,
	showRefreshButton = true,
}: DesignViewerProps) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div
			className={cn(
				"relative w-full h-[40rem] rounded-md border transition-colors duration-300 mb-8 mt-4",
				{
					"bg-[oklch(0.141_0.005_285.823)] border-[oklch(0.274_0.006_286.033)]":
						theme === "dark",
					"bg-white border-gray-200": theme === "light",
				},
			)}
		>
			<div className="absolute right-2 top-2 flex gap-2">
				{showThemeSwitcher && (
					<ToggleThemeButton
						theme={theme}
						onThemeChange={() =>
							setTheme((prev) => (prev === "light" ? "dark" : "light"))
						}
					/>
				)}
				{showRefreshButton && (
					<RefreshButton
						theme={theme}
						onRefresh={() => setRefreshKey((prev) => prev + 1)}
					/>
				)}
			</div>
			<ThemeContext.Provider value={{ theme }}>
				<div
					// The dynamic key when changed will force this children to unmount and remount, useful for refreshing an animation state
					key={refreshKey}
					className={cn(
						"flex items-center justify-center w-full h-full transition-colors duration-300 overflow-y-auto",
						{
							"text-[oklch(0.985_0_0)]": theme === "dark",
							"text-gray-900": theme === "light",
						},
					)}
				>
					{children}
				</div>
			</ThemeContext.Provider>
		</div>
	);
};
