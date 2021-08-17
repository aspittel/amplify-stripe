import { loadStripe } from '@stripe/stripe-js'

export default function Subscribe() {
  const handleClick = async e => {
    const stripe = await loadStripe('pk_test_51HwBigKaIe5NaSopTSb0jUoQW5pvk27z2mjatUqVmSIXFjQNodjhl6I0OzOAnVrQ7ESmj3TdZnqtiC3CBZDPNrfP00ovHIQJyF')
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1JNLtlKaIe5NaSopvQWMc0KC',
        quantity: 1
      }],
      mode: 'subscription',
      successUrl: 'http://localhost:3000',
      cancelUrl: 'http://localhost:3000/cancel'
    })
  }

  return (
    <button onClick={handleClick}>Get Course Access</button>
  )
}
