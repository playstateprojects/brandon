import { AnonymousMessage, BrandProperty } from '../../../../lib/types'
import { Configuration, OpenAIApi } from 'openai-edge'
import goldenCircleExample from '@/lib/json-examples/golden-circle.json'
import { auth } from '@/auth'
import { getBrand } from '@/app/actions'
import { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

type ApiResponse = {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

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
  const brand = await getBrand(userId)
  let prompt = `As a JSON API, you will receive a JSON object consisting of a set of questions and answers describing a brand. 
        Using this information, your task is to generate a brand’s golden circle according to Simon Sinek’s framework, namely the 'Why?', 'How?', and 'What?'`
  if (brand && brand.archetypeData) {
    prompt +=
      'You will output three different responses formatted as a JSON array of objects. Each object will follow this structure:'
    prompt += JSON.stringify(goldenCircleExample)
    prompt += `
    Responses for all object will be litted to 250 charchters.
    For the first object in the response, adopt a neutral, professional tone. 
      For the second object, embody the tone and perspective of the Jungian archetype persona as defined by the following JSON:
      `
    prompt += JSON.stringify(brand.archetypeData)
    prompt += `
      Please note that the archetype descriptions will guide the tone and perspective of your response.
        For the third object, adopt the persona and voice of Simon Sinek.
        Return only a JSON object structured as shown above.`
  }

  const systemMessage: AnonymousMessage = {
    content: prompt,
    role: 'system'
  }
  const userMessage: AnonymousMessage = {
    content: propertiesJSON,
    role: 'user'
  }
  const messages = [systemMessage, userMessage]
  const result: Response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.8,
    stream: false
  })
  //TODO: cleanup the response and make sure we get the expected object returned, save the id etc.
  // Ensure result.json().choices and result.json().choices[0].message.content exist before returning
  const res = await result.json()
  console.log(res)
  const jsonResult: ApiResponse = res
  console.log(jsonResult)
  // Ensure jsonResult.choices and jsonResult.choices[0].message.content exist before returning
  if (
    jsonResult &&
    jsonResult.choices &&
    jsonResult.choices[0].message.content
  ) {
    return NextResponse.json(jsonResult.choices[0].message.content, {
      status: 200
    })
  } else {
    // Handle the case where data isn't as expected
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
