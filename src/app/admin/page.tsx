'use client'

import { Container, Title, Tabs, Paper } from '@mantine/core'
import { IconUsers, IconCards } from '@tabler/icons-react'
import { Header } from '@/components/Header'
import { StatsOverview } from '@/components/admin/StatsOverview'
import { UsersTable } from '@/components/admin/UsersTable'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

interface UserProfile {
  id: string
  user_id: string
  email: string
  role: string
  created_at: string
  last_sign_in: string | null
  subscription_status?: string
}

type ProfileWithSubscription = Database['public']['Tables']['profiles']['Row'] & {
  subscriptions: Array<{ status: string }> | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0
  })
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('last_sign_in', sevenDaysAgo.toISOString())

    // Get premium users
    const { count: premiumUsers } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    setStats({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      premiumUsers: premiumUsers || 0
    })

    // Fetch profiles with subscriptions
    const { data: profileData } = await supabase
      .from('profiles')
      .select(`
        *,
        subscriptions (
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (profileData) {
      // Get user emails from auth.users using admin API
      const { data: { users: authUsers } } = await supabase.auth.admin.listUsers()
      
      // Create email lookup map
      const emailMap = new Map(authUsers?.map(user => [user.id, user.email]) || [])

      const formattedUsers: UserProfile[] = (profileData as ProfileWithSubscription[]).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        email: emailMap.get(profile.user_id) || 'N/A',
        role: profile.role,
        created_at: profile.created_at,
        last_sign_in: profile.last_sign_in,
        subscription_status: profile.subscriptions?.[0]?.status
      }))
      
      setUsers(formattedUsers)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return null

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Title mb="xl">Admin Dashboard</Title>

        <StatsOverview {...stats} />

        <Paper mt="xl">
          <Tabs defaultValue="users">
            <Tabs.List>
              <Tabs.Tab 
                value="users" 
                leftSection={<IconUsers size={16} />}
              >
                Users
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="users" pt="md">
              <UsersTable users={users} onUpdate={fetchData} />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Container>
    </>
  )
}
