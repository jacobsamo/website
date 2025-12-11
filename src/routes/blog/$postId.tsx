import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$postId')({
  component: BlogPostPage,
})

function BlogPostPage() {
  return <div>Hello "/blog/$postId"!</div>
}
