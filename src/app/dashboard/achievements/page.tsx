'use client'

import { Container, Title, Grid, Text } from '@mantine/core'
import { Header } from '@/components/Header'
import { StreakTracker } from '@/components/StreakTracker'
import { BadgeDisplay } from '@/components/BadgeDisplay'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserStreak, Badge, UserBadge } from '@/types/achievements'

export default function Achievements() {
  const [streak, setStreak] = useState<UserStreak | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch streak
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (streakData) setStreak(streakData)

      // Fetch all badges
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*')
      
      if (badgesData) setBadges(badgesData)

      // Fetch earned badges
      const { data: earnedData } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', user.id)
      
      if (earnedData) setEarnedBadges(earnedData)
    }

    fetchData()
  }, [])

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Title mb="xl">Achievements</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <StreakTracker
              currentStreak={streak?.current_streak || 0}
              longestStreak={streak?.longest_streak || 0}
            />
          </Grid.Col>
          
          <Grid.Col span={12}>
            <Text size="lg" fw={500} mb="md">Badges</Text>
            <BadgeDisplay
              earnedBadges={earnedBadges}
              availableBadges={badges}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}
