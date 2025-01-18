'use client'

import { Table, Switch, Text, Group } from '@mantine/core'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Deck {
  id: string
  title: string
  created_at: string
  is_featured: boolean
  user_email: string
}

interface FeaturedDecksProps {
  decks: Deck[]
  onUpdate: () => void
}

export function FeaturedDecks({ decks, onUpdate }: FeaturedDecksProps) {
  const [loading, setLoading] = useState(false)

  const handleToggleFeatured = async (deckId: string, featured: boolean) => {
    setLoading(true)
    await supabase
      .from('decks')
      .update({ is_featured: featured })
      .eq('id', deckId)
    onUpdate()
    setLoading(false)
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>Creator</Table.Th>
          <Table.Th>Created</Table.Th>
          <Table.Th>Featured</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {decks.map((deck) => (
          <Table.Tr key={deck.id}>
            <Table.Td>{deck.title}</Table.Td>
            <Table.Td>{deck.user_email}</Table.Td>
            <Table.Td>
              {new Date(deck.created_at).toLocaleDateString()}
            </Table.Td>
            <Table.Td>
              <Switch
                checked={deck.is_featured}
                onChange={(event) => 
                  handleToggleFeatured(deck.id, event.currentTarget.checked)
                }
                disabled={loading}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
