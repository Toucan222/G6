import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json()

    // Get or create Stripe customer
    let { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (!customer) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      const stripeCustomer = await stripe.customers.create({
        email: userData?.user.email,
        metadata: { user_id: userId }
      })

      await supabase
        .from('customers')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeCustomer.id
        })

      customer = { stripe_customer_id: stripeCustomer.id }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.stripe_customer_id,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      subscription_data: {
        metadata: { user_id: userId }
      }
    })

    return new Response(JSON.stringify({ url: session.url }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }), 
      { status: 500 }
    )
  }
}
