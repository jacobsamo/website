import { Link, type NotFoundRouteProps } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { buttonVariants } from "../ui/button";

export default function NotFound({ routeId }: NotFoundRouteProps) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
			<h1>Route {routeId} was not found</h1>
			<Link to="/" className={buttonVariants()}>
				<Home /> Go Home
			</Link>
		</main>
	);
}
