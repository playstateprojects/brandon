import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Brief a copy writer',
    message: `create a brief for a blog posts detailing`
  },
  {
    heading: 'Ask a Brand question:',
    message: 'What type face should I use in an instagram post? \n'
  },
  {
    heading: 'Draft a linkedin update',
    message: `Draft a linkedin post about the following: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Hi, I&#39;m Brandon</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Let&#39;s talk about unleashing the power of your brand.
        </p>
        <p className="leading-normal text-muted-foreground">
          Here are some of the things I could help with:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
