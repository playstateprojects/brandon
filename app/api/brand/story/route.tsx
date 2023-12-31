import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'

import { PromptTemplate } from 'langchain/prompts'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { templates } from '@/app/templates'
import { BaseLanguageModel } from 'langchain/base_language'
import { createBrandSumation, getBrand } from '@/app/actions'

export const runtime = 'edge'

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// })

// const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  const brand = await getBrand(userId)
  const llm = new OpenAI()
  const prompt = new PromptTemplate({
    template: templates.storyTemplate,
    inputVariables: ['brandDetails']
  })
  const chain = new LLMChain({ llm, prompt })
  const fullStory = createBrandSumation(brand)
  const response = await chain.call({
    userPrompt: templates.storyTemplate,
    brandDetails: fullStory
  })
  return NextResponse.json(response, {
    status: 200
  })
}
