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
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center w-full">
        {session?.user && (
          <div className="mr-4">
            <Sidebar>
              <React.Suspense
                fallback={<div className="flex-1 overflow-auto" />}
              >
                <UserMenu user={session.user} />
                {/* @ts-ignore */}
                <SidebarList userId={session?.user?.id} />
              </React.Suspense>
              <SidebarFooter>
                <ThemeToggle />
                <ClearHistory clearChats={clearChats} />
              </SidebarFooter>
            </Sidebar>
          </div>
        )}
        <Link
          href="/"
          target="_blank"
          rel="nofollow"
          style={{ width: '200px' }}
        >
          <IconBrandon className="w-6 h-6 mr-2 dark:hidden" inverted />
        </Link>
        <div className="flex items-center justify-center space-x-4 w-full">
          <Link
            href="/"
            className="hover:text-black bg-transparent border-2 border-[#E6FE52] rounded-full py-1 px-4 hover:bg-[#E6FE52] "
          >
            Ask Brand
          </Link>
          <Link
            href="/manage"
            className="hover:text-black bg-transparent border-2 border-[#E6FE52] rounded-full py-1 px-4 hover:bg-[#E6FE52] "
          >
            Manage Brand
          </Link>
          <Link
            href="/guide"
            className="hover:text-black bg-transparent border-2 border-[#E6FE52] rounded-full py-1 px-4 hover:bg-[#E6FE52] "
          >
            Brand Guide
          </Link>
        </div>
      </div>
    </header>
  )
}
