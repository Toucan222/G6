'use client'

import { Container, Title, TextInput, Button, Stack, Paper } from '@mantine/core'
import { Header } from '@/components/Header'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setName(user.user_metadata.name || '')
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleUpdateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name }
    })

    if (!error) {
      // Show success notification here
    }
  }

  if (loading) {
    return null
  }

  return (
    <>
      <Header />
      <Container size="sm" mt="xl">
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={2}>Profile Settings</Title>
            
            <TextInput
              label="Email"
              value={email}
              disabled
            />
            
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <Button onClick={handleUpdateProfile}>
              Update Profile
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  )
}
