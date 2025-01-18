'use client'

import { TextInput, PasswordInput, Button, Stack, Container, Title } from '@mantine/core'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error) {
      router.push('/dashboard')
    }
  }

  return (
    <Container size="xs" mt="xl">
      <Title order={2} ta="center" mb="xl">Login to FlashRank</Title>
      <form onSubmit={handleLogin}>
        <Stack>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Container>
  )
}
