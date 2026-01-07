import contentCollections from "@content-collections/vite";
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const config = defineConfig({
  plugins: [
    contentCollections(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      sitemap: {
        enabled: true,
        host: "https://jacobsamo.com"
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    devtools(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
  ],
})

export default config
