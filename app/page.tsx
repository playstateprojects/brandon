import { auth } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default async function IndexPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/manage')
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen-100 bg-[#E6FE52]">
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
            className="hover:text-black text-black bg-transparent border-2 border-[#000] rounded-full py-1 px-4 hover:bg-[#E6FE52] "
          >
            Get started
          </Link>
        </div>
      </div>
    </>
  )
}
