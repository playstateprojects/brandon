import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage
} from 'langchain/schema'
import { PromptTemplate } from 'langchain/prompts'
import {
  AnonymousMessage,
  ApiResponse,
  BrandProperty
} from '../../../../lib/types'
import { Configuration, OpenAIApi } from 'openai-edge'
import personaExample from '@/lib/json-examples/persona-example.json'
import toneExample from '@/lib/json-examples/tone-of-Voice.json'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { APITemplate } from '../../api-template'
import { BaseLanguageModel } from 'langchain/base_language'

export const runtime = 'edge'

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// })

// const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const llm = new OpenAI()
  const template = 'What sound does the {animal} make?'
  const prompt = new PromptTemplate({
    template: APITemplate,
    inputVariables: ['userPrompt', 'responseFormat']
  })
  const chain = new LLMChain({ llm, prompt })
  const response = await chain.call({
    userPrompt:
      'generate a compelling brand story for a brand set to disrupt advertising by providing ai brandmanagement',
    responseFormat: "{story:'a string of about 500 charachters'}"
  })
  return NextResponse.json(response, {
    status: 200
  })
}
