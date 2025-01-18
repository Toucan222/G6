'use client'

import { Container, Title, Text, Button, Group, SimpleGrid, Modal, Tabs } from '@mantine/core'
import { IconCards, IconTable } from '@tabler/icons-react'
import { Header } from '@/components/Header'
import { CardViewer } from '@/components/CardViewer'
import { CardForm } from '@/components/CardForm'
import { DeckTable } from '@/components/DeckTable'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, Deck } from '@/types/deck'
import { useParams } from 'next/navigation'

export default function DeckView() {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [showCardForm, setShowCardForm] = useState(false)
  const params = useParams()

  const fetchCards = async () => {
    const { data } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', params.id)
    
    if (data) setCards(data)
  }

  useEffect(() => {
    const fetchDeck = async () => {
      const { data: deck } = await supabase
        .from('decks')
        .select('*')
        .eq('id', params.id)
        .single()

      if (deck) {
        setDeck(deck)
        fetchCards()
      }
    }
    fetchDeck()
  }, [params.id])

  const handleCardComplete = () => {
    setShowCardForm(false)
    fetchCards()
  }

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
          <Button onClick={() => setShowCardForm(true)}>Add Card</Button>
        </Group>

        <Tabs defaultValue="cards">
          <Tabs.List mb="md">
            <Tabs.Tab value="cards" leftSection={<IconCards size={16} />}>
              Cards View
            </Tabs.Tab>
            <Tabs.Tab value="table" leftSection={<IconTable size={16} />}>
              Table View
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="cards">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {cards.map((card) => (
                <CardViewer key={card.id} card={card} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="table">
            <DeckTable cards={cards} />
          </Tabs.Panel>
        </Tabs>

        <Modal
          opened={showCardForm}
          onClose={() => setShowCardForm(false)}
          title="Add New Card"
          size="xl"
        >
          <CardForm deckId={params.id as string} onComplete={handleCardComplete} />
        </Modal>
      </Container>
    </>
  )
}
