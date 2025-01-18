import { generateCardSummary } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const { cardId, userId } = await req.json()

    // Rate limiting: 10 requests per hour per user
    const identifier = `explain-card-${userId}`
    const { success } = await rateLimit(identifier, 10, 3600)
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), 
        { status: 429 }
      )
    }

    // Get card data
    const { data: card } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single()

    if (!card) {
      return new Response(
        JSON.stringify({ error: 'Card not found' }), 
        { status: 404 }
      )
    }

    // Generate summary
    const summary = await generateCardSummary(
      card.title,
      card.quick_facts,
      card.scoreboard
    )

    // Store summary in cache
    await supabase
      .from('ai_summaries')
      .upsert({
        card_id: cardId,
        summary,
        generated_at: new Date().toISOString()
      })

    return new Response(JSON.stringify({ summary }), { status: 200 })
  } catch (error) {
    console.error('AI Summary error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate summary' }), 
      { status: 500 }
    )
  }
}
