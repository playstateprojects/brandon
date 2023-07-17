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
          <section>
            <div>
              <h2>Brand persona</h2>

              {brand.archetypeData.archetypes.map((archetype, index) => (
                <React.Fragment key={index}>
                  <h3>
                    {archetype.title} {archetype.weight}
                  </h3>
                  <p>{archetype.explanation}</p>
                </React.Fragment>
              ))}
            </div>
          </section>
          <ArchetypePieChart data={brand.archetypeData} />
        </>
      ) : (
        <IconSpinner className="mr-2 animate-spin" />
      )}
    </>
  )
}
