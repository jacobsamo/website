import contentCollections from "@content-collections/vite";
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { contentMdxModules } from "./src/lib/mdx-plugin.ts";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		contentMdxModules(),
		contentCollections({ configPath: "content-collections.ts" }),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({
			sitemap: {
				enabled: false,
			},
			prerender: {
				enabled: true,
				crawlLinks: true,
			},
		}),
		devtools(),
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
		tailwindcss(),
	],
});

export default config;
