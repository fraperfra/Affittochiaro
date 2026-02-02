import { APIGatewayProxyHandler } from 'aws-lambda';
import Stripe from 'stripe';
import { query, queryOne, execute } from '../../shared/db/client';
import { success, badRequest, forbidden, internalError, parseBody } from '../../shared/utils/response';
import { requireAgency, getAgencyProfile } from '../../shared/utils/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe Price IDs (set in environment variables)
const PLAN_PRICES: Record<string, string> = {
  base: process.env.STRIPE_PRICE_BASE || '',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
};

const CREDIT_PRICES: Record<string, { priceId: string; credits: number }> = {
  pack_10: { priceId: process.env.STRIPE_PRICE_CREDITS_10 || '', credits: 10 },
  pack_25: { priceId: process.env.STRIPE_PRICE_CREDITS_25 || '', credits: 25 },
  pack_50: { priceId: process.env.STRIPE_PRICE_CREDITS_50 || '', credits: 50 },
};

interface CreateCheckoutBody {
  type: 'subscription' | 'credits';
  productId: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * POST /payments/create-checkout
 *
 * Creates a Stripe Checkout session for subscription upgrade or credit purchase.
 * Only accessible by agencies.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Require agency role
    const auth = requireAgency(event);

    // Parse request body
    const body = parseBody<CreateCheckoutBody>(event.body);
    if (!body) {
      return badRequest('Invalid request body');
    }

    const { type, productId, successUrl, cancelUrl } = body;

    // Validate URLs
    if (!successUrl || !cancelUrl) {
      return badRequest('Success and cancel URLs are required');
    }

    // Get agency profile
    const agency = await getAgencyProfile(auth.userId);
    if (!agency) {
      return forbidden('Agency profile not found');
    }

    // Get or create Stripe customer
    let customerId = agency.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: agency.email,
        metadata: {
          agencyId: agency.id,
          userId: auth.userId,
          agencyName: agency.name,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await execute(
        'UPDATE agency_profiles SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2',
        [customerId, agency.id]
      );
    }

    // Create checkout session based on type
    let session: Stripe.Checkout.Session;

    if (type === 'subscription') {
      // Validate plan
      const priceId = PLAN_PRICES[productId];
      if (!priceId) {
        return badRequest(`Invalid plan: ${productId}. Valid plans: base, professional, enterprise`);
      }

      // Check if already subscribed
      if (agency.stripe_subscription_id) {
        // Instead of creating new subscription, redirect to portal
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: cancelUrl,
        });

        return success({
          type: 'portal',
          url: portalSession.url,
          message: 'Redirect to customer portal to manage subscription',
        });
      }

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          agencyId: agency.id,
          type: 'subscription',
          plan: productId,
        },
        subscription_data: {
          metadata: {
            agencyId: agency.id,
            plan: productId,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
      });

    } else if (type === 'credits') {
      // Validate credit pack
      const creditPack = CREDIT_PRICES[productId];
      if (!creditPack || !creditPack.priceId) {
        return badRequest(`Invalid credit pack: ${productId}. Valid packs: pack_10, pack_25, pack_50`);
      }

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: creditPack.priceId, quantity: 1 }],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          agencyId: agency.id,
          type: 'credits',
          creditPack: productId,
          creditsAmount: String(creditPack.credits),
        },
        allow_promotion_codes: true,
      });

    } else {
      return badRequest('Invalid type. Must be "subscription" or "credits"');
    }

    return success({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating checkout:', error);

    if (error.name === 'AuthError') {
      return forbidden(error.message);
    }

    if (error.type === 'StripeInvalidRequestError') {
      return badRequest(error.message);
    }

    return internalError('Failed to create checkout session');
  }
};
