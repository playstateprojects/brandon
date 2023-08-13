'use client'

import * as React from 'react'
import { Brand, ToneOfVoice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { saveBrand } from '@/app/actions'
import { LoaderIcon } from 'react-hot-toast'
import { Panel, PanelText } from './ui/panel'

type toneBoxProps = {
  brand: Brand
}
export function ToneBox({ brand }: toneBoxProps) {
  const [userBrand, setUserBrand] = React.useState<Brand>(brand)
  const [isLoading, setIsLoading] = React.useState(false)
  React.useEffect(() => {
    setUserBrand(brand)
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
    <Panel title="Tone">
      <PanelText text={userBrand.tone!.summary}></PanelText>
      <div>
        <Button onClick={fetchTone}>
          {isLoading && (
            <>
              <LoaderIcon></LoaderIcon>&nbsp;
            </>
          )}
          Generate
        </Button>
      </div>
    </Panel>
  )
}
