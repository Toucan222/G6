type LogLevel = 'info' | 'warn' | 'error'

interface LogEvent {
  level: LogLevel
  message: string
  context?: Record<string, any>
  timestamp: string
}

class Monitor {
  private static instance: Monitor
  private logs: LogEvent[] = []
  private readonly MAX_LOGS = 1000

  private constructor() {}

  static getInstance(): Monitor {
    if (!Monitor.instance) {
      Monitor.instance = new Monitor()
    }
    return Monitor.instance
  }

  private async sendToSupabase(event: LogEvent) {
    const { supabase } = await import('@/lib/supabase')
    
    await supabase
      .from('system_logs')
      .insert([event])
      .select()
  }

  private createEvent(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogEvent {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    }
  }

  async log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ) {
    const event = this.createEvent(level, message, context)
    
    // Store in memory
    this.logs.push(event)
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift()
    }

    // Send to Supabase
    await this.sendToSupabase(event)
  }

  async getRecentLogs(count: number = 100): Promise<LogEvent[]> {
    return this.logs.slice(-count)
  }

  async checkHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    checks: Record<string, boolean>
  }> {
    const { supabase } = await import('@/lib/supabase')
    const checks: Record<string, boolean> = {}

    // Check Supabase connection
    try {
      const { data, error } = await supabase.from('health_checks').select('*').limit(1)
      checks.database = !error
    } catch {
      checks.database = false
    }

    // Check Stripe connection
    try {
      const { stripe } = await import('@/lib/stripe')
      await stripe.customers.list({ limit: 1 })
      checks.stripe = true
    } catch {
      checks.stripe = false
    }

    // Check OpenAI connection
    try {
      const { openai } = await import('@/lib/openai')
      await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      })
      checks.openai = true
    } catch {
      checks.openai = false
    }

    // Determine overall status
    const totalChecks = Object.values(checks).length
    const passedChecks = Object.values(checks).filter(v => v).length

    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (passedChecks === totalChecks) {
      status = 'healthy'
    } else if (passedChecks > 0) {
      status = 'degraded'
    } else {
      status = 'unhealthy'
    }

    return { status, checks }
  }
}

export const monitor = Monitor.getInstance()
