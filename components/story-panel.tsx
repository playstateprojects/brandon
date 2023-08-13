'use client'

import * as React from 'react'
import { Brand, ToneOfVoice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from 'react-hot-toast'
import { Panel, PanelText } from './ui/panel'
import { saveBrand } from '@/app/actions'

type StoryPanelProps = {
  brand: Brand
}
const createBrandSumation = (brand: Brand): string => {
  let brandMD = ''
  brand.properties?.forEach(brandProp => {
    if (brandProp.description.toLowerCase() == 'what is your brand name?') {
      brandMD = '# ' + brandProp.value + brandMD + '\n\n'
    } else if (brandProp.value) {
      brandMD +=
        '### ' + brandProp.description + '\n\n' + brandProp.value + '\n\n'
    }
  })
  if (brand.goldenCircle) {
    brandMD += '# WHY \n\n**' + brand.goldenCircle.why + '**\n\n'
    brandMD += '# WHAT \n\n**' + brand.goldenCircle.what + '**\n\n'
    brandMD += '# HOW \n\n**' + brand.goldenCircle.how + '**\n\n'
  }
  if (brand.tone) {
    brandMD += '## Tone of Voice \n\n' + brand.tone.summary + '\n\n'
  }

  return brandMD
}
export function StoryPanel({ brand }: StoryPanelProps) {
  const [userBrand, setUserBrand] = React.useState<Brand>(brand)
  const [isLoading, setIsLoading] = React.useState(false)
  const [brandStory, setBrandStory] = React.useState('')
  // setBrandStory(createBrandSumation(brand))

  React.useEffect(() => {
    setUserBrand(brand)
    if (brand.story) {
      setBrandStory(brand.story)
    }
  }, [brand])

  const saveStory = async (newStory: string) => {
    setIsLoading(true)
    const updatedBrand = { ...userBrand, story: newStory }
    console.log('updB', updatedBrand.story)
    await saveBrand(updatedBrand, updatedBrand.id)
    setIsLoading(false)
  }

  const fetchStory = async () => {
    setIsLoading(true)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const res = await fetch(`${serverUrl}/api/brand/story`, {
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
    setBrandStory(json.text)

    console.log('got story')
    // const story = JSON.parse(json)
    // const updatedBrand = { ...userBrand, tone: tone as ToneOfVoice }
    // setUserBrand(prevVal => {
    //   return { ...prevVal, tone: tone as ToneOfVoice }
    // })
    // await saveBrand(updatedBrand, userBrand.userId)
    setIsLoading(false)
    saveStory(json.text)
  }
  return (
    <Panel title="Story">
      {typeof brandStory === 'string' && (
        <>
          <PanelText text={brandStory}></PanelText>
        </>
      )}
      <Button onClick={fetchStory}>
        {isLoading && (
          <>
            <LoaderIcon></LoaderIcon>&nbsp;
          </>
        )}
        Generate Story
      </Button>
      {/* <Button onClick={saveStory}>
        {isLoading && (
          <>
            <LoaderIcon></LoaderIcon>&nbsp;
          </>
        )}
        Save Story
      </Button> */}
    </Panel>
  )
}
