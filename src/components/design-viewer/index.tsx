import { Moon, RotateCw, Sun } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Utility type for className strings to enable Tailwind CSS IntelliSense
 * VSCode's Tailwind CSS IntelliSense extension recognizes this pattern
 */
type ClassNameValue = string;

interface DesignViewerProps {
	children: React.ReactNode;
	/**
	 * Current theme - when provided, the component becomes controlled
	 * @default "light" (uncontrolled mode)
	 */
	theme?: "light" | "dark";
	/**
	 * Callback when theme changes. Use this to control theme from parent component.
	 * @param theme - The new theme value
	 * @example
	 * ```tsx
	 * const [theme, setTheme] = useState<"light" | "dark">("light");
	 * <DesignViewer theme={theme} onThemeChange={setTheme}>
	 * ```
	 */
	onThemeChange?: (theme: "light" | "dark") => void;
	/**
	 * Key used to force remount children (useful for resetting animations)
	 * When this value changes, children will unmount and remount
	 * When NOT provided, the component manages refresh state internally
	 * @example
	 * ```tsx
	 * const [refreshKey, setRefreshKey] = useState(0);
	 * <DesignViewer refreshKey={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)}>
	 * ```
	 */
	refreshKey?: number;
	/**
	 * Callback when refresh is triggered
	 * Called in both controlled and uncontrolled mode when refresh button is clicked
	 */
	onRefresh?: () => void;
	/**
	 * Whether to show the built-in theme and refresh controls
	 * @default true
	 */
	showControls?: boolean;
	/**
	 * Custom class names for different parts of the DesignViewer
	 * @example
	 * ```tsx
	 * <DesignViewer classes={{
	 *   containerClassName: "h-screen rounded-xl",
	 *   contentClassName: "grid grid-cols-2 gap-4"
	 * }}>
	 * ```
	 */
	classes?: {
		/** Class names for the main container */
		containerClassName?: ClassNameValue;
		/** Class names for the content wrapper */
		contentClassName?: ClassNameValue;
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

export const DesignViewer: React.FC<DesignViewerProps> = ({
	children,
	theme: controlledTheme,
	onThemeChange,
	refreshKey: controlledRefreshKey,
	onRefresh,
	showControls = true,
	classes,
}) => {
	// Internal state for uncontrolled mode
	const [internalTheme, setInternalTheme] = useState<"light" | "dark">("light");
	const [internalRefreshKey, setInternalRefreshKey] = useState(0);

	// Use controlled values if provided, otherwise use internal state
	const theme = controlledTheme ?? internalTheme;
	const refreshKey = controlledRefreshKey ?? internalRefreshKey;

	const handleToggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		if (onThemeChange) {
			onThemeChange(newTheme);
		} else {
			setInternalTheme(newTheme);
		}
	};

	const handleRefresh = () => {
		// Update internal state if not controlled
		if (controlledRefreshKey === undefined) {
			setInternalRefreshKey((prev) => prev + 1);
		}
		// Call callback if provided
		onRefresh?.();
	};

	return (
		<div
			id="design-viewer-container"
			className={cn(
				"group relative mt-4 mb-8 h-[25rem] w-full rounded-md border transition-colors duration-300 sm:h-[30rem] md:h-[40rem]",
				"border-gray-200 bg-white",
				"dark:border-[oklch(0.274_0.006_286.033)] dark:bg-[oklch(0.141_0.005_285.823)]",
				theme === "dark" && "dark",
				classes?.containerClassName,
			)}
			data-theme={theme}
		>
			{showControls && (
				<div className="absolute top-2 right-2 z-10 flex gap-2">
					<Button
						type="button"
						onClick={handleToggleTheme}
						variant="ghost"
						size="icon-sm"
						className="!bg-gray-100 !text-gray-900 dark:!bg-[oklch(0.274_0.006_286.033)] dark:!text-[oklch(0.985_0_0)] hover:!bg-gray-200/80 dark:hover:!bg-[oklch(0.32_0.008_286.033)] hover:scale-110"
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
					<Button
						type="button"
						onClick={handleRefresh}
						variant="ghost"
						size="icon-sm"
						className="!bg-gray-100 !text-gray-900 dark:!bg-[oklch(0.274_0.006_286.033)] dark:!text-[oklch(0.985_0_0)] hover:!bg-gray-200/80 dark:hover:!bg-[oklch(0.32_0.008_286.033)] hover:scale-110"
						aria-label="Refresh animation"
					>
						<RotateCw
							key={refreshKey}
							size={20}
							className="animate-spin-once"
						/>
					</Button>
				</div>
			)}
			<DesignViewerContext.Provider value={{ theme }}>
				<div
					// The dynamic key when changed will force this children to unmount and remount, useful for refreshing an animation state
					key={refreshKey}
					className={cn(
						"flex h-full w-full items-center justify-center overflow-y-auto transition-colors duration-300",
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
