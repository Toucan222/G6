'use client'

import { SimpleGrid, Paper, Text, Group, ThemeIcon, Tooltip } from '@mantine/core'
import { IconTrophy, IconLock } from '@tabler/icons-react'
import { Badge, UserBadge } from '@/types/achievements'

interface BadgeDisplayProps {
  earnedBadges: UserBadge[]
  availableBadges: Badge[]
}

export function BadgeDisplay({ earnedBadges, availableBadges }: BadgeDisplayProps) {
  const isEarned = (badgeId: string) => 
    earnedBadges.some(earned => earned.badge_id === badgeId)

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
      {availableBadges.map((badge) => {
        const earned = isEarned(badge.id)
        
        return (
          <Tooltip
            key={badge.id}
            label={earned ? 'Earned!' : `Earn this by: ${badge.description}`}
          >
            <Paper shadow="sm" p="md" radius="md" style={{ opacity: earned ? 1 : 0.6 }}>
              <Group>
                <ThemeIcon
                  size="lg"
                  color={earned ? 'yellow' : 'gray'}
                  variant={earned ? 'filled' : 'light'}
                >
                  {earned ? <IconTrophy size={20} /> : <IconLock size={20} />}
                </ThemeIcon>
                <div>
                  <Text fw={500}>{badge.name}</Text>
                  <Text size="xs" c="dimmed">
                    {badge.requirement_type === 'streak' 
                      ? `${badge.requirement_value} day streak`
                      : badge.requirement_type === 'cards_created'
                      ? `Create ${badge.requirement_value} cards`
                      : `Create ${badge.requirement_value} decks`}
                  </Text>
                </div>
              </Group>
            </Paper>
          </Tooltip>
        )
      })}
    </SimpleGrid>
  )
}
