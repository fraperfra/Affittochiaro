import { APIGatewayProxyHandler } from 'aws-lambda';
import Stripe from 'stripe';
import { execute, queryOne, withTransaction } from '../../shared/db/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Credits granted per plan
const PLAN_CREDITS: Record<string, number> = {
  base: 25,
  professional: 75,
  enterprise: 200,
};

// Credits per pack
const CREDIT_PACKS: Record<string, number> = {
  pack_10: 10,
  pack_25: 25,
  pack_50: 50,
};

/**
 * POST /payments/webhook
 *
 * Handles Stripe webhook events for:
 * - checkout.session.completed (subscription or credit purchase)
 * - customer.subscription.updated/deleted (plan changes)
 * - invoice.payment_succeeded (monthly renewal)
 * - invoice.payment_failed (failed payment)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig!,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  console.log(`Processing Stripe event: ${stripeEvent.type}`);

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(stripeEvent.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(stripeEvent.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };

  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook handler failed' }),
    };
  }
};

/**
 * Handle successful checkout - either subscription or credit purchase
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const { agencyId, type, plan, creditPack, creditsAmount } = session.metadata || {};

  if (!agencyId) {
    console.error('No agencyId in session metadata');
    return;
  }

  if (type === 'subscription' && plan) {
    const credits = PLAN_CREDITS[plan] || 0;

    await withTransaction(async (client) => {
      // Update agency plan and add credits
      await client.query(`
        UPDATE agency_profiles SET
          plan = $1,
          credits = credits + $2,
          plan_start_date = NOW(),
          plan_expires_at = NOW() + INTERVAL '1 month',
          stripe_subscription_id = $3,
          updated_at = NOW()
        WHERE id = $4
      `, [plan, credits, session.subscription, agencyId]);

      // Record credit transaction
      const balanceResult = await client.query(
        'SELECT credits FROM agency_profiles WHERE id = $1',
        [agencyId]
      );
      const newBalance = balanceResult.rows[0]?.credits || 0;

      await client.query(`
        INSERT INTO credit_transactions (agency_id, type, amount, balance_after, description)
        VALUES ($1, 'subscription', $2, $3, $4)
      `, [agencyId, credits, newBalance, `Abbonamento ${plan} attivato`]);

      // Create notification
      await createNotification(client, agencyId, {
        type: 'plan_upgrade',
        title: 'Abbonamento attivato!',
        message: `Il tuo abbonamento ${plan} e ora attivo. Hai ricevuto ${credits} crediti.`,
        link: '/agency/dashboard',
      });
    });

    console.log(`Subscription activated: agency=${agencyId}, plan=${plan}, credits=${credits}`);

  } else if (type === 'credits' && creditPack) {
    const credits = parseInt(creditsAmount || '0') || CREDIT_PACKS[creditPack] || 0;

    await withTransaction(async (client) => {
      // Add credits
      await client.query(`
        UPDATE agency_profiles SET
          credits = credits + $1,
          updated_at = NOW()
        WHERE id = $2
      `, [credits, agencyId]);

      // Record transaction
      const balanceResult = await client.query(
        'SELECT credits FROM agency_profiles WHERE id = $1',
        [agencyId]
      );
      const newBalance = balanceResult.rows[0]?.credits || 0;

      await client.query(`
        INSERT INTO credit_transactions (agency_id, type, amount, balance_after, description, stripe_payment_id)
        VALUES ($1, 'purchase', $2, $3, $4, $5)
      `, [agencyId, credits, newBalance, `Acquisto ${credits} crediti`, session.payment_intent]);

      // Create notification
      await createNotification(client, agencyId, {
        type: 'system',
        title: 'Crediti aggiunti!',
        message: `${credits} crediti sono stati aggiunti al tuo account.`,
        link: '/agency/credits',
      });
    });

    console.log(`Credits purchased: agency=${agencyId}, credits=${credits}`);
  }
}

/**
 * Handle subscription updates (plan change, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const agencyId = subscription.metadata?.agencyId;
  if (!agencyId) return;

  const status = subscription.status;
  const plan = subscription.metadata?.plan;

  if (status === 'active' && plan) {
    await execute(`
      UPDATE agency_profiles SET
        plan = $1,
        plan_expires_at = to_timestamp($2),
        updated_at = NOW()
      WHERE id = $3
    `, [plan, subscription.current_period_end, agencyId]);
  } else if (status === 'past_due' || status === 'unpaid') {
    // Notify agency of payment issue
    await createNotificationForAgency(agencyId, {
      type: 'system',
      title: 'Problema con il pagamento',
      message: 'Il pagamento del tuo abbonamento non e andato a buon fine. Aggiorna il metodo di pagamento.',
      link: '/agency/settings/billing',
    });
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const agencyId = subscription.metadata?.agencyId;
  if (!agencyId) return;

  await execute(`
    UPDATE agency_profiles SET
      plan = 'free',
      stripe_subscription_id = NULL,
      plan_expires_at = NULL,
      updated_at = NOW()
    WHERE stripe_subscription_id = $1
  `, [subscription.id]);

  await createNotificationForAgency(agencyId, {
    type: 'system',
    title: 'Abbonamento cancellato',
    message: 'Il tuo abbonamento e stato cancellato. Sei tornato al piano gratuito.',
    link: '/agency/settings/billing',
  });

  console.log(`Subscription cancelled: agency=${agencyId}`);
}

/**
 * Handle successful invoice payment (monthly renewal)
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  // Only process subscription invoices
  if (!invoice.subscription) return;

  // Find agency by subscription ID
  const agency = await queryOne<{ id: string; plan: string }>(
    'SELECT id, plan FROM agency_profiles WHERE stripe_subscription_id = $1',
    [invoice.subscription]
  );

  if (!agency) return;

  const credits = PLAN_CREDITS[agency.plan] || 0;

  await withTransaction(async (client) => {
    // Add monthly credits
    await client.query(`
      UPDATE agency_profiles SET
        credits = credits + $1,
        credits_used_this_month = 0,
        plan_expires_at = NOW() + INTERVAL '1 month',
        updated_at = NOW()
      WHERE id = $2
    `, [credits, agency.id]);

    // Record transaction
    const balanceResult = await client.query(
      'SELECT credits FROM agency_profiles WHERE id = $1',
      [agency.id]
    );
    const newBalance = balanceResult.rows[0]?.credits || 0;

    await client.query(`
      INSERT INTO credit_transactions (agency_id, type, amount, balance_after, description)
      VALUES ($1, 'subscription', $2, $3, $4)
    `, [agency.id, credits, newBalance, 'Rinnovo mensile abbonamento']);
  });

  console.log(`Monthly renewal: agency=${agency.id}, credits=${credits}`);
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription) return;

  const agency = await queryOne<{ id: string }>(
    'SELECT id FROM agency_profiles WHERE stripe_subscription_id = $1',
    [invoice.subscription]
  );

  if (!agency) return;

  await createNotificationForAgency(agency.id, {
    type: 'system',
    title: 'Pagamento fallito',
    message: 'Non siamo riusciti a rinnovare il tuo abbonamento. Aggiorna il metodo di pagamento entro 7 giorni.',
    link: '/agency/settings/billing',
  });
}

/**
 * Helper to create notification within transaction
 */
async function createNotification(
  client: any,
  agencyId: string,
  notification: { type: string; title: string; message: string; link?: string }
): Promise<void> {
  const userResult = await client.query(
    'SELECT user_id FROM agency_profiles WHERE id = $1',
    [agencyId]
  );

  if (userResult.rows[0]) {
    await client.query(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      userResult.rows[0].user_id,
      notification.type,
      notification.title,
      notification.message,
      notification.link,
    ]);
  }
}

/**
 * Helper to create notification outside transaction
 */
async function createNotificationForAgency(
  agencyId: string,
  notification: { type: string; title: string; message: string; link?: string }
): Promise<void> {
  const userResult = await queryOne<{ user_id: string }>(
    'SELECT user_id FROM agency_profiles WHERE id = $1',
    [agencyId]
  );

  if (userResult) {
    await execute(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      userResult.user_id,
      notification.type,
      notification.title,
      notification.message,
      notification.link,
    ]);
  }
}
