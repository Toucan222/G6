'use client'

import { Table, TextInput, Group, Text, Button, Menu, ActionIcon, ScrollArea } from '@mantine/core'
import { IconArrowUp, IconArrowDown, IconSearch, IconAdjustments } from '@tabler/icons-react'
import { useState, useMemo } from 'react'
import { Card } from '@/types/deck'

interface DeckTableProps {
  cards: Card[]
}

export function DeckTable({ cards }: DeckTableProps) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  // Get all unique scoreboard metrics across all cards
  const availableMetrics = useMemo(() => {
    const metrics = new Set<string>()
    cards.forEach(card => {
      Object.keys(card.scoreboard).forEach(key => metrics.add(key))
    })
    return Array.from(metrics)
  }, [cards])

  // Initialize selected metrics if empty
  if (selectedMetrics.length === 0 && availableMetrics.length > 0) {
    setSelectedMetrics([availableMetrics[0]])
  }

  const sortedAndFilteredCards = useMemo(() => {
    let filtered = cards.filter(card =>
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.quick_facts.some(fact => fact.toLowerCase().includes(search.toLowerCase()))
    )

    if (sortBy) {
      filtered.sort((a, b) => {
        const valueA = a.scoreboard[sortBy] || 0
        const valueB = b.scoreboard[sortBy] || 0
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA
      })
    }

    return filtered
  }, [cards, search, sortBy, sortDirection])

  const toggleSort = (metric: string) => {
    if (sortBy === metric) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(metric)
      setSortDirection('asc')
    }
  }

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(current => 
      current.includes(metric)
        ? current.filter(m => m !== metric)
        : [...current, metric]
    )
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <TextInput
          placeholder="Search cards..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        
        <Menu shadow="md">
          <Menu.Target>
            <Button variant="light" leftSection={<IconAdjustments size={16} />}>
              Metrics
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            {availableMetrics.map(metric => (
              <Menu.Item
                key={metric}
                onClick={() => toggleMetric(metric)}
                rightSection={selectedMetrics.includes(metric) ? '✓' : null}
              >
                {metric}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Quick Facts</Table.Th>
              {selectedMetrics.map(metric => (
                <Table.Th key={metric}>
                  <Group gap={4} onClick={() => toggleSort(metric)} style={{ cursor: 'pointer' }}>
                    {metric}
                    {sortBy === metric && (
                      <ActionIcon size="sm" variant="subtle">
                        {sortDirection === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />}
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedAndFilteredCards.map((card) => (
              <Table.Tr key={card.id}>
                <Table.Td>{card.title}</Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={2}>
                    {card.quick_facts.join(', ')}
                  </Text>
                </Table.Td>
                {selectedMetrics.map(metric => (
                  <Table.Td key={metric}>
                    {card.scoreboard[metric] || 0}%
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  )
}
