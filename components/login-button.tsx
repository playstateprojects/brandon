'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGitHub, IconSpinner, IconDiscord, IconGoogle } from './ui/icons'

interface LoginButtonProps extends ButtonProps {
  showGithubIcon?: boolean
}

export function LoginButton({
  showGithubIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <div className="flex flex-col ">
      <Button
        variant="outline"
        onClick={() => {
          setIsLoading(true)
          // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
          signIn('github', { callbackUrl: `http://localhost:3000/` })
        }}
        disabled={isLoading}
        className={cn(className)}
        {...props}
      >
        {isLoading ? (
          <IconSpinner className="mr-2 animate-spin" />
        ) : showGithubIcon ? (
          <IconGitHub className="mr-2" />
        ) : null}
        Login with Github
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setIsLoading(true)
          // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
          signIn('discord', { callbackUrl: `http://localhost:3000/` })
        }}
        disabled={isLoading}
        className={cn(className)}
        {...props}
      >
        {isLoading ? (
          <IconSpinner className="mr-2 animate-spin" />
        ) : showGithubIcon ? (
          <IconDiscord className="mr-2" />
        ) : null}
        Login with discord
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setIsLoading(true)
          // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
          signIn('google', { callbackUrl: `http://localhost:3000/` })
        }}
        disabled={isLoading}
        className={cn(className)}
        {...props}
      >
        {isLoading ? (
          <IconSpinner className="mr-2 animate-spin" />
        ) : showGithubIcon ? (
          <IconGoogle className="mr-2" />
        ) : null}
        &nbsp;Login with Google
      </Button>
    </div>
  )
}
