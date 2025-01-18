import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateCardSummary(
  title: string,
  facts: string[],
  scoreboard: Record<string, number>
) {
  const prompt = `
Summarize this trading card data in a concise, engaging way:

Title: ${title}
Quick Facts: ${facts.join(', ')}
Scores: ${Object.entries(scoreboard)
  .map(([key, value]) => `${key}: ${value}`)
  .join(', ')}

Provide a 2-3 sentence summary highlighting the most interesting aspects.
`

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.7
  })

  return response.choices[0].message.content
}

export async function suggestLabels(
  title: string,
  description: string
): Promise<string[]> {
  const prompt = `
Analyze this card's information and suggest 3-5 relevant labels/tags:

Title: ${title}
Description: ${description}

Provide only the labels, separated by commas, no explanations.
`

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 50,
    temperature: 0.5
  })

  return response.choices[0].message.content?.split(',').map(label => label.trim()) || []
}
