'use client'

import * as React from 'react'
import { Brand } from '@/lib/types'
import { IconSpinner } from './ui/icons'
import ArchetypePieChart from './archetype-pie-chart'
import { BrandArchetype } from './brand-archetype'
import { BrandGoldenCircle } from './brand-golden-circle'

type BrandResultsProps = {
  brand: Brand
}

export function BrandResults({ brand }: BrandResultsProps) {
  return (
    <>
      {brand && <BrandGoldenCircle brand={brand}></BrandGoldenCircle>}
      {brand && brand.archetypeData && (
        <BrandArchetype archetypeData={brand.archetypeData}></BrandArchetype>
      )}
    </>
  )
}
