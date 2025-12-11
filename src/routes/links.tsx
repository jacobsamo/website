import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { ExternalLink, Globe2 } from "lucide-react";
import { socials } from "@/lib/config";
import { CopyRight } from "@/components/footer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/links")({
  component: LinksPage,
  staticData: {
    meta: {
      showLayout: false,
    },
  },
  head: () => {
    const { meta, links } = seo({
      title: "Links - Jacob Samorowski",
      description: "All my social links and ways to connect with me",
      url: "https://jacobsamo.com/links",
    });
    return { meta, links };
  },
});

function LinksPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-md px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6">
            <Image
              src="/profile-picture.jpg"
              alt="Jacob's profile picture"
              width={128}
              height={128}
              className="mx-auto rounded-full object-cover object-center"
            />
          </div>
          <h1 className="mb-3 font-serif text-4xl font-bold text-balance text-white">
            Jacob Samorowski
          </h1>
          <p className="font-sans text-lg text-gray-400">
            Software Developer & Photographer
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <a
            href="/"
            className="text-card-foreground group flex flex-row items-center justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-4 py-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-gray-700 hover:bg-gray-800/50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <Globe2 />

              <div>
                <div className="text-base font-semibold text-white capitalize">
                  Website
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-white" />
          </a>
          {socials.map((social) => (
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-card-foreground group flex flex-row items-center justify-between gap-6 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-4 py-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-gray-700 hover:bg-gray-800/50 active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`/assets/icons/socials/${social.platform}.svg`}
                  alt={`${social.platform} icon`}
                  width={24}
                  height={24}
                />
                <div>
                  <div className="text-base font-semibold text-white capitalize">
                    {social.platform === "twitter"
                      ? "X (Twitter)"
                      : social.platform}
                  </div>
                  <div className="text-sm text-gray-400">{social.handle}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
            </a>
          ))}
        </div>


        {/* Footer */}
        <div className="mt-12 border-t border-secondary pt-8 text-center">
          <p className="text-sm text-gray-500">
            <CopyRight />, Jacob Samorowski
          </p>
        </div>
      </div>
    </div>
  );
}
