'use client'

import { TextInput, Textarea, Switch, Button, Stack } from '@mantine/core'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function DeckForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { data, error } = await supabase
      .from('decks')
      .insert([
        {
          title,
          description,
          is_public: isPublic,
          user_id: user.id
        }
      ])
      .select()

    if (!error && data) {
      router.push(`/dashboard/decks/${data[0].id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Deck Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Switch
          label="Make deck public"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.currentTarget.checked)}
        />
        <Button type="submit">Create Deck</Button>
      </Stack>
    </form>
  )
}
