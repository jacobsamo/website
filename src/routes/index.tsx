import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ProjectCard } from "@/components/project-card";
import { Socials } from "@/components/socials";
import { Marquee } from "@/components/ui/marquee";
import { siteConfig, skills } from "@/lib/config";

export const Route = createFileRoute("/")({
	component: MainPage,
});

function MainPage() {
	return (
		<main className="flex flex-col items-center justify-center">
			<div className="container space-y-8">
				<div
					id="about-me"
					className="px-4 mt-16 flex flex-col items-center justify-center text-center"
				>
					<Image
						src="/profile-picture.jpg"
						alt="Jacob's profile picture"
						width={128}
						height={128}
						className="rounded-full object-cover object-center"
					/>
					<span className="mb-2">
						<h1 className="text-xl">Jacob Samorowski</h1>
						<p className="text-md">Software Developer & Photographer</p>
					</span>
					<Socials platforms={["twitter", "github", "youtube", "linkedin"]} />
				</div>
				<div className="px-4 text-center">
					<h2 className="text-center text-2xl">About Me</h2>
					<p>
						I'm a self-taught software developer and photographer based in
						Queensland, Australia, with a passion for building meaningful
						digital experiences. Since 2021, I've been combining creativity and
						problem-solving to design tools that empower others—whether that's
						through intuitive software or impactful imagery. My flexibility
						allows me to work across a wide range of projects, from full-stack
						web development to visual storytelling. I thrive in fast-paced
						environments, adapt quickly to new challenges, and love sharing what
						I learn along the way.
					</p>
				</div>
				<div id="projects" className="px-4">
					<h2 className="mb-4 text-center text-4xl">Projects</h2>
					<div id="projects" className="grid gap-6 sm:grid-cols-2">
						{siteConfig.projects.map((project) => (
							<ProjectCard
								key={project.url}
								title={project.title}
								description={project.description}
								image={project.image}
								details=""
								link={project.url}
							/>
						))}
					</div>
				</div>
			</div>

			<div id="skills" className="w-full my-16 space-y-4">
				<h2 className="text-center text-4xl mb-4">Skills</h2>
				<Marquee>
					{skills.slice(0, Math.ceil(skills.length / 2)).map((skill) => (
						<div
							key={skill}
							className="bg-muted/50 rounded-md border p-2 whitespace-nowrap"
						>
							{skill}
						</div>
					))}
				</Marquee>
				<Marquee reverse={true}>
					{skills
						.slice(Math.ceil(skills.length / 2), skills.length)
						.map((skill) => (
							<div
								key={skill}
								className="bg-muted/50 rounded-md border p-2 whitespace-nowrap"
							>
								{skill}
							</div>
						))}
				</Marquee>
			</div>

			{/*<div className="container mb-32">
        <div id="work">
          <h2 className="mb-4 text-center text-4xl">Work</h2>
          <JobList />
        </div>
        <div id="education" className="mb-16">
          <h2 className="mb-4 text-center text-4xl">Education</h2>
          <div className="items-left flex flex-col justify-center gap-2">
            {siteConfig.education.map((ed) => (
              <div className="bg-muted/50 flex flex-col items-start rounded-md border p-2">
                <div className="inline-flex items-center gap-2">
                  <Image
                    src={ed.logo}
                    alt={ed.schoolName}
                    width={128}
                    height={128}
                    className="size-8 object-center"
                  />
                  <h3 className="font-bold">{ed.schoolName}</h3>
                </div>
                <p className="text-sm">{ed.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>*/}
		</main>
	);
}
