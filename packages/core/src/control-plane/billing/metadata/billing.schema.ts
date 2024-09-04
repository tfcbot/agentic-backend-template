import { z } from 'zod';

export {
    // Enums
    TransactionType,
    PaymentStatus,
    Messages,
    OnboardingStatus,
    
    // Interfaces
    PurchasePlan,
    
    // Schemas
    UserSchema,
    CheckoutInfoSchema,
    TransactionDtoSchema,
    paymentIntentSchema,
    checkoutIntentSchema,
    checkoutSessionCompletedSchema,
    
    // Types
    User,
    CheckoutInfo,
    TransactionDto,
    PaymentIntentSchema,
    CheckoutIntent,
    CheckoutSessionCompleted,
};


// Enums
enum TransactionType {
   credit = 'CREDIT', 
    debit = 'DEBIT'
}

enum PaymentStatus {
    Valid = 'Valid',
    Invalid = 'Invalid',
    paid = 'PAID', 
    notPaid = 'NOT_PAID'
}

enum Messages {
    Success = 'success',
    Failure = 'failure'
}

enum OnboardingStatus {
    notStarted = 'NOT_STARTED', 
    inProgress = 'IN_PROGRESS', 
    complete ='COMPLETE'
}

// Interfaces
interface PurchasePlan {
    planId: string
}

// Schemas
const UserSchema = z.object({
    userId: z.string(),
    paymentStatus: z.nativeEnum(PaymentStatus),
    onboardingStatus: z.nativeEnum(OnboardingStatus)
});

const CheckoutInfoSchema = z.object({
    userId: z.string(),
    priceId: z.string(),
    quantity: z.number()
});

const TransactionDtoSchema = z.object({
    userId: z.string(),
    timestamp: z.string(),
    amount: z.number(),
    type: z.nativeEnum(TransactionType)
});

const paymentIntentSchema = z.object({
  id: z.string(),
  object: z.literal('payment_intent'),
  amount: z.number(),
  amount_capturable: z.number().optional(),
  amount_details: z.object({
    tip: z.object({}).optional()
  }).optional(),
  amount_received: z.number(),
  application: z.null().nullable().optional(),
  application_fee_amount: z.null().nullable().optional(),
  automatic_payment_methods: z.object({
    enabled: z.boolean()
  }).nullable().optional(),
  canceled_at: z.null().nullable().optional(),
  cancellation_reason: z.null().nullable().optional(),
  capture_method: z.string(),
  client_secret: z.string().optional(),
  confirmation_method: z.string(),
  created: z.number(),
  currency: z.string(),
  customer: z.string().nullable(),
  description: z.null().nullable().optional(),
  invoice: z.null().nullable().optional(),
  last_payment_error: z.null().nullable().optional(),
  latest_charge: z.string().nullable(),
  livemode: z.boolean(),
  metadata: z.object({
    userId: z.string()
  }).and(z.record(z.unknown())),
  next_action: z.null().nullable().optional(),
  on_behalf_of: z.null().nullable().optional(),
  payment_method: z.string().nullable(),
  payment_method_options: z.object({
    card: z.object({
      installments: z.null().nullable().optional(),
      mandate_options: z.null().nullable().optional(),
      network: z.null().nullable().optional(),
      request_three_d_secure: z.string().optional()
    }).optional(),
    link: z.object({
      persistent_token: z.null().nullable().optional()
    }).optional()
  }).optional(),
  payment_method_types: z.array(z.string()),
  processing: z.null().nullable().optional(),
  receipt_email: z.null().nullable().optional(),
  review: z.null().nullable().optional(),
  setup_future_usage: z.null().nullable().optional(),
  shipping: z.null().nullable().optional(),
  source: z.null().nullable().optional(),
  statement_descriptor: z.null().nullable().optional(),
  statement_descriptor_suffix: z.null().nullable().optional(),
  status: z.string(),
  transfer_data: z.null().nullable().optional(),
  transfer_group: z.null().nullable().optional()
});

const checkoutIntentSchema = z.object({
  userId: z.string(),
});

const checkoutSessionCompletedSchema = z.object({
  id: z.string(),
  object: z.literal('checkout.session'),
  amount_subtotal: z.number(),
  amount_total: z.number(),
  automatic_tax: z.object({
    enabled: z.boolean(),
    liability: z.null().nullable(),
    status: z.null().nullable(),
  }),
  created: z.number(),
  currency: z.string(),
  customer: z.string(),
  customer_details: z.object({
    address: z.object({
      city: z.string().nullable(),
      country: z.string(),
      line1: z.string().nullable(),
      line2: z.string().nullable(),
      postal_code: z.string(),
      state: z.string().nullable(),
    }),
    email: z.string(),
    name: z.string(),
    phone: z.string().nullable(),
    tax_exempt: z.string(),
    tax_ids: z.array(z.unknown()),
  }),
  expires_at: z.number(),
  invoice: z.string(),
  livemode: z.boolean(),
  metadata: z.object({
    userId: z.string(),
  }),
  mode: z.string(),
  payment_intent: z.string().nullable(),
  payment_status: z.string(),
  status: z.string(),
  subscription: z.string(),
  total_details: z.object({
    amount_discount: z.number(),
    amount_shipping: z.number(),
    amount_tax: z.number(),
  }),
});

// Types
type User = z.infer<typeof UserSchema>;
type CheckoutInfo = z.infer<typeof CheckoutInfoSchema>;
type TransactionDto = z.infer<typeof TransactionDtoSchema>;
type PaymentIntentSchema = z.infer<typeof paymentIntentSchema>;
type CheckoutIntent = z.infer<typeof checkoutIntentSchema>;
type CheckoutSessionCompleted = z.infer<typeof checkoutSessionCompletedSchema>;



