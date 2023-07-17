'use client'

import * as React from 'react'
import { ArchetypeData, Brand } from '@/lib/types'
import { BrandResults } from './BrandResults'
import { saveBrand } from '@/app/actions'
import { BrandForm } from './brand-form'
import ArchetypePieChart from './archetype-pie-chart'

type BrandManagerProps = {
  brand: Brand | null
}
export function BrandGuide({ brand }: BrandManagerProps) {
  if (!brand) {
    brand = {
      id: '1',
      userId: '1',
      createdAt: new Date()
    }
  }
  const [userBrand, setUserBrand] = React.useState<Brand>(brand)
  return <>{brand && <BrandResults brand={userBrand} />}</>
}
