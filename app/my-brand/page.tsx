import { nanoid } from '@/lib/utils'
import { PersonalDiscovery } from '@/components/personal-discovery'

export const runtime = 'edge'

export default function ChatPage() {
  const id = nanoid()

  return <PersonalDiscovery id={id} />
}
