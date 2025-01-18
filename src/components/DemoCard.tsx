'use client'

import { Card, Image, Text, Group, Stack, Progress, Box, Button } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { useState } from 'react'

const demoData = {
  title: 'Ancient Rome',
  image: '/demo-card.jpg',
  facts: [
    'Founded in 753 BCE',
    'Lasted for over 1000 years',
    'Peak territory: 5 million square kilometers'
  ],
  scoreboard: {
    'Military Power': 95,
    'Cultural Impact': 90,
    'Technological Innovation': 85,
    'Economic Influence': 88
  },
  content: {
    text: 'The Roman Empire was one of the largest and most influential civilizations in world history.',
    link: 'Learn more about Ancient Rome',
    audio: 'Roman history audio guide'
  }
}

export function DemoCard() {
  const [screen, setScreen] = useState(0)

  const screens = [
    // Overview Screen
    <Stack key="overview" spacing="md">
      <Image
        src={demoData.image}
        height={200}
        alt={demoData.title}
        fallbackSrc="https://placehold.co/400x200"
      />
      <Text fw={700} size="lg">{demoData.title}</Text>
      <Box>
        {demoData.facts.map((fact, i) => (
          <Text key={i} size="sm" c="dimmed">{fact}</Text>
        ))}
      </Box>
    </Stack>,

    // Scoreboard Screen
    <Stack key="scoreboard" spacing="lg">
      <Text fw={700} size="lg">Performance Metrics</Text>
      {Object.entries(demoData.scoreboard).map(([key, value]) => (
        <Box key={key}>
          <Group justify="space-between" mb={5}>
            <Text size="sm">{key}</Text>
            <Text size="sm">{value}%</Text>
          </Group>
          <Progress value={value} color="blue" />
        </Box>
      ))}
    </Stack>,

    // Content Screen
    <Stack key="content" spacing="lg">
      <Text fw={700} size="lg">Additional Content</Text>
      <Text>{demoData.content.text}</Text>
      <Button variant="light">{demoData.content.link}</Button>
      <Button variant="light">{demoData.content.audio}</Button>
    </Stack>
  ]

  return (
    <Card shadow="md" padding="lg" radius="md" style={{ overflow: 'visible' }}>
      {screens[screen]}
      <Group justify="space-between" mt="md">
        <Button
          variant="light"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => setScreen((s) => (s > 0 ? s - 1 : s))}
          disabled={screen === 0}
        >
          Previous
        </Button>
        <Text size="sm" c="dimmed">
          {screen + 1} / {screens.length}
        </Text>
        <Button
          variant="light"
          rightSection={<IconArrowRight size={16} />}
          onClick={() => setScreen((s) => (s < screens.length - 1 ? s + 1 : s))}
          disabled={screen === screens.length - 1}
        >
          Next
        </Button>
      </Group>
    </Card>
  )
}
