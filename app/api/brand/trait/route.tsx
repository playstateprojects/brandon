import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { CreatedBy } from '@/lib/types'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { getBrand, saveBrand } from '@/app/actions'
import { templates } from '@/app/templates'

export const runtime = 'edge'

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// })

// const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const userId = (await auth())?.user.id
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  const data: { prompt: string; response: string } = await req.json()
  const brand = await getBrand(userId)
  const llm = new OpenAI()
  const prompt = new PromptTemplate({
    template: templates.traitTemplate,
    inputVariables: ['givenPrompt', 'givenResponse']
  })
  const chain = new LLMChain({ llm, prompt })
  const response = await chain.call({
    givenPrompt: data.prompt,
    givenResponse: data.response
  })
  console.log('----response-----\n', response.text)

  brand.properties!.push({
    description: response.text,
    value: data.response,
    createdAt: new Date(),
    createdBy: CreatedBy.User
  })
  await saveBrand(brand, userId)
  return NextResponse.json(JSON.parse(response.text), {
    status: 200
  })
}
