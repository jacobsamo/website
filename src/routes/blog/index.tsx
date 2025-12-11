import { seo } from "@/lib/seo";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/')({
  component: BlogPage,
  head: () => {
    const { meta, links } = seo({
      title: "Blog - Jacob Samorowski",
      description: "Thoughts, tutorials, and stories from a software developer and photographer",
      url: "https://jacobsamo.com/blog",
    });
    return { meta, links };
  },
})

function BlogPage() {
  return <main
    className='relative flex h-full w-full flex-col items-center justify-center'
  >
    <div className='items-center justify-center text-center'>
      <h1>No blog posts from me just yet</h1>
      <p>Check back in later</p>
    </div>

  </main>
}
