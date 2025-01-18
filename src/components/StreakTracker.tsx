'use client'

import { Paper, Text, Group, RingProgress, Stack } from '@mantine/core'
import { IconFlame } from '@tabler/icons-react'

interface StreakTrackerProps {
  currentStreak: number
  longestStreak: number
}

export function StreakTracker({ currentStreak, longestStreak }: StreakTrackerProps) {
  return (
    <Paper shadow="sm" p="md" radius="md">
      <Group>
        <RingProgress
          size={80}
          thickness={8}
          sections={[{ value: (currentStreak / 30) * 100, color: 'orange' }]}
          label={
            <Group justify="center">
              <IconFlame size={20} style={{ color: 'orange' }} />
            </Group>
          }
        />
        
        <Stack gap="xs">
          <div>
            <Text size="xl" fw={700}>{currentStreak} days</Text>
            <Text size="sm" c="dimmed">Current Streak</Text>
          </div>
          <Text size="sm">Longest: {longestStreak} days</Text>
        </Stack>
      </Group>
    </Paper>
  )
}
