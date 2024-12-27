
export const mockCheckoutSession = {
  id: 'mock-session-id',
  url: 'https://mock-checkout-url.com',
  // Add other required properties with mock values
};

export const mockWebhookEvent = {
  id: 'cs_test_123',
  object: 'checkout.session',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_123',
      object: 'checkout.session',
      amount_subtotal: 18900,
      amount_total: 18900,
      automatic_tax: {
        enabled: false,
        liability: null,
        status: null,
      },
      created: 1701470707,
      currency: 'usd',
      customer: 'cus_9s6XKzkNRiz8i3',
      customer_details: {
        address: {
          city: null,
          country: 'US',
          line1: null,
          line2: null,
          postal_code: '12345',
          state: null,
        },
        email: 'email2@gmail.com',
        name: 'example name2',
        phone: '2000000',
        tax_exempt: 'none',
        tax_ids: [],
      },
      expires_at: 1701557107,
      invoice: 'in_1OIfSJ2eZvKYlo2Cqkek1IHA',
      livemode: false,
      metadata: {
        userId: 'mockUserId123',
      },
      mode: 'payment',
      payment_intent: 'pi_3OIfSJ2eZvKYlo2C1J39JnQx',
      payment_status: 'paid',
      status: 'complete',
      subscription: null,
      total_details: {
        amount_discount: 0,
        amount_shipping: 0,
        amount_tax: 0,
      },
    },
  },
} 