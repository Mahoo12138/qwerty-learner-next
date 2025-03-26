import { createFileRoute } from '@tanstack/react-router'
import Explore from '@/pages/Typing/explore'
// import Typing from "@/pages/Typing";

export const Route = createFileRoute('/_public/explore/')({
  component: () => <Explore />,
})
