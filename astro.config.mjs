import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://jacobsamo.com',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml',
    },
    imageService: "passthrough"
  }),
  output: 'server',
  vite: {
    ssr: {
      external: ['node:buffer'],
    },
    build: {
      minify: false,
    },
  },
});
