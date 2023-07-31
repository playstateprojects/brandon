import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { getBrand } from '@/app/actions'
import { AnonymousMessage } from '@/lib/types'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  const brand = await getBrand(userId)
  console.log('go')
  if (brand) {
    console.log('persona', brand)
    const systemMessage: AnonymousMessage = {
      content:
        'You should adopt the persona of a brand. The brand can be described by the following JSON' +
        brand +
        'all your responses should take the brand information into account and text should be generated in accordance of this brands identity and best interest',
      role: 'system'
    }
    messages.push(systemMessage)
    if (brand.goldenCircle) {
      const whyMessageQuestion: AnonymousMessage = {
        content: 'What is the core belief and guiding principle of the brand',
        role: 'user'
      }
      messages.push(whyMessageQuestion)
      const whyMessageAnswer: AnonymousMessage = {
        content: brand.goldenCircle.why,
        role: 'assistant'
      }
      messages.push(whyMessageAnswer)
      const whatMessageQuestion: AnonymousMessage = {
        content: 'What does Brandon do or sell?',
        role: 'user'
      }
      messages.push(whatMessageQuestion)
      const whatMessageAnswer: AnonymousMessage = {
        content: brand.goldenCircle.what,
        role: 'assistant'
      }
      messages.push(whatMessageAnswer)
      const howMessageQuestion: AnonymousMessage = {
        content: 'How does Brandon deliver value?',
        role: 'user'
      }
      messages.push(whatMessageQuestion)
      const howMessageAnswer: AnonymousMessage = {
        content: brand.goldenCircle.how,
        role: 'assistant'
      }
      messages.push(howMessageAnswer)
    }
  }
  if (previewToken) {
    configuration.apiKey = previewToken
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.6,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}
