'use client'

import { Container, Title, Text, Stack, Card, SimpleGrid } from '@mantine/core'
import { Header } from '@/components/Header'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    getUser()
  }, [])

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Stack>
          <Title>Welcome{userEmail ? `, ${userEmail}` : ''}</Title>
          <Text c="dimmed">Your FlashRank Dashboard</Text>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <Card shadow="sm" padding="lg">
              <Title order={3}>My Decks</Title>
              <Text mt="sm">Create and manage your flashcard decks</Text>
            </Card>
            
            <Card shadow="sm" padding="lg">
              <Title order={3}>Streak</Title>
              <Text mt="sm">Current streak: 0 days</Text>
            </Card>
            
            <Card shadow="sm" padding="lg">
              <Title order={3}>Progress</Title>
              <Text mt="sm">Track your learning progress</Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  )
}
