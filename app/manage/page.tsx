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
    <div className="mx-auto max-w-6xl px-4">
      <div className="mt-8">
        <h1 className="mb-2 text-lg font-semibold">
          Let's get to know each other!
        </h1>
        <p>
          Please answer a couple of questions about your brand so I can tailor
          my responses to your particular blend of awesome.
        </p>
      </div>
      {userBrand.properties && <BrandManager brand={userBrand} />}
    </div>
  )
}
