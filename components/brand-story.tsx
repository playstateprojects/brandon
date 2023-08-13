'use client'

import * as React from 'react'
import { Brand, GoldenCircle } from '@/lib/types'
import { IconArrowLeft, IconSpinner } from './ui/icons'
import { Button } from './ui/button'
import { saveBrand } from '@/app/actions'
import { LoaderIcon } from 'react-hot-toast'
import { LangChainStream } from 'ai'
import { PanelText } from './ui/panel'
type BrandGoldenCirclesProps = {
  brand: Brand
}

export function BrandStory({ brand }: BrandGoldenCirclesProps) {
  const { stream, handlers } = LangChainStream()
  const [story, setStory] = React.useState<string>('')

  const [isLoading, setIsLoading] = React.useState(false)
  const fetchCircle = async () => {
    setIsLoading(true)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const res = await fetch(`${serverUrl}/api/brand/story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(brand)
    })
    setIsLoading(false)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    // Convert the response body to JSON
    const json = await res.json()
    // Assert the type of the JSON
    const updatedStory = (await JSON.parse(json)) as { data: string }
  }

  const saveStory = (value: string) => {
    const newBrand: Brand = {
      ...brand,
      story: value
    }
    saveBrand(newBrand, brand.userId)
  }
  return (
    <div className="mx-auto my-12 w-full max-w-2xl px-4">
      <h1>Story</h1>
      {/* <PanelText content={story}></PanelText> */}
      <div className="flex w-full items-center justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={fetchCircle}
          className="rounded-full border-2 border-[#E6FE52] bg-transparent px-4 py-1 hover:bg-[#E6FE52] hover:text-black "
        >
          {isLoading ? (
            <LoaderIcon></LoaderIcon>
          ) : (
            'Generate Golden Circle Options'
          )}
        </Button>
      </div>
    </div>
  )
}
