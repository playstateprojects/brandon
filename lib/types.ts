import { type Message} from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export interface BrandProperty{
  id: string
  createdAt:Date
  text: string
  value: number
}
export interface Brand{
  id: string
  createdAt: Date
  userId: string
  path: string
  props: BrandProperty[]
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>
