import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { getBrand } from '@/app/actions'
import { AnonymousMessage } from '@/lib/types'
import { PineconeClient } from '@pinecone-database/pinecone'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { templates } from '@/app/templates'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { getMatchesFromEmbeddings } from '@/app/matches'

export const runtime = 'edge'

let pinecone: PineconeClient | null = null

const initPineconeClient = async () => {
  pinecone = new PineconeClient()
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!
  })
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
//TODO: do we need both?
const openai = new OpenAIApi(configuration)
const model = new OpenAI({ temperature: 0.7 })

export async function POST(req: Request) {
  if (!pinecone) {
    await initPineconeClient()
  }
  const json = await req.json()
  const { messages, previewToken } = json
  const messagesArray = messages as AnonymousMessage[]
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  const brand = await getBrand(userId)
  const hasSystemMessage = messagesArray.find((msg: AnonymousMessage) => {
    return msg.role == 'system'
  })
  console.log('hs', hasSystemMessage)
  if (brand && !hasSystemMessage) {
    // console.log('persona', brand)
    const systemMessage: AnonymousMessage = {
      content:
        'You should adopt the persona of a brand. The brand can be described by the following JSON' +
        JSON.stringify(brand) +
        'all your responses should take the brand information into account and text should be generated in accordance of this brands identity and best interest',
      role: 'system'
    }
    messages.unshift(systemMessage)
  }
  //TODO:WHAT IS THE PREVIEW TOKEN?

  if (previewToken) {
    console.log('previewToken', previewToken)
    configuration.apiKey = previewToken
  }
  // Build an LLM chain that will improve the user prompt
  const inquiryChain = new LLMChain({
    llm: model,
    prompt: new PromptTemplate({
      template: templates.inquiryTemplate,
      inputVariables: ['userPrompt', 'conversationHistory']
    })
  })
  const inquiryChainResult = await inquiryChain.call({
    userPrompt: messagesArray[messagesArray.length - 1].content,
    conversationHistory: messagesArray.map(msg => {
      return (
        `speaker: ` +
        msg.role +
        `
              ` +
        msg.content
      )
    })
  })
  const inquiry = inquiryChainResult.text

  console.log(inquiry)

  // console.log(inquiry)

  // // Embed the user's intent and query the Pinecone index
  const embedder = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002'
  })

  const embeddings = await embedder.embedQuery(inquiry)
  // channel.publish({
  //   data: {
  //     event: 'status',
  //     message: 'Finding matches...'
  //   }
  // })

  const matches = await getMatchesFromEmbeddings(embeddings, pinecone!, 2)
  console.log('matches-----', matches)
  //TODO: handle: This model's maximum context length is 4097 tokens. However, your messages resulted in 4112 tokens. Please reduce the length of the messages.
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
