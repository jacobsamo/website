import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshButton } from "./refresh-button";
import { ToggleThemeButton } from "./toggle-theme";

interface DesignViewerProps {
	children: React.ReactNode;
	showThemeSwitcher?: boolean;
	showRefreshButton?: boolean;
	classes?: {
		buttonContainerClassName?: string;
		contentClassName?: string;
		containerClassName?: string;
	};
}

interface DesignViewerContextValue {
	theme: "light" | "dark";
}

const DesignViewerContext = React.createContext<
	DesignViewerContextValue | undefined
>(undefined);

export const useDesignViewer = () => {
	const context = React.useContext(DesignViewerContext);
	if (!context) {
		throw new Error("useDesignViewer must be used within a DesignViewer");
	}
	return context;
};

export const DesignViewer = ({
	children,
	showThemeSwitcher = true,
	showRefreshButton = true,
	classes,
}: DesignViewerProps) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div
			className={cn(
				"group relative w-full h-[25rem] sm:h-[30rem] md:h-[40rem] rounded-md border transition-colors duration-300 mb-8 mt-4",
				"bg-white border-gray-200",
				"dark:bg-[oklch(0.141_0.005_285.823)] dark:border-[oklch(0.274_0.006_286.033)]",
				theme === "dark" && "dark",
				classes?.containerClassName,
			)}
			data-theme={theme}
		>
			<DesignViewerContext.Provider value={{ theme }}>
				<div
					className={cn(
						"absolute right-2 top-2 flex gap-2",
						classes?.buttonContainerClassName,
					)}
				>
					{showThemeSwitcher && (
						<ToggleThemeButton
							onThemeChange={() =>
								setTheme((prev) => (prev === "light" ? "dark" : "light"))
							}
						/>
					)}
					{showRefreshButton && (
						<RefreshButton
							onRefresh={() => setRefreshKey((prev) => prev + 1)}
						/>
					)}
				</div>
				<div
					// The dynamic key when changed will force this children to unmount and remount, useful for refreshing an animation state
					key={refreshKey}
					className={cn(
						"flex items-center justify-center w-full h-full transition-colors duration-300 overflow-y-auto",
						"text-gray-900 dark:text-[oklch(0.985_0_0)]",
						classes?.contentClassName,
					)}
				>
					{children}
				</div>
			</DesignViewerContext.Provider>
		</div>
	);
};
