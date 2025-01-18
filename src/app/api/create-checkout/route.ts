import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json()

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let { data: customer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (!customer) {
      // Get user data
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (error || !data.user?.email) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Create Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: data.user.email,
        metadata: { user_id: userId }
      })

      // Store customer in database
      const { error: insertError } = await supabaseAdmin
        .from('customers')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeCustomer.id
        })

      if (insertError) {
        return NextResponse.json(
          { error: 'Failed to create customer record' },
          { status: 500 }
        )
      }

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

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
