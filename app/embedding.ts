import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import Bottleneck from 'bottleneck'

export async function embed(text: string): Promise<void> {
  const embedder = new OpenAIEmbeddings({
    modelName: 'gpt-3.5-turbo'
  })
  const limiter = new Bottleneck({
    minTime: 50
  })
}
