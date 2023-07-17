'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { ArchetypeData, Brand, BrandProperty, type Chat } from '@/lib/types'
import { nanoid } from 'nanoid'

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
  if (isSavingBrand) return
  try {
    isSavingBrand = true
    const payload = {
      ...brand,
      userId
    }
    console.log('sbran', brand)
    await kv.hmset(`brand:${userId}`, payload)
  } catch (error) {
    throw new Error('Failed to save brand')
  } finally {
    isSavingBrand = false
  }
}

export async function getBrand(userId: string): Promise<Brand | null> {
  try {
    const brandData = await kv.hgetall(`brand:${userId}`)

    if (brandData) {
      console.log('gjhfbdsjfhkb', brandData)
      // Create a new Brand object using the retrieved data
      const brand: Brand = {
        id: brandData.id as string,
        createdAt: brandData.createdAt as Date,
        properties: brandData.properties as BrandProperty[],
        archetypeData: brandData.archetypeData as ArchetypeData,
        userId
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
