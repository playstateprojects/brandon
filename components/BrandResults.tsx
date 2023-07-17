'use client'

import * as React from 'react'
import { Brand } from '@/lib/types'
import { IconSpinner } from './ui/icons'
import ArchetypePieChart from './archetype-pie-chart'

type BrandResutlsProps = {
  brand?: Brand
}

export function BrandResults({ brand }: BrandResutlsProps) {
  return (
    <>
      {brand && brand.archetypeData ? (
        <>
          <h1>got data</h1>
          <ArchetypePieChart data={brand.archetypeData} />
        </>
      ) : (
        <IconSpinner className="mr-2 animate-spin" />
      )}
    </>
  )
}
