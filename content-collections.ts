import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "src/content/posts",
  include: ["**/*.md", "**/*.mdx"],
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const animationChanges = defineCollection({
  name: "animations",
  directory: "src/content/challenges/animations",
  include: ["**/*.md", "**/*.mdx"],
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
  }),
})

export default defineConfig({
  collections: [posts],
});
