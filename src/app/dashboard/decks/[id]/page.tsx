'use client'

import { Container, Title, Text, Button, Group, SimpleGrid, Modal } from '@mantine/core'
import { Header } from '@/components/Header'
import { CardViewer } from '@/components/CardViewer'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

interface Deck {
  id: string
  title: string
  description: string
  created_at: string
  user_id: string
  is_public: boolean
}

interface Card {
  id: string
  title: string
  image_url?: string
  quick_facts: string[]
  scoreboard: Record<string, number>
  content_blocks: {
    text?: string
    link?: string
    audio_url?: string
  }[]
}

export default function DeckView() {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const params = useParams()

  useEffect(() => {
    const fetchDeck = async () => {
      const { data: deck } = await supabase
        .from('decks')
        .select('*')
        .eq('id', params.id)
        .single()

      if (deck) {
        setDeck(deck)
        
        const { data: cards } = await supabase
          .from('cards')
          .select('*')
          .eq('deck_id', deck.id)
        
        if (cards) setCards(cards)
      }
    }
    fetchDeck()
  }, [params.id])

  if (!deck) return null

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title>{deck.title}</Title>
            <Text c="dimmed">{deck.description}</Text>
          </div>
          <Button>Add Card</Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {cards.map((card) => (
            <CardViewer key={card.id} card={card} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}
