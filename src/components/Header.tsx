'use client'

import { Group, Button, Text, Container } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function Header() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.role === 'admin')
      }
    }

    checkAdminStatus()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Container size="lg">
        <Group justify="space-between" h={60}>
          <Group>
            <Text
              component={Link}
              href="/dashboard"
              size="xl"
              fw={700}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              FlashRank
            </Text>
            <Button variant="subtle" component={Link} href="/dashboard">
              Dashboard
            </Button>
            {isAdmin && (
              <Button variant="subtle" component={Link} href="/admin">
                Admin
              </Button>
            )}
          </Group>

          <Group>
            <Button variant="subtle" component={Link} href="/profile">
              Profile
            </Button>
            <Button variant="light" onClick={handleLogout}>
              Logout
            </Button>
          </Group>
        </Group>
      </Container>
    </header>
  )
}
