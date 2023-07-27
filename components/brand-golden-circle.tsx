'use client'

import * as React from 'react'
import { ArchetypeData, Brand, GoldenCircle } from '@/lib/types'
import { IconArrowLeft, IconSpinner } from './ui/icons'
import ArchetypePieChart from './archetype-pie-chart'
import { Button } from './ui/button'
import { saveBrand } from '@/app/actions'
import { CircleSelector } from './circle-selector'
import { LoaderIcon } from 'react-hot-toast'
type BrandGoldenCirclesProps = {
  brand: Brand
}

export function BrandGoldenCircle({ brand }: BrandGoldenCirclesProps) {
  const [circle, setCircle] = React.useState<GoldenCircle[]>(
    brand.goldenCircle ? [brand.goldenCircle] : []
  )
  const [whyOptions, setWhyOptions] = React.useState<string[]>(
    brand.goldenCircle ? [brand.goldenCircle.why] : []
  )
  const [whatOptions, setWhatOptions] = React.useState<string[]>(
    brand.goldenCircle ? [brand.goldenCircle.what] : []
  )
  const [howOptions, setHowOptions] = React.useState<string[]>(
    brand.goldenCircle ? [brand.goldenCircle.how] : []
  )
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
    const updatedCircle = (await JSON.parse(json)) as GoldenCircle[]
    const newWhyOptions = updatedCircle.map(option => option.why)
    const newWhatOptions = updatedCircle.map(option => option.what)
    const newHowOptions = updatedCircle.map(option => option.how)
    setWhyOptions([...newWhyOptions])
    setWhatOptions([...newWhatOptions])
    setHowOptions([...newHowOptions])
    setCircle([...updatedCircle])
  }

  type AllowedSections = 'why' | 'what' | 'how'
  const saveCircle = (section: AllowedSections, value: string) => {
    const newBrand: Brand = {
      ...brand,
      goldenCircle: { ...brand.goldenCircle, [section]: value } as GoldenCircle
    }
    saveBrand(newBrand, brand.userId)
  }
  return (
    <div className="mx-auto my-12 w-full max-w-2xl px-4">
      {circle.length > 0 && (
        <div className="w-full">
          <CircleSelector
            initialOptions={whyOptions}
            title="Why"
            saveFunction={(value: string) => saveCircle('why', value)}
            index={whyOptions.length > 1 ? 1 : 0}
          />
          <CircleSelector
            initialOptions={howOptions}
            title="How"
            saveFunction={(value: string) => saveCircle('how', value)}
            index={howOptions.length > 1 ? 1 : 0}
          />
          <CircleSelector
            initialOptions={whatOptions}
            title="What"
            saveFunction={(value: string) => saveCircle('what', value)}
            index={whatOptions.length > 1 ? 1 : 0}
          />
        </div>
      )}
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
