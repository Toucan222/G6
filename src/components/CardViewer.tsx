// Update existing CardViewer component to include AI features
import { Card, Image, Text, Group, Stack, Progress, Box } from '@mantine/core'
import { useState } from 'react'
import { CardExplainer } from './CardExplainer'
import { Card as CardType } from '@/types/deck'

interface CardViewerProps {
  card: CardType
}

export function CardViewer({ card }: CardViewerProps) {
  const [screen, setScreen] = useState(0)

  const screens = [
    // Screen 1: Overview with AI Explainer
    <Stack key="overview">
      <Image
        src={card.image_url}
        height={200}
        alt={card.title}
        fallbackSrc="https://placehold.co/400x200"
      />
      <Group justify="space-between" align="center">
        <Text fw={700} size="lg">{card.title}</Text>
        <CardExplainer
          cardId={card.id}
          title={card.title}
          facts={card.quick_facts}
          scoreboard={card.scoreboard}
        />
      </Group>
      <Box>
        {card.quick_facts.map((fact, i) => (
          <Text key={i} size="sm" c="dimmed">{fact}</Text>
        ))}
      </Box>
    </Stack>,
    // ... rest of the screens remain the same
  ]

  return (
    // ... rest of the component remains the same
  )
}
