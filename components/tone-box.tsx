'use client'

import * as React from 'react'
import { Brand, ToneOfVoice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { saveBrand } from '@/app/actions'
import { LoaderIcon } from 'react-hot-toast'

type toneBoxProps = {
  brand: Brand
}
export function ToneBox({ brand }: toneBoxProps) {
  const [userBrand, setUserBrand] = React.useState<Brand>(brand)
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    setUserBrand(brand)
    console.log(brand)
  }, [brand])
  const fetchTone = async () => {
    setIsLoading(true)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const res = await fetch(`${serverUrl}/api/brand/tone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(brand.archetypeData?.traits)
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    // Convert the response body to JSON
    const json = await res.json()
    const tone = JSON.parse(json)
    const updatedBrand = { ...userBrand, tone: tone as ToneOfVoice }
    setUserBrand(prevVal => {
      return { ...prevVal, tone: tone as ToneOfVoice }
    })
    await saveBrand(updatedBrand, userBrand.userId)
    setIsLoading(false)
  }
  return (
    <div className="mx-auto my-12 w-full max-w-2xl px-4">
      <h1 className="text-2xl font-bold">Tone</h1>
      <p className="my-2">{userBrand.tone?.summary}</p>
      <div>
        <Button onClick={fetchTone}>
          {isLoading && (
            <>
              <LoaderIcon></LoaderIcon>&nbsp;
            </>
          )}
          Genrate
        </Button>
      </div>
    </div>
  )
}
