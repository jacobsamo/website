import { Link } from "@tanstack/react-router";

export const Header = () => {
	return (
		<nav className="fixed top-2 z-50 flex w-full items-center justify-between">
			<div className="mx-auto flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1a]/90 p-2 text-sm shadow-lg backdrop-blur-lg sm:gap-4 sm:text-base">
				<Link
					to="/"
					activeProps={{
						className: "text-bold underline",
					}}
					className="inline-block decoration-0"
				>
					Home
				</Link>
				<Link
					to="/photography"
					activeProps={{
						className: "text-bold underline",
					}}
					className="inline-block decoration-0"
				>
					Photography
				</Link>
				<Link
					to="/blog"
					activeProps={{
						className: "text-bold underline",
					}}
					className="inline-block decoration-0"
				>
					Blog
				</Link>
				<Link
					to="/design"
					activeProps={{
						className: "text-bold underline",
					}}
					className="inline-block decoration-0"
				>
					Designs
				</Link>
				<Link
					to="/links"
					activeProps={{
						className: "text-bold underline",
					}}
					className="inline-block decoration-0"
				>
					Links
				</Link>
			</div>
		</nav>
	);
};
