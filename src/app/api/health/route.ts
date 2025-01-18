import { monitor } from '@/lib/monitoring'
import { headers } from 'next/headers'

export async function GET(req: Request) {
  const headersList = headers()
  const apiKey = headersList.get('x-api-key')

  // Basic auth for health check endpoint
  if (apiKey !== process.env.HEALTH_CHECK_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401 
    })
  }

  const health = await monitor.checkHealth()
  
  return new Response(JSON.stringify(health), { 
    status: health.status === 'healthy' ? 200 : 
           health.status === 'degraded' ? 207 : 503 
  })
}
