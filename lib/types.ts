import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
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
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>
