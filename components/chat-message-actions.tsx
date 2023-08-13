'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import { IconCheck, IconCopy, IconSave } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
  prompt: Message
}

export function ChatMessageActions({
  message,
  className,
  prompt,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }
  const saveToBrand = async () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const res = await fetch(`${serverUrl}/api/brand/trait`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt.content,
        response: message.content
      })
    })
    console.log(res)
  }

  return (
    <>
      <div
        className={cn(
          'flex flex-col items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
          className
        )}
        {...props}
      >
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {isCopied ? <IconCheck /> : <IconCopy />}
          <span className="sr-only">Copy message</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={saveToBrand}>
          <IconSave />
          <span className="sr-only">Save to brand</span>
        </Button>
      </div>
    </>
  )
}
