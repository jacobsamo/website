import { seo } from "@/lib/seo";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/challenges/')({
  component: ChallengesPage,
  head: () => {
    const { meta, links } = seo({
      title: "Challenges - Jacob Samorowski",
      description: "Coding challenges and exercises I've completed",
      url: "https://jacobsamo.com/challenges",
    });
    return { meta, links };
  },
})

function ChallengesPage() {
  return <div>Hello "/challenges/"!</div>
}
