'use client'

import { SimpleGrid, Paper, Text, Group, RingProgress } from '@mantine/core'
import { IconUsers, IconCrown, IconActivity } from '@tabler/icons-react'

interface StatsOverviewProps {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
}

export function StatsOverview({ totalUsers, activeUsers, premiumUsers }: StatsOverviewProps) {
  const activeRate = totalUsers ? (activeUsers / totalUsers) * 100 : 0
  const premiumRate = totalUsers ? (premiumUsers / totalUsers) * 100 : 0

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
      <Paper withBorder radius="md" p="md">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color: 'blue' }]}
            label={<IconUsers size={20} />}
          />
          <div>
            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
              Total Users
            </Text>
            <Text fw={700} size="xl">
              {totalUsers}
            </Text>
          </div>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: activeRate, color: 'green' }]}
            label={<IconActivity size={20} />}
          />
          <div>
            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
              Active Users
            </Text>
            <Text fw={700} size="xl">
              {activeUsers}
            </Text>
          </div>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: premiumRate, color: 'yellow' }]}
            label={<IconCrown size={20} />}
          />
          <div>
            <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
              Premium Users
            </Text>
            <Text fw={700} size="xl">
              {premiumUsers}
            </Text>
          </div>
        </Group>
      </Paper>
    </SimpleGrid>
  )
}
