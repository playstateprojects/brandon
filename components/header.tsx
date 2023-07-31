import * as React from 'react'
import Link from 'next/link'

import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import { IconBrandon, IconSeparator } from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'

export async function Header() {
  const session = await auth()
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex w-full items-center">
        <div className="flex items-center">
          <Link href="/" rel="nofollow" style={{ width: '200px' }}>
            <IconBrandon className="mr-2 h-6 w-6 dark:hidden" inverted />
          </Link>
        </div>
        {session?.user && (
          <div className="flex w-full items-center justify-center space-x-4">
            <Link
              href="/chat"
              className="rounded-full border-2 border-[#E6FE52] bg-transparent px-4 py-1 hover:bg-[#E6FE52] hover:text-black "
            >
              Chat to Brand
            </Link>

            <Link
              href="/guide"
              className="rounded-full border-2 border-[#E6FE52] bg-transparent px-4 py-1 hover:bg-[#E6FE52] hover:text-black "
            >
              Brand Guide
            </Link>
          </div>
        )}
        {session && session.user && <UserMenu user={session.user} />}
      </div>
    </header>
  )
}
