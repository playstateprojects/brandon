import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
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

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const traits: string[] = json

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  let prompt = `You are a JSON API and will be sent a json object representing the personality traits of a brand. 
    You will describe a charachterful and engage tone of voice that represents the brand.The following list describes the aspects that will go into your description:
    Language: This is about the words you choose. A brand catering to a young audience might use trendy slang and emojis, while a brand aiming for a sophisticated audience might use more complex language and technical jargon. It's about speaking the language of your target audience.

    Rhythm and Pace: Just like a good conversation, good copy has a rhythm to it. Short sentences can make your copy feel fast-paced and energetic, while longer sentences can slow the pace down and create a more thoughtful or relaxed mood.

    Humor: Depending on your brand's personality, humor might be a big part of your tone of voice. Some brands use wit and humor to engage their audience and make their copy more memorable.

    Formality: Some brands might use a very formal, professional tone, while others might adopt a more casual, friendly tone. This usually depends on the nature of your business and the expectations of your audience.

    Empathy: Good copy often connects with the reader on an emotional level. Showing understanding and empathy for your audience's problems and aspirations can make your brand feel more human and relatable.

    Storytelling: Sometimes, a brand's tone of voice might involve a lot of storytelling, using narrative techniques to engage the reader and make the copy more compelling.
    
    You will respond with only a json object that follows the following format:`
  prompt += JSON.stringify(toneExample)

  const systemMessage: AnonymousMessage = {
    content: prompt,
    role: 'system'
  }
  const userMessage: AnonymousMessage = {
    content: JSON.stringify(traits),
    role: 'user'
  }
  const messages = [systemMessage, userMessage]
  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: false
  })
  //TODO: cleanup the response and make sure we get the expected object returned, save the id etc.
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
