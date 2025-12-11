import { Link, type NotFoundRouteProps } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { buttonVariants } from "../ui/button";

export default function NotFound({ routeId }: NotFoundRouteProps) {
	return (
		<main className="min-h-screen text-center flex items-center justify-center flex-col gap-2">
			<h1>Route {routeId} was not found</h1>
			<Link to="/" className={buttonVariants()}>
				<Home /> Go Home
			</Link>
		</main>
	);
}
