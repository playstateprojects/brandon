import { type Message } from 'ai'

export interface AnonymousMessage {
  id?: string
  createdAt?: Date | undefined
  content: string
  role: 'system' | 'user' | 'assistant'
}
export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: AnonymousMessage[]
  sharePath?: string
}
export enum CreatedBy {
  User = 'user',
  System = 'system'
}
export interface BrandProperty {
  id?: string
  createdAt: Date
  description: string
  value?: string
  createdBy: CreatedBy
}
export interface Brand {
  id: string
  createdAt: Date
  userId: string
  properties?: BrandProperty[]
  archetypeData?: ArchetypeData
  goldenCircle?: GoldenCircle
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Archetype {
  title: string
  weight: number
  explanation: string
}

export interface Trait {
  title: string
  weight: number
}

export interface ArchetypeData {
  archetypes: Archetype[]
  traits: Trait[]
}

export interface GoldenCircle {
  why: string
  what: string
  how: string
}
