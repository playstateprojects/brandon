import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getBrand } from './actions'

export const runtime = 'edge'

export default async function IndexPage() {
  const session = await auth()

  if (session?.user) {
    const brand = await getBrand(session.user.id)
    if (brand.properties && brand.properties.length > 2) {
      redirect('/guide')
    } else {
      redirect('/manage')
    }
  }
  return (
    <>
      <div className="flex min-h-screen-100 flex-col items-center justify-center bg-[#E6FE52]">
        <div className="w-4/5 max-w-xl">
          <Image
            className="mx-auto"
            src="/intro.gif"
            alt="Animated GIF"
            width={600}
            height={400}
            loading="lazy"
          />
        </div>
        <div className="mt-4">
          <Link
            href="/sign-in"
            className="rounded-full border-2 border-[#000] bg-transparent px-4 py-1 text-black hover:bg-[#E6FE52] hover:text-black "
          >
            Get started
          </Link>
        </div>
      </div>
    </>
  )
}
