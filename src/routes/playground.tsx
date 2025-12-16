import { createFileRoute } from "@tanstack/react-router";
import { DesignViewer } from "@/components/design-viewer";
import { AnimationComponent } from "@/designs/01-design-viewer/component";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="my-32 container mx-auto">
			<DesignViewer>
				<AnimationComponent />
			</DesignViewer>
		</main>
	);
}
