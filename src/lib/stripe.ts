import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export const getStripeCustomerId = async (userId: string) => {
  const { data: customer } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  return customer?.stripe_customer_id
}
