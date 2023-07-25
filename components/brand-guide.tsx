'use client'

import * as React from 'react'
import { ArchetypeData, Brand } from '@/lib/types'
import { BrandResults } from './BrandResults'
import { saveBrand } from '@/app/actions'
import { BrandForm } from './brand-form'
import ArchetypePieChart from './archetype-pie-chart'
import { BrandGoldenCircle } from './brand-golden-circle'
import { BrandArchetype } from './brand-archetype'
import { ToneBox } from './tone-box'

type BrandManagerProps = {
  brand: Brand
}
export function BrandGuide({ brand }: BrandManagerProps) {
  const [userBrand, setUserBrand] = React.useState<Brand>(brand)
  React.useEffect(() => {
    setUserBrand(brand)
  }, [brand])
  return (
    <>
      <ToneBox brand={userBrand}></ToneBox>
      <BrandGoldenCircle brand={userBrand}></BrandGoldenCircle>
      {userBrand.archetypeData && (
        <BrandArchetype
          archetypeData={userBrand.archetypeData}
        ></BrandArchetype>
      )}
    </>
  )
}
