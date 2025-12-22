import { Link } from "@tanstack/react-router";
import { Calendar, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Socials } from "./socials";

export const CopyRight = () => {
	return <span>&copy; {new Date().getFullYear()}</span>;
};

export const Footer = () => {
	return (
		<footer className="border-t-2 bg-gradient-to-b from-muted/50 to-muted/30 px-4 py-8 text-gray-600">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
					{/* Navigation */}
					<div>
						<h3 className="mb-4 font-semibold text-foreground">Navigate</h3>
						<nav className="space-y-2">
							<Link
								to="/"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Home
							</Link>
							<Link
								to="/photography"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Photography
							</Link>
							<Link
								to="/design"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Designs
							</Link>
							<Link
								to="/links"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Links
							</Link>
							{/* Future navigation links */}
							{/* <Link to="/about" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">About</Link> */}
							{/* <Link to="/blog" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">Blog</Link> */}
							{/* <Link to="/portfolio" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">Portfolio</Link> */}
							{/* <Link to="/services" className="block text-sm text-muted-foreground transition-colors hover:text-foreground">Services</Link> */}
						</nav>
					</div>

					{/* Contact & CTA */}
					<div>
						<h3 className="mb-4 font-semibold text-foreground">Get in Touch</h3>
						<p className="mb-4 text-muted-foreground text-sm">
							Let's discuss your next project or just say hello!
						</p>
						<div className="space-y-3">
							<a
								className={buttonVariants({
									variant: "secondary",
									size: "sm",
									className: "w-full justify-start",
								})}
								href="https://cal.com/jacobsamorowski"
							>
								<Calendar className="mr-2 h-4 w-4" />
								Schedule a Call
							</a>
							<a
								className={buttonVariants({
									variant: "secondary",
									size: "sm",
									className: "w-full justify-start",
								})}
								href="mailto:jacob@jacobsamo.com"
							>
								<Mail className="mr-2 h-4 w-4" /> Contact Me
							</a>
						</div>
					</div>

					{/* Connect */}
					<div>
						<h3 className="mb-4 font-semibold text-foreground">Connect</h3>
						<Socials />
					</div>

					{/* Legal - Future Use */}
					{/* <div>
						<h3 className="font-semibold mb-4 text-foreground">Legal</h3>
						<nav className="space-y-2">
							<Link
								to="/legal/privacy"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Privacy Policy
							</Link>
							<Link
								to="/legal/terms"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Terms of Service
							</Link>
							<Link
								to="/legal/cookies"
								className="block text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Cookie Policy
							</Link>
						</nav>
					</div> */}
				</div>

				{/* Copyright */}
				<div className="border-t pt-6 text-center">
					<p className="text-muted-foreground text-sm">
						<CopyRight />, Jacob Samorowski. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
