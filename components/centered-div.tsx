'use client'
import * as React from 'react'

export interface CenteredDivProps {
    children?: React.ReactNode
  }

export function CenteredDiv({children}:CenteredDivProps) {
  return (
    // <div className="flex justify-center items-center min-h-screen">
    <div className="mt-4 flex items-center justify-center">
    {children}
  </div>
    )
}