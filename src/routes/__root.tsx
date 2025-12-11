import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useMatches,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import {Header} from "@/components/header";
import { Footer } from "@/components/footer";
import TanStackQueryDevtools from "@/components/providers/devtools";

import appCss from "../styles.css?url";
import { siteConfig } from "@/lib/config";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    const canonicalURL = new URL(
      typeof window !== "undefined" ? window.location.pathname : "/",
      typeof window !== "undefined"
        ? window.location.origin
        : "https://jacobsamo.com"
    );

    const title = siteConfig.title;
    const description = siteConfig.description;
    const image = siteConfig.og.url;
    const keywords = siteConfig.keywords;
    const twitterHandle = siteConfig.socials.find(
      (social) => social.platform === "twitter"
    )?.handle;

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: title,
        },
        {
          name: "title",
          content: title,
        },
        {
          name: "description",
          content: description,
        },
        {
          name: "keywords",
          content: keywords.join(", "),
        },
        {
          name: "author",
          content: "Jacob Samorowski",
        },
        {
          httpEquiv: "Content-Language",
          content: "en",
        },
        {
          name: "robots",
          content: "index, follow",
        },
        // Open Graph / Facebook
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:site_name",
          content: title,
        },
        {
          property: "og:locale",
          content: "en_AU",
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:url",
          content: canonicalURL.toString(),
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:image",
          content: new URL(image, canonicalURL).toString(),
        },
        {
          property: "og:image:type",
          content: "image/jpg",
        },
        // Twitter
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:creator",
          content: `@${twitterHandle}`,
        },
        {
          property: "twitter:url",
          content: canonicalURL.toString(),
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
        {
          property: "twitter:image",
          content: new URL(image, canonicalURL).toString(),
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        // Favicon
        {
          rel: "icon",
          href: "/profile-picture.jpg",
        },
        {
          rel: "apple-touch-icon",
          href: "/profile-picture.jpg",
        },
        {
          rel: "sitemap",
          href: "/sitemap-index.xml",
        },
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
        // Canonical URL
        {
          rel: "canonical",
          href: canonicalURL.toString(),
        },
      ],
    };
  },

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  // Check if the current route has showLayout metadata (default: true)
  const showLayout = currentRoute?.staticData?.meta?.showLayout ?? true;

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {showLayout && <Header />}
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
        {/*This is the div for the dot background*/}
        <div
          className='fixed inset-0 -z-50 min-h-screen w-full bg-[radial-gradient(#7979792e_1px,transparent_1px)] [background-size:16px_16px]'
        />
        {showLayout && <Footer />}
      </body>
    </html>
  );
}
