import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { BrandQuestions } from '@/components/brand-question'

export const runtime = 'edge'



export async function generateMetadata(): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  return {
    title: "Create your brand"
  }
}

export default async function CreatePage() {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/create/`)
  }



 

  return <div className="mx-auto max-w-2xl px-4">
        <BrandQuestions></BrandQuestions>
  </div>
}
