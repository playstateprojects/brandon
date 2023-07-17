import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { BrandManager } from '@/components/BrandManager'
import { getBrand } from '../actions'

export const runtime = 'edge'

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  return {
    title: 'Create your brand'
  }
}

export default async function CreatePage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`/sign-in?next=/manage/`)
  }
  const userBrand = await getBrand(session.user.id)
  return (
    <div className="mx-auto max-w-2xl px-4">
      {userBrand && <BrandManager brand={userBrand} />}
    </div>
  )
}
