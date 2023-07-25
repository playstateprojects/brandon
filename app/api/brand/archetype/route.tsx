import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { AnonymousMessage, BrandProperty } from '../../../../lib/types'
import { Configuration, OpenAIApi } from 'openai-edge'
import { nanoid } from '@/lib/utils'
import personaExample from '@/lib/json-examples/persona-example.json'
import archtypes from '@/lib/archetypes.json'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@/auth'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const properties: BrandProperty[] = json
  const propertiesJSON = JSON.stringify(
    properties.map(property => {
      return { question: property.description, answer: property.value }
    })
  )
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  let prompt = `You are a JSON API and will be sent a json object of questions and answer which describe a brand.'
    Recomended jungian archetypes that this brand could adopt that would express its values and differentiate it from its competitors.
    use the following JSON as the definition for the archetypes from which you can choose.`
  prompt += JSON.stringify(archtypes)

  prompt +=
    'you will respond with only a json object that follows the following format:'
  prompt += JSON.stringify(personaExample)
  const systemMessage: AnonymousMessage = {
    content: prompt,
    role: 'system'
  }
  const userMessage: AnonymousMessage = {
    content: propertiesJSON,
    role: 'user'
  }
  const messages = [systemMessage, userMessage]
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: false
  })
  //TODO: cleanup the response and make sure we get the expected object returned, save the id etc.
  return res
}
