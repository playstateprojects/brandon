'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import {
  ArchetypeData,
  Brand,
  BrandProperty,
  GoldenCircle,
  type Chat,
  ToneOfVoice
} from '@/lib/types'
import { nanoid } from 'nanoid'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { TokenTextSplitter } from 'langchain/text_splitter'
import Bottleneck from 'bottleneck'
import { PineconeClient, Vector } from '@pinecone-database/pinecone'

let pinecone: PineconeClient | null = null

const pineconeIndexName = process.env.PINECONE_INDEX_NAME!

const initPineconeClient = async () => {
  pinecone = new PineconeClient()
  console.log('init pinecone')
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!
  })
}
initPineconeClient()
export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  const uid = await kv.hget<string>(`chat:${id}`, 'userId')

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(chat: Chat) {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== chat.userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}
let isSavingBrand = false
export async function saveBrand(brand: Brand, userId: string): Promise<void> {
  if (isSavingBrand) {
    console.log('saving.....')
    return
  }
  try {
    isSavingBrand = true
    const payload = {
      ...brand,
      userId
    }
    let res = await kv.hmset(`brand:${userId}`, payload)
    embedBrand(brand)
  } catch (error) {
    throw new Error('Failed to save brand')
  } finally {
    isSavingBrand = false
  }
}

export async function getBrand(userId: string): Promise<Brand> {
  try {
    const brandData = await kv.hgetall(`brand:${userId}`)

    if (brandData) {
      // Create a new Brand object using the retrieved data
      const brand: Brand = {
        id: brandData.id as string,
        createdAt: brandData.createdAt as Date,
        properties: brandData.properties as BrandProperty[],
        archetypeData: brandData.archetypeData as ArchetypeData,
        goldenCircle: brandData.goldenCircle as GoldenCircle,
        tone: brandData.tone as ToneOfVoice,
        userId: userId as string
      }
      return brand
    }
    const newBrand: Brand = {
      id: nanoid(),
      createdAt: new Date(),
      properties: [],
      userId: userId
    }
    return newBrand
  } catch (error) {
    console.log(error)
    const newBrand: Brand = {
      id: nanoid(),
      createdAt: new Date(),
      properties: [],
      userId: userId
    }
    return newBrand
    // throw new Error('Failed to retrieve brand')
  }
}

const sliceIntoChunks = (arr: Vector[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  )
}

export async function embedBrand(brand: Brand) {
  const documentMeta = { type: 'brand', brandId: brand.id }
  const brandDoc = new Document({
    pageContent: JSON.stringify(brand),
    metadata: documentMeta
  })
  const embedder = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002'
  })
  const splitter = new TokenTextSplitter({
    encodingName: 'gpt2',
    chunkSize: 300,
    chunkOverlap: 20
  })
  const limiter = new Bottleneck({
    minTime: 50
  })

  const docs = await splitter.splitDocuments([brandDoc])
  let counter = 0
  const getEmbedding = async (doc: Document) => {
    const embedding = await embedder.embedQuery(doc.pageContent)
    console.log('got embedding', embedding.length)

    counter = counter + 1
    return {
      id: nanoid(),
      values: embedding,
      metadata: {
        ...documentMeta,
        page: counter,
        chunk: doc.pageContent
      }
    }
  }
  const rateLimitedGetEmbedding = limiter.wrap(getEmbedding)

  let vectors = [] as Vector[]
  const index = pinecone && pinecone.Index(pineconeIndexName)

  //this is for debugging only:
  // let description = await index!.describeIndexStats({
  //   describeIndexStatsRequest: {}
  // })
  // console.log('------', description)
  //------------------------------------------
  //TODO: this just gets the vectors to Delete in Production we should track vector ID's and manage them ellegantly
  const brandVectors = await index!.query({
    queryRequest: {
      topK: 100,
      vector: new Array(1536).fill(1),
      includeMetadata: true,
      filter: {
        $and: [{ type: { $eq: 'brand' } }, { brandId: { $eq: brand.id } }]
      }
    }
  })

  const brandVectorIds = brandVectors.matches?.map(vector => vector.id)
  if (brandVectorIds)
    await index?._delete({ deleteRequest: { ids: brandVectorIds } })
  //this is for debugging only:
  // description = await index!.describeIndexStats({
  //   describeIndexStatsRequest: {}
  // })
  // console.log('------', description)
  try {
    //the vectors come back from openAI with an ID that is then used as the ID in PineCone keep track of them in theto save work and or delete them.
    vectors = (await Promise.all(
      docs.flat().map(doc => rateLimitedGetEmbedding(doc))
    )) as unknown as Vector[]
    const chunks = sliceIntoChunks(vectors, 10)
    try {
      await Promise.all(
        chunks.map(async chunk => {
          await index!.upsert({
            upsertRequest: {
              vectors: chunk as Vector[],
              namespace: ''
            }
          })
        })
      )
    } catch (e) {
      console.log(e)
    }
  } catch (e) {
    console.log(e)
  }
  // console.log(res)
}
