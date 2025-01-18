import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: subscription.metadata.user_id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date(subscription.current_period_end * 1000)
          })
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', deletedSubscription.id)
        break
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Webhook signature verification failed' }), 
      { status: 400 }
    )
  }
}
