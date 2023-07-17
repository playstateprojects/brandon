'use client'

import * as React from 'react'
import { BrandQuestions } from './brand-question'
import { Brand } from '@/lib/types'
import { BrandResults } from './BrandResults'
import { saveBrand } from '@/app/actions'
import { BrandForm } from './brand-form'

type BrandManagerProps = {
  brand: Brand | null
}
export function BrandManager({ brand }: BrandManagerProps) {
  const [formSubmitted, setFormSubmitted] = React.useState(false)
  const formSubmitHandler = async (brand: Brand) => {
    await saveBrand(brand, brand.userId)
    setFormSubmitted(true)
  }

  return (
    <>
      {brand &&
        (formSubmitted ? (
          <BrandResults></BrandResults>
        ) : (
          <BrandForm
            userBrand={brand}
            onFormSubmit={formSubmitHandler}
          ></BrandForm>
        ))}
    </>
  )
}
