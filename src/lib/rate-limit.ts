import { supabase } from './supabase'

export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean }> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - windowSeconds * 1000)

  // Clean up old entries
  await supabase
    .from('rate_limits')
    .delete()
    .lt('timestamp', windowStart.toISOString())

  // Count recent requests
  const { count } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact' })
    .eq('identifier', identifier)
    .gte('timestamp', windowStart.toISOString())

  if (count && count >= limit) {
    return { success: false }
  }

  // Log new request
  await supabase
    .from('rate_limits')
    .insert({
      identifier,
      timestamp: now.toISOString()
    })

  return { success: true }
}
