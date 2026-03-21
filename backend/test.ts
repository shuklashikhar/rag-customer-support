import Groq from 'groq-sdk'
import dotenv from 'dotenv'
dotenv.config()

console.log('Key:', process.env.GROQ_API_KEY?.substring(0, 10) + '...')

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function test() {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'say hello' }],
    stream: false
  })
  console.log('Response:', response.choices[0].message.content)
}

test().catch(console.error)