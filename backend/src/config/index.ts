import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),
  OLLAMA_LLM_MODEL: z.string().default('llama3'),
  OLLAMA_EMBED_MODEL: z.string().default('nomic-embed-text'),

  CHROMA_URL: z.string().default('http://localhost:8000'),

  OPENAI_API_KEY: z.string().optional(),
  COHERE_API_KEY: z.string().optional(),
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = parsed.data