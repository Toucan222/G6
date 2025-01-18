'use client'

import { Card, Text, Button, List, Group, Badge } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  priceId?: string
  popular?: boolean
  onSubscribe?: (priceId: string) => void
  loading?: boolean
}

export function PricingCard({
  title,
  price,
  features,
  priceId,
  popular,
  onSubscribe,
  loading
}: PricingCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={500}>{title}</Text>
        {popular && <Badge color="blue">Most Popular</Badge>}
      </Group>

      <Text size="xl" fw={700} mb="md">
        {price}
      </Text>

      <List
        spacing="sm"
        size="sm"
        mb="xl"
        center
        icon={<IconCheck size={16} style={{ color: 'var(--mantine-color-blue-filled)' }} />}
      >
        {features.map((feature, index) => (
          <List.Item key={index}>{feature}</List.Item>
        ))}
      </List>

      <Button
        fullWidth
        onClick={() => priceId && onSubscribe?.(priceId)}
        loading={loading}
        disabled={!priceId}
      >
        {priceId ? 'Subscribe Now' : 'Coming Soon'}
      </Button>
    </Card>
  )
}
