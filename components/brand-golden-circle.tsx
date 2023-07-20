'use client'

import * as React from 'react'
import { ArchetypeData, Brand, GoldenCircle } from '@/lib/types'
import { IconArrowLeft, IconSpinner } from './ui/icons'
import ArchetypePieChart from './archetype-pie-chart'
import { Button } from './ui/button'
import { getGoldenCircle } from '@/app/actions'
import { CircleSelector } from './circle-selector'
import { LoaderIcon } from 'react-hot-toast'
type BrandGoldenCirclesProps = {
  brand: Brand
}

export function BrandGoldenCircle({ brand }: BrandGoldenCirclesProps) {
  const [circle, setCircle] = React.useState<GoldenCircle[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const fetchCircle = async () => {
    setIsLoading(true)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const res = await fetch(`${serverUrl}/api/brand/golden-circle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(brand.properties)
    })
    setIsLoading(false)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    // Convert the response body to JSON
    const json = await res.json()

    // Assert the type of the JSON
    setCircle(JSON.parse(json) as GoldenCircle[])
  }
  return (
    <div className="mx-auto max-w-2xl px-4 w-full mt-12 mb-12">
      {circle.length > 1 && (
        <div className="w-full">
          <CircleSelector
            options={circle.map(option => option.why)}
            title="Why"
          ></CircleSelector>
          <CircleSelector
            options={circle.map(option => option.how)}
            title="How"
          ></CircleSelector>
          <CircleSelector
            options={circle.map(option => option.what)}
            title="What"
          ></CircleSelector>
        </div>
      )}
      <div className="w-full flex justify-center items-center">
        <Button
          type="button"
          variant="outline"
          onClick={fetchCircle}
          className="hover:text-black bg-transparent border-2 border-[#E6FE52] rounded-full py-1 px-4 hover:bg-[#E6FE52] "
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
