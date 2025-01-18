'use client'

import { Container, Title, Paper } from '@mantine/core'
import { Header } from '@/components/Header'
import { CSVImport } from '@/components/CSVImport'
import { useParams, useRouter } from 'next/navigation'

export default function ImportPage() {
  const params = useParams()
  const router = useRouter()

  const handleComplete = () => {
    router.push(`/dashboard/decks/${params.id}`)
  }

  return (
    <>
      <Header />
      <Container size="lg" mt="xl">
        <Title mb="xl">Import Cards</Title>
        <Paper p="md">
          <CSVImport 
            deckId={params.id as string} 
            onComplete={handleComplete} 
          />
        </Paper>
      </Container>
    </>
  )
}
