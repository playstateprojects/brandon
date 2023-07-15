import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { CenteredDiv } from '@/components/centered-div'


export const runtime = 'edge'



export async function generateMetadata(): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  return {
    title: "Your brand guide"
  }
}

export default async function GuidePage() {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/guide/`)
  }



 

  return <CenteredDiv>
    <div className="mx-auto max-w-2xl px-4">
        we'll put some cool visualisations and suff here...
  </div>
    </CenteredDiv>
}
