import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { CenteredDiv } from '@/components/centered-div'
import { getBrand } from '../actions'
import { BrandResults } from '@/components/BrandResults'
import React from 'react'
import { Brand } from '@/lib/types'
import { BrandGuide } from '@/components/brand-guide'

export const runtime = 'edge'

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  return {
    title: 'Your brand guide'
  }
}

export default async function GuidePage() {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/guide/`)
  }

  const brand = await getBrand(session.user.id)

  return <BrandGuide brand={brand}></BrandGuide>
}
