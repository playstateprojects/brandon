'use client'

import * as React from 'react'
import { Brand } from '@/lib/types'
import { BrandResults } from './BrandResults'
import { saveBrand } from '@/app/actions'
import { BrandForm } from './brand-form'

type BrandManagerProps = {
  brand: Brand | null
}
export function BrandManager({ brand }: BrandManagerProps) {
  const [formSubmitted, setFormSubmitted] = React.useState(false)
  if (!brand) {
    brand = {
      id: '1',
      userId: '1',
      createdAt: new Date()
    }
  }
  const [userBrand, setUserBrand] = React.useState<Brand>(brand)

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
          console.log('data r', data)
          if (
            data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content
          ) {
            const content = JSON.parse(data.choices[0].message.content)

            setUserBrand(prevValue => {
              return { ...prevValue, archetypeData: content }
            })
            await saveBrand({ ...brand, archetypeData: content }, brand.userId)
          } else {
            alert('something went wrong!')
          }
        })
    }

    await saveBrand(brand, brand.userId)

    setFormSubmitted(true)
  }

  return (
    <>
      {brand &&
        (formSubmitted ? (
          <BrandResults brand={userBrand}></BrandResults>
        ) : (
          <BrandForm
            userBrand={brand}
            onFormSubmit={formSubmitHandler}
          ></BrandForm>
        ))}
    </>
  )
}
