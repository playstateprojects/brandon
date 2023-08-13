import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { IconInfo, IconPlus } from './icons'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'
import { MemoizedReactMarkdown } from '../markdown'
import { CodeBlock } from './codeblock'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface PanelProps {
  title: string
  children: React.ReactNode
  information?: string
}

const Panel = ({ title, children, information }: PanelProps) => {
  return (
    <div className="mx-auto my-2 max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="relative mb-2 text-lg font-semibold">
          {title}{' '}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ size: 'icon', variant: 'outline' }),
                  'absolute right-0 top-0 h-8 w-8 rounded-full'
                )}
              >
                <IconInfo />
                <span className="sr-only">Information</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Additional Information</TooltipContent>
          </Tooltip>
        </h1>

        {children}
      </div>
    </div>
  )
}
interface PanelTextProps {
  text: string
}
const PanelText = ({ text }: PanelTextProps) => {
  return (
    <>
      <MemoizedReactMarkdown
        className="prose my-4 break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>
          },
          code({ node, inline, className, children, ...props }) {
            if (children.length) {
              if (children[0] == '▍') {
                return (
                  <span className="mt-1 animate-pulse cursor-default">▍</span>
                )
              }

              children[0] = (children[0] as string).replace('`▍`', '▍')
            }

            const match = /language-(\w+)/.exec(className || '')

            if (inline) {
              return (
                <code className={className} {...props}>
                  {}
                </code>
              )
            }

            return (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            )
          }
        }}
      >
        {text}
      </MemoizedReactMarkdown>
    </>
  )
}

export { Panel, PanelText }
