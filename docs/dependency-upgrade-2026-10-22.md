# Dependency upgrade: 2026-10-22

All direct dependencies in `package.json` are listed below. Versions are the declared minimums before and after `bun update --latest`; `bun.lock` records the resolved versions. Release-history links point to each package’s upstream repository when available, or its npm package page. Packages with identical versions were already current. For changed packages, compare links show the exact upstream commits recorded in npm metadata when available; otherwise the link opens upstream release history.

## Notable migration notes

- **Motion 12 → 14:** The [official upgrade guide](https://motion.dev/docs/upgrade-guide) reports no JavaScript breaking changes in versions 13 and 14, while tightening internal dependency versioning.
- **Vitest 4 → 5:** The [migration guide](https://vitest.dev/guide/migration/) requires Node 22.12+ and Vite 6.4+, changes mock clearing defaults, and removes deprecated entry points. This repository has no committed test files.
- **jsdom 29 → 30:** Review [jsdom releases](https://github.com/jsdom/jsdom/releases) for DOM behavior changes.
- **Wrangler 4.111 → 4.151:** The new runtime uses a supported 2026-10-19 compatibility date; Node compatibility is enabled by default for dates after 2026-08-04. [Cloudflare compatibility flags](https://developers.cloudflare.com/workers/configuration/compatibility-flags/).
- **Vite 8.1 → 8.3:** Vite now offers native `resolve.tsconfigPaths`; the project no longer imports the older `vite-tsconfig-paths` plugin.
- **Content Collections:** Adopted explicit `content` schemas and the `content` config key, replacing deprecated implicit content and `collections`.

## Runtime dependencies

| Package | Before | After | Release history |
| --- | --- | --- | --- |
| `@base-ui/react` | `^1.6.0` | `^1.9.0` | [Upstream](https://github.com/mui/base-ui/releases) |
| `@cloudflare/vite-plugin` | `^1.45.0` | `^1.64.0` | [Upstream](https://github.com/cloudflare/workers-sdk/releases) |
| `@fontsource-variable/inter` | `^5.2.8` | `^5.3.0` | [Compare commits](https://github.com/fontsource/font-files/compare/40ecb0c337fd649924783a87783dc2e6639bb6f2...02b28c06b126c852a5b966b44aef777ca923f6f6) |
| `@posthog/react` | `^1.10.3` | `^1.11.3` | [Upstream](https://github.com/PostHog/posthog-js/releases) |
| `@shikijs/transformers` | `^4.3.1` | `^4.5.0` | [Upstream](https://github.com/shikijs/shiki/releases) |
| `@t3-oss/env-core` | `^0.13.11` | `^0.13.11` | [Upstream](https://github.com/t3-oss/t3-env/releases) |
| `@tailwindcss/vite` | `^4.3.2` | `^4.3.3` | [Upstream](https://github.com/tailwindlabs/tailwindcss/releases) |
| `@tanstack/react-devtools` | `^0.10.8` | `^0.10.13` | [Upstream](https://github.com/TanStack/devtools/releases) |
| `@tanstack/react-query` | `^5.101.2` | `^5.104.5` | [Upstream](https://github.com/TanStack/query/releases) |
| `@tanstack/react-query-devtools` | `^5.101.2` | `^5.104.5` | [Upstream](https://github.com/TanStack/query/releases) |
| `@tanstack/react-router` | `^1.170.18` | `^1.170.45` | [Upstream](https://github.com/TanStack/router/releases) |
| `@tanstack/react-router-devtools` | `^1.167.0` | `^1.167.2` | [Upstream](https://github.com/TanStack/router/releases) |
| `@tanstack/react-router-ssr-query` | `^1.167.1` | `^1.167.3` | [Upstream](https://github.com/TanStack/router/releases) |
| `@tanstack/react-start` | `^1.168.28` | `^1.169.3` | [Upstream](https://github.com/TanStack/router/releases) |
| `@tanstack/react-store` | `^0.11.0` | `^0.11.2` | [Upstream](https://github.com/TanStack/store/releases) |
| `@tanstack/store` | `^0.11.0` | `^0.11.2` | [Upstream](https://github.com/TanStack/store/releases) |
| `@unpic/react` | `^1.0.2` | `^1.0.2` | [Upstream](https://github.com/ascorbic/unpic-img/releases) |
| `class-variance-authority` | `^0.7.1` | `^0.7.1` | [Upstream](https://github.com/joe-bell/cva/releases) |
| `cnfast` | `^0.0.8` | `^0.2.0` | [Upstream](https://github.com/aidenybai/cnfast/releases) |
| `date-fns` | `^4.4.0` | `^4.4.0` | [Upstream](https://github.com/date-fns/date-fns/releases) |
| `lucide-react` | `^1.24.0` | `^1.61.0` | [Upstream](https://github.com/lucide-icons/lucide/releases) |
| `motion` | `^12.42.2` | `^14.6.0` | [Compare commits](https://github.com/motiondivision/motion/compare/40e8756c63b258c9dd07de9501cb788410eefb02...c624ce8e907d5668280b8c832f2ab93ba3462ab5) |
| `posthog-js` | `^1.400.1` | `^1.438.15` | [Upstream](https://github.com/PostHog/posthog-js/releases) |
| `react` | `^19.2.7` | `^19.3.1` | [Compare commits](https://github.com/react/react/compare/6117d7cca4906492c51fe6a03381e35adfd86e7d...61aa00df822d0eb76d0362eb8b6fdd3527693efe) |
| `react-dom` | `^19.2.7` | `^19.3.1` | [Compare commits](https://github.com/react/react/compare/6117d7cca4906492c51fe6a03381e35adfd86e7d...61aa00df822d0eb76d0362eb8b6fdd3527693efe) |
| `react-tweet` | `^3.3.1` | `^3.3.1` | [Upstream](https://github.com/vercel/react-tweet/releases) |
| `shadcn` | `^4.13.0` | `^4.22.1` | [Upstream](https://github.com/shadcn-ui/ui/releases) |
| `tailwindcss` | `^4.3.2` | `^4.3.3` | [Upstream](https://github.com/tailwindlabs/tailwindcss/releases) |
| `tw-animate-css` | `^1.4.0` | `^1.4.0` | [Upstream](https://github.com/Wombosvideo/tw-animate-css/releases) |
| `zod` | `^4.4.3` | `^4.6.7` | [Compare commits](https://github.com/colinhacks/zod/compare/f3c9ec03ba7a28ae72d25cc295f38674bee0f559...b500a2ee95134f81d74da7911d7378dd2853d042) |

## Development dependencies

| Package | Before | After | Release history |
| --- | --- | --- | --- |
| `@content-collections/core` | `^0.15.2` | `^0.15.3` | [Upstream](https://github.com/sdorra/content-collections/releases) |
| `@content-collections/mdx` | `^0.2.2` | `^0.2.2` | [Upstream](https://www.npmjs.com/package/@content-collections/mdx) |
| `@content-collections/vite` | `^0.3.0` | `^0.3.1` | [Upstream](https://github.com/sdorra/content-collections/releases) |
| `@rolldown/plugin-babel` | `^0.2.3` | `^0.2.4` | [Upstream](https://github.com/rolldown/plugins/releases) |
| `@tanstack/devtools-event-client` | `^0.5.0` | `^0.5.0` | [Upstream](https://github.com/TanStack/devtools/releases) |
| `@tanstack/devtools-vite` | `^0.8.1` | `^0.8.5` | [Upstream](https://github.com/TanStack/devtools/releases) |
| `@types/node` | `^26.1.1` | `^26.6.5` | [Upstream](https://github.com/DefinitelyTyped/DefinitelyTyped/releases) |
| `@types/react` | `^19.2.17` | `^19.3.0` | [Upstream](https://github.com/DefinitelyTyped/DefinitelyTyped/releases) |
| `@types/react-dom` | `^19.2.3` | `^19.3.0` | [Upstream](https://github.com/DefinitelyTyped/DefinitelyTyped/releases) |
| `@vitejs/plugin-react` | `^6.0.3` | `^6.1.2` | [Compare commits](https://github.com/vitejs/vite-plugin-react/compare/640fd358a0e82393acfce4e92e19a6ac6e1641a7...ac47648e17674299accb51816e9e33b8a7b07b05) |
| `babel-plugin-react-compiler` | `^1.0.0` | `^1.0.0` | [Upstream](https://github.com/facebook/react/releases) |
| `fumadocs-core` | `^16.11.4` | `^16.17.7` | [Upstream](https://www.npmjs.com/package/fumadocs-core) |
| `github-slugger` | `^2.0.0` | `^2.0.0` | [Upstream](https://github.com/Flet/github-slugger/releases) |
| `jsdom` | `^29.1.1` | `^30.1.3` | [Compare commits](https://github.com/jsdom/jsdom/compare/9b9ea7e10b7842cd38c61458a38774cc3b60c24c...058c0f55f369a70bcb113d660ae562b9066f2d44) |
| `oxfmt` | `^0.59.0` | `^0.74.0` | [Upstream](https://github.com/oxc-project/oxc/releases) |
| `oxlint` | `^1.74.0` | `^1.89.0` | [Upstream](https://github.com/oxc-project/oxc/releases) |
| `react-doctor` | `^0.7.8` | `^0.9.18` | [Upstream](https://github.com/millionco/react-doctor/releases) |
| `rehype-autolink-headings` | `^7.1.0` | `^7.1.0` | [Upstream](https://github.com/rehypejs/rehype-autolink-headings/releases) |
| `rehype-pretty-code` | `^0.14.4` | `^0.14.5` | [Upstream](https://github.com/rehype-pretty/rehype-pretty-code/releases) |
| `rehype-slug` | `^6.0.0` | `^6.0.0` | [Upstream](https://github.com/rehypejs/rehype-slug/releases) |
| `remark-gfm` | `^4.0.1` | `^4.0.1` | [Upstream](https://github.com/remarkjs/remark-gfm/releases) |
| `schema-dts` | `^2.0.0` | `^2.1.0` | [Compare commits](https://github.com/google/schema-dts/compare/281561dec6b52f072115569f1917d1f00b5ba206...60f345c2fe3ba6c62e128733da9925a3fa52473a) |
| `typescript` | `^7.0.2` | `^7.0.2` | [Upstream](https://github.com/microsoft/TypeScript/releases) |
| `vite` | `^8.1.4` | `^8.3.5` | [Upstream](https://github.com/vitejs/vite/releases) |
| `vitest` | `^4.1.10` | `^5.0.5` | [Upstream](https://github.com/vitest-dev/vitest/releases) |
| `wrangler` | `^4.111.0` | `^4.151.3` | [Upstream](https://github.com/cloudflare/workers-sdk/releases) |

## Cloudflare configuration

- Compatibility date moved to 2026-10-19, the newest date supported by the installed local Workers runtime.
- Removed redundant Node compatibility flags: Node APIs and `process.env` support are defaults at this compatibility date.
- Kept full Worker logs and reduced traces to a 10% sample to preserve diagnostic visibility while controlling trace volume.
- Kept `keep_vars` to preserve dashboard-managed variables across deploys; left static assets to the Cloudflare Vite plugin and did not add unused storage or AI bindings.

## Verification notes

- `bun outdated`: no remaining direct dependency updates.
- `bun run build`, `bun run lint`, `bun run test`, and `wrangler deploy --dry-run`: completed. The test runner found no test files.
- `tsc --noEmit --noUnusedLocals false`: completed. The normal type check still reports three unused declarations in the uncommitted capture-license files, which are outside this upgrade.
- The build logs a pre-existing MDX rendering error for `/design/01-notification`: `new Function` is disallowed in the Workers runtime. The prerender process currently exits successfully despite this error; the route needs a separate build-time MDX compilation change.

Sources: [Cloudflare Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/), [Vite plugin static assets](https://developers.cloudflare.com/workers/vite-plugin/reference/static-assets/), [Workers traces](https://developers.cloudflare.com/workers/observability/traces/).
