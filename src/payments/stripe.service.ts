import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe | null = null;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      this.stripe = new Stripe(secretKey);
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not configured — payments disabled');
    }
  }

  isConfigured(): boolean {
    return this.stripe !== null;
  }

  async createCheckoutSession(params: {
    amount: number;
    description: string;
    metadata: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> {
    if (!this.stripe) throw new Error('Stripe not configured');

    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: params.description,
            },
            unit_amount: Math.round(params.amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });
  }

  constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ): Stripe.Event {
    if (!this.stripe) throw new Error('Stripe not configured');

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not configured');

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async createRefund(paymentIntentId: string): Promise<Stripe.Refund> {
    if (!this.stripe) throw new Error('Stripe not configured');

    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  }
}
