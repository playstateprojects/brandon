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
          <section className="max-w-md mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-4">Brand persona</h2>

              {brand.archetypeData.archetypes.map((archetype, index) => (
                <React.Fragment key={index}>
                  <h3 className="text-2xl font-bold">
                    {archetype.title} {archetype.weight}
                  </h3>
                  <p className="mb-4">{archetype.explanation}</p>
                </React.Fragment>
              ))}
            </div>
            <ArchetypePieChart data={brand.archetypeData} />
          </section>
        </>
      ) : (
        <IconSpinner className="mr-2 animate-spin" />
      )}
    </>
  )
}
