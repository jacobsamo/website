import type { ComponentType } from "react";

type MdxModule = {
	default: ComponentType<{ components?: Record<string, any> }>;
};

const posts = import.meta.glob<MdxModule>("../content/posts/*.{md,mdx}", {
	query: "?mdx",
	eager: true,
});
const designs = import.meta.glob<MdxModule>("../content/designs/*.{md,mdx}", {
	query: "?mdx",
	eager: true,
});

export function getMdxComponent(
	collection: "posts" | "designs",
	filePath: string,
) {
	const modules = collection === "posts" ? posts : designs;
	const path = `../content/${collection}/${filePath}`;
	const module = modules[path];
	if (!module) throw new Error(`Missing MDX module: ${path}`);
	return module.default;
}
