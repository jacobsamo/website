import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$postId")({
	component: BlogPostPage,
	// Example: Add SEO metadata for blog posts
	// head: ({ params }) => {
	//   const post = getPost(params.postId); // Fetch your post data
	//   const { meta, links } = seo({
	//     title: `${post.title} - Jacob Samorowski`,
	//     description: post.description,
	//     keywords: post.tags,
	//     image: post.heroImage,
	//     url: `https://jacobsamo.com/blog/${params.postId}`,
	//   });
	//   return { meta, links };
	// },
});

function BlogPostPage() {
	return <div>Hello "/blog/$postId"!</div>;
}
