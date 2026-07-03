import contentCollections from "@content-collections/vite";
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		contentCollections(),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart({
			sitemap: {
				enabled: true,
				host: "https://jacobsamo.com",
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
		tsconfigPaths(),
	],
});

export default config;
