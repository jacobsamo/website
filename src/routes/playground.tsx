import { createFileRoute } from "@tanstack/react-router";
import { Camera, Moon, Paintbrush, RotateCw, Sun } from "lucide-react";
import { useState } from "react";
import { DesignViewer } from "@/components/design-viewer";
import { Button } from "@/components/ui/button";
import { NotificationComponent } from "@/designs/notification-component.tsx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	const [mode, setMode] = useState<"design" | "capture">("design");
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [refreshKey, setRefreshKey] = useState(0);

	const handleToggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	const handleRefresh = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<main className="container mx-auto my-16">
			<div className="mb-8 flex justify-center gap-3">
				<Button
					onClick={() => setMode("design")}
					variant={mode === "design" ? "default" : "secondary"}
					size="lg"
					className={cn(
						"gap-2 px-6 transition-all duration-300 ease-out",
						mode === "design" && "scale-105 shadow-lg",
						mode !== "design" && "hover:scale-102",
					)}
				>
					<Paintbrush
						className={cn(
							"transition-transform duration-300",
							mode === "design" && "rotate-12",
						)}
					/>
					<span>Design Mode</span>
				</Button>
				<Button
					onClick={() => setMode("capture")}
					variant={mode === "capture" ? "default" : "secondary"}
					size="lg"
					className={cn(
						"gap-2 px-6 transition-all duration-300 ease-out",
						mode === "capture" && "scale-105 shadow-lg",
						mode !== "capture" && "hover:scale-102",
					)}
				>
					<Camera
						className={cn(
							"transition-transform duration-300",
							mode === "capture" && "scale-110",
						)}
					/>
					<span>Capture Mode</span>
				</Button>
			</div>

			<div className="mb-4 flex justify-center gap-2">
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
					<RotateCw key={refreshKey} size={20} className="animate-spin-once" />
				</Button>
			</div>

			<div className="mx-auto transition-all duration-500 ease-in-out">
				<DesignViewer
					theme={theme}
					onThemeChange={setTheme}
					refreshKey={refreshKey}
					onRefresh={handleRefresh}
					showControls={false}
					classes={{
						containerClassName: cn(
							"transition-all duration-500 ease-in-out",
							mode === "capture" && "w-[1200px] h-[630px] rounded-none",
						),
					}}
				>
					<NotificationComponent />
				</DesignViewer>
			</div>
		</main>
	);
}
