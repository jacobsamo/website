import { Calendar, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Socials } from "./socials";

export const CopyRight = () => {
  return <span>&copy; {new Date().getFullYear()}</span>;
};

export const Footer = () => {
  return (
    <footer className="py-8 px-4 pb-16 bg-gradient-to-b from-muted/50 to-muted/30 text-gray-600 text-center border-t-2">
      <div className="space-y-8 px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Whether you want to discuss a project, ask a question, or just say hi,
          I'll try my best to get back to you!
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            className={buttonVariants({variant: "secondary"})}
            href="https://cal.com/jacobsamorowski"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule a Call
          </a>
          <a className={buttonVariants({variant: "secondary"})} href="mailto:jacob@jacobsamo.com">
            <Mail className="mr-2 h-4 w-4" /> Contact Me
          </a>
        </div>
        <Socials />
      </div>
      <p className="text-muted-foreground mt-6 text-center">
        <CopyRight />, Jacob Samorowski. All rights reserved.
      </p>
    </footer>
  );
};
