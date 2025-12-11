import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/challenges/')({
  component: ChallengesPage,
  
})

function ChallengesPage() {
  return <div>Hello "/challenges/"!</div>
}
