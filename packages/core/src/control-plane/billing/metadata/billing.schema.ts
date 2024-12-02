import { z } from 'zod';

export {
    // Enums
    TransactionType,
    PaymentStatus,
    Messages,
    
    // Interfaces
    PurchasePlan,
    
    // Schemas
    UserSchema,
    CheckoutInfoSchema,
    TransactionDtoSchema,
    paymentIntentSchema,
    CheckoutSessionInputSchema,
    checkoutSessionCompletedSchema,

    // Types
    User,
    CheckoutInfo,
    TransactionDto,
    PaymentIntentSchema,
    CheckoutSessionCompleted,
    CheckoutSessionInput,
};


// Enums
enum TransactionType {
   credit = 'CREDIT', 
    debit = 'DEBIT'
}

enum PaymentStatus {
    Valid = 'Valid',
    Invalid = 'Invalid',
    Complete = 'Complete', 
    NotPaid = 'NotPaid'
}

enum Messages {
    Success = 'success',
    Failure = 'failure'
}


// Interfaces
interface PurchasePlan {
    planId: string
}

// Schemas
const UserSchema = z.object({
    userId: z.string(),
    paymentStatus: z.nativeEnum(PaymentStatus),

});

const CheckoutInfoSchema = z.object({
    userId: z.string(),
    priceId: z.string(),
    quantity: z.number(),
    creditsPurchased: z.number()
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

const CheckoutSessionInputSchema = z.object({
  userId: z.string(),
  quantity: z.number(),
});

const checkoutSessionCompletedSchema = z.object({
  id: z.string(),
  metadata: z.object({
    userId: z.string(),
  }),
});



// Types
type User = z.infer<typeof UserSchema>;
type CheckoutInfo = z.infer<typeof CheckoutInfoSchema>;
type TransactionDto = z.infer<typeof TransactionDtoSchema>;
type PaymentIntentSchema = z.infer<typeof paymentIntentSchema>;
type CheckoutSessionCompleted = z.infer<typeof checkoutSessionCompletedSchema>;
type CheckoutSessionInput = z.infer<typeof CheckoutSessionInputSchema>;
