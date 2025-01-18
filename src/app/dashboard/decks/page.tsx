'use client'

import { Container, Title, SimpleGrid, Button, Group } from '@mantine/core'
import { Header } from '@/components/Header'
import { DeckForm } from '@/components/DeckForm'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Deck } from '@/types/deck'
import Link from 'next/link'

export default function Decks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchDecks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('decks')
          .select('*')
          .eq('user_id', user.id)
        
        if (data) setDecks(data)
      }
    }
    fetchDecks()
  }, [])

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Group justify="space-between" mb="xl">
          <Title>My Decks</Title>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create New Deck'}
          </Button>
        </Group>

        {showForm && <DeckForm />}

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mt="xl">
          {decks.map((deck) => (
            <Link 
              key={deck.id} 
              href={`/dashboard/decks/${deck.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Button variant="light" fullWidth>
                {deck.title}
              </Button>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}
