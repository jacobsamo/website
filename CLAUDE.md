# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with **TanStack Start** (a full-stack React framework) deployed to Cloudflare Workers. The site showcases projects, photography, blog posts, and professional information.

## Development Commands

**Development:**
- `bun run dev` - Start development server on port 3000 with Sentry instrumentation
- Development server uses Vite with HMR enabled

**Building & Deployment:**
- `bun run build` - Build for production and copy Sentry instrumentation
- `bun run preview` - Preview production build locally
- `bun run deploy` - Deploy to Cloudflare Workers via wrangler
- `bun run start` - Start production server with Sentry instrumentation

**Code Quality:**
- `bun run lint` - Run Biome linter
- `bun run format` - Run Biome formatter
- `bun run check` - Run Biome checks (lint + format)
- Biome uses **tab indentation** and **double quotes** (see biome.json)

**Testing:**
- `bun run test` - Run tests with Vitest

**Adding UI Components:**
- Use `bunx shadcn@latest add <component>` to add shadcn components
- Components go in `src/components/ui/`

## Architecture

### Framework Stack

**TanStack Start + TanStack Router:**
- Full-stack React framework with SSR and streaming support
- File-based routing in `src/routes/` - route files auto-generate into `src/routeTree.gen.ts`
- Router configuration in `src/router.tsx` with SSR-Query integration
- Root route (`src/routes/__root.tsx`) defines shell component and head metadata

**Router Context Pattern:**
- Router context defined in `src/routes/__root.tsx` as `MyRouterContext`
- Providers setup in `src/components/providers/index.tsx` with `getContext()` function
- Context includes QueryClient and is passed via router's `Wrap` component

**Routes Structure:**
- Routes use `createFileRoute()` for file-based routing
- Export `Route` with component and optional loader/head configuration
- All routes wrapped with TanStack Query and Posthog providers

### Key Technologies

- **React 19** with React Compiler enabled (babel-plugin-react-compiler)
- **Vite 7** for bundling with TanStack Start plugin
- **Tailwind CSS 4** via @tailwindcss/vite plugin
- **Biome** for linting and formatting (NOT Prettier/ESLint)
- **Vitest** for testing with React Testing Library
- **Cloudflare Workers** deployment target with nodejs_compat flags

### Path Aliases

TypeScript paths configured in `tsconfig.json`:
- `@/*` → `./src/*`
- `env` → `env.ts`
- `content-collections` → `./.content-collections/generated`

## Important Patterns

### Environment Variables

Use **T3 Env** for type-safe environment variables:
- Schema defined in `env.ts` with Zod validation
- Client vars must have `VITE_` prefix (enforced)
- Import with `import { env } from 'env'`
- Current env vars: `VITE_APP_TITLE`, `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `VITE_SENTRY_DSN`, `SERVER_URL`

### Sentry Instrumentation

**Server-side setup:**
- `instrument.server.mjs` initializes Sentry for server functions
- Copied to `.output/server/` during build
- NODE_OPTIONS imports it before server starts

**Client-side setup:**
- Initialized in `src/router.tsx` when `VITE_SENTRY_DSN` is set

**Instrumenting server functions:**
When using `createServerFn`, wrap implementation with Sentry span:
```tsx
import * as Sentry from '@sentry/tanstackstart-react'

Sentry.startSpan({ name: 'Operation description' }, async () => {
  // server function implementation
})
```

### Content Collections

Blog posts managed via Content Collections:
- Configuration in `content-collections.ts`
- Posts directory: `content/posts/` (supports `.md` and `.mdx`)
- Schema: title, description, pubDate, updatedDate, heroImage
- Generated types in `.content-collections/generated`

### Site Configuration

Centralized config in `src/lib/config.ts`:
- `siteConfig` - site metadata, projects, work history, education
- `socials` - social media links
- `skills` - skills list for display
- All data typed and used across routes

### Devtools Setup

Unified devtools panel in root route:
- TanStack Devtools wrapper with position config
- TanStack Router Devtools panel
- TanStack Query Devtools panel
- Store Devtools for state management

### Styling

- Tailwind CSS with @tailwindcss/vite (v4)
- shadcn/ui components in `src/components/ui/`
- Utility function `cn()` in `src/lib/utils.ts` for className merging
- Global styles in `src/styles.css`

### State Management

TanStack Store available for state management:
- Create stores with `new Store(initialValue)`
- Use `Derived` for computed values
- Access in components with `useStore(store)`

## File Organization

**Routes:** `src/routes/` - file-based routing structure
- `__root.tsx` - root layout with head config and shell component
- `index.tsx` - homepage
- `blog/` - blog routes (index and $postId dynamic route)
- `photography.tsx` - photography gallery
- `challenges/` - challenges section
- `links.tsx` - links page

**Components:**
- `src/components/` - React components
- `src/components/ui/` - shadcn UI components
- `src/components/providers/` - context providers (Posthog, Query, etc.)
- `src/components/mdx/` - MDX components

**Libraries:**
- `src/lib/config.ts` - site configuration and data
- `src/lib/utils.ts` - utility functions
- `src/lib/data.ts` - static data (photography images)

## Deployment

**Target Platform:** Cloudflare Workers
- Configuration in `wrangler.jsonc`
- Compatibility flags: nodejs_compat, nodejs_compat_populate_process_env, nodejs_als
- Entry point: `@tanstack/react-start/server-entry`

**Build Output:**
- Vite builds to `.output/`
- Server instrumentation copied during build

## TanStack Router Notes

**File-based Routing:**
- Create files in `src/routes/` - they auto-generate route definitions
- Use `createFileRoute()` in each route file
- Route tree auto-generated in `src/routeTree.gen.ts` (DO NOT edit manually)

**Data Loading:**
- Use route `loader` for data fetching before render
- Integrates with TanStack Query via SSR-Query integration
- Access loader data with `Route.useLoaderData()`

**Search Params:**
- Search params are JSON-parsed, typed, and validated
- Inherit from parent routes automatically
- Use for type-safe URL state management

**Navigation:**
- Import `Link` from `@tanstack/react-router`
- Type-safe navigation with inferred routes
- Automatic prefetching on hover (defaultPreload: 'intent')

## Notes from Cursor Rules

**Sentry:**
- All server functions should be instrumented with `Sentry.startSpan`
- Error collection configured automatically in router

**shadcn:**
- Always use latest version: `pnpm dlx shadcn@latest add <component>`
- Components are TypeScript (.tsx) not JavaScript
