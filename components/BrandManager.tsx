'use client'

import * as React from 'react'
import { ArchetypeData, Brand } from '@/lib/types'
import { saveBrand } from '@/app/actions'
import { BrandForm } from './brand-form'
import { useRouter } from 'next/navigation'

type BrandManagerProps = {
  brand: Brand
}
export function BrandManager({ brand }: BrandManagerProps) {
  const router = useRouter()
  const formSubmitHandler = async (brand: Brand) => {
    if (brand.properties) {
      fetch('/api/brand/archetype', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brand.properties)
      })
        .then(response => response.json())
        .then(async data => {
          if (
            data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content
          ) {
            const content = JSON.parse(
              data.choices[0].message.content
            ) as ArchetypeData
            console.log('tone', content.archetypes[0].tone)
            console.log('tone', content)
            await saveBrand(
              {
                ...brand,
                archetypeData: content
              },
              brand.userId
            )

            router.push('/guide')
          } else {
            alert('something went wrong!')
          }
        })
    }

    // await saveBrand(brand, brand.userId)
    // router.push('/guide')
  }

  return (
    <>
      <BrandForm userBrand={brand} onFormSubmit={formSubmitHandler}></BrandForm>
    </>
  )
}
