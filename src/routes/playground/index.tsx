import { CaptureLicense } from "@/designs/capture-license";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playground/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="size-full bg-white flex items-center justify-center">
			<CaptureLicense />
		</main>
	);
}
