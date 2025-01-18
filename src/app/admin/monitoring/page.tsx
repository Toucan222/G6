'use client'

import { Container, Title, Paper, Table, Badge, Stack, Group, Text } from '@mantine/core'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { supabase } from '@/lib/supabase'

interface LogEvent {
  level: 'info' | 'warn' | 'error'
  message: string
  context?: Record<string, any>
  timestamp: string
}

export default function Monitoring() {
  const [logs, setLogs] = useState<LogEvent[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (data) {
        setLogs(data)
      }
    }

    fetchLogs()
  }, [])

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Title mb="xl">System Monitoring</Title>
        <Paper p="md">
          <Title order={3} mb="md">System Logs</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Timestamp</Table.Th>
                <Table.Th>Level</Table.Th>
                <Table.Th>Message</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {logs.map((log, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    {new Date(log.timestamp).toLocaleString()}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        log.level === 'error' ? 'red' :
                        log.level === 'warn' ? 'yellow' : 'blue'
                      }
                    >
                      {log.level}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{log.message}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Container>
    </>
  )
}
