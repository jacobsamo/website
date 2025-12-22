import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DesignViewer } from "@/components/design-viewer";
import { NotificationComponent } from "@/designs/notification-component.tsx";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	const [mode, setMode] = useState<"design" | "capture">("design");
	return (
		<main className="my-32 container mx-auto">
			{/* Add a button to toggle between design and capture mode */}
			<button onClick={() => setMode(mode === "design" ? "capture" : "design")}>
				{mode === "design" ? "Capture" : "Design"}
			</button>
			<DesignViewer
				showRefreshButton={mode === "design"}
				showThemeSwitcher={mode === "design"}
				classes={{
					containerClassName:
						mode === "capture" ? "w-[1200px] h-[630px] rounded-none" : "",
				}}
			>
				<NotificationComponent />
			</DesignViewer>
		</main>
	);
}
