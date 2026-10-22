import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RefreshButton } from "./refresh-button";
import { ToggleThemeButton } from "./toggle-theme";

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
					<ToggleThemeButton theme={theme} onThemeChange={handleToggleTheme} />
					<RefreshButton refreshKey={refreshKey} onRefresh={handleRefresh} />
				</div>
			)}
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
		</div>
	);
};
