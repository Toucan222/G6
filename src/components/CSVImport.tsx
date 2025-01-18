'use client'

import { useState } from 'react'
import { Group, Text, Button, Table, Alert, Stack } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { IconUpload, IconX, IconCheck } from '@tabler/icons-react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import type { CSVCard, ParsedCard } from '@/types/csv'

interface CSVImportProps {
  deckId: string
  onComplete: () => void
}

export function CSVImport({ deckId, onComplete }: CSVImportProps) {
  const [parsedData, setParsedData] = useState<ParsedCard[]>([])
  const [error, setError] = useState<string>('')
  const [importing, setImporting] = useState(false)

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsed: ParsedCard[] = results.data.map((row: CSVCard) => ({
            title: row.title,
            image_url: row.image_url,
            quick_facts: row.quick_facts.split('|').filter(Boolean),
            scoreboard: JSON.parse(row.scoreboard),
            content_blocks: [
              row.text_block ? { text: row.text_block } : null,
              row.link_block ? { link: row.link_block } : null,
              row.audio_block ? { audio_url: row.audio_block } : null,
            ].filter(Boolean)
          }))
          setParsedData(parsed)
          setError('')
        } catch (e) {
          setError('Invalid CSV format. Please check the template.')
        }
      },
      error: () => {
        setError('Failed to parse CSV file.')
      }
    })
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      for (const card of parsedData) {
        await supabase
          .from('cards')
          .insert([{
            deck_id: deckId,
            ...card
          }])
      }
      onComplete()
    } catch (e) {
      setError('Failed to import cards.')
    }
    setImporting(false)
  }

  return (
    <Stack>
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      {parsedData.length === 0 ? (
        <Dropzone
          onDrop={(files) => parseCSV(files[0])}
          accept={['.csv']}
          maxSize={5 * 1024 ** 2}
        >
          <Group justify="center" gap="xl" style={{ minHeight: 120, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconCheck size={50} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconUpload size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag CSV here or click to select
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                File should not exceed 5MB
              </Text>
            </div>
          </Group>
        </Dropzone>
      ) : (
        <>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Quick Facts</Table.Th>
                <Table.Th>Scoreboard</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {parsedData.map((card, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{card.title}</Table.Td>
                  <Table.Td>{card.quick_facts.join(', ')}</Table.Td>
                  <Table.Td>
                    {Object.entries(card.scoreboard)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="space-between">
            <Button variant="light" onClick={() => setParsedData([])}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              loading={importing}
              disabled={parsedData.length === 0}
            >
              Import {parsedData.length} Cards
            </Button>
          </Group>
        </>
      )}

      <Text size="sm" c="dimmed">
        CSV Format: title, image_url, quick_facts (separated by |), 
        scoreboard (JSON format), text_block, link_block, audio_block
      </Text>
    </Stack>
  )
}
