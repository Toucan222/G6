import { suggestLabels } from '@/lib/openai'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const { title, description, userId } = await req.json()

    // Rate limiting: 20 requests per hour per user
    const identifier = `suggest-labels-${userId}`
    const { success } = await rateLimit(identifier, 20, 3600)
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), 
        { status: 429 }
      )
    }

    const labels = await suggestLabels(title, description)

    return new Response(JSON.stringify({ labels }), { status: 200 })
  } catch (error) {
    console.error('AI Labels error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate labels' }), 
      { status: 500 }
    )
  }
}
