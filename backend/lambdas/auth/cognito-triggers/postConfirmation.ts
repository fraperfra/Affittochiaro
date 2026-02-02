import { PostConfirmationTriggerEvent, PostConfirmationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { withTransaction } from '../../shared/db/client';

const cognito = new CognitoIdentityProviderClient({});

/**
 * Cognito Post Confirmation Trigger
 *
 * Creates user record and profile in PostgreSQL after email verification:
 * - Creates user record
 * - Creates tenant_profile or agency_profile based on role
 * - Initializes notification preferences
 * - Updates Cognito with profile_id custom attribute
 * - Sends welcome notification
 */
export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent
): Promise<PostConfirmationTriggerEvent> => {
  console.log('PostConfirmation trigger:', JSON.stringify(event, null, 2));

  // Only handle confirmed sign-ups
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    return event;
  }

  const { sub, email } = event.request.userAttributes;
  const role = event.request.clientMetadata?.role || 'tenant';
  const metadata = event.request.clientMetadata || {};

  try {
    const profileId = await withTransaction(async (client) => {
      // 1. Create user record
      const userResult = await client.query(`
        INSERT INTO users (cognito_sub, email, role, status, email_verified, phone)
        VALUES ($1, $2, $3, 'active', true, $4)
        RETURNING id
      `, [sub, email.toLowerCase(), role, metadata.phone || null]);

      const userId = userResult.rows[0].id;
      let profileId: string;

      // 2. Create profile based on role
      if (role === 'tenant') {
        const profileResult = await client.query(`
          INSERT INTO tenant_profiles (
            user_id, first_name, last_name, occupation, employment_type,
            current_city, profile_completeness
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `, [
          userId,
          metadata.firstName || '',
          metadata.lastName || '',
          metadata.occupation || null,
          metadata.employmentType || null,
          metadata.city || null,
          calculateTenantCompleteness(metadata),
        ]);

        profileId = profileResult.rows[0].id;

        // Create tenant preferences
        await client.query(`
          INSERT INTO tenant_preferences (tenant_id, max_budget, preferred_cities, has_pets)
          VALUES ($1, $2, $3, $4)
        `, [
          profileId,
          metadata.maxBudget ? parseFloat(metadata.maxBudget) : null,
          metadata.preferredCity ? [metadata.preferredCity] : [],
          metadata.hasPets === 'true',
        ]);

      } else {
        // Agency profile
        const profileResult = await client.query(`
          INSERT INTO agency_profiles (
            user_id, name, vat_number, phone, city, plan, credits
          ) VALUES ($1, $2, $3, $4, $5, 'free', 5)
          RETURNING id
        `, [
          userId,
          metadata.agencyName || metadata.firstName + ' ' + metadata.lastName,
          metadata.vatNumber || '',
          metadata.phone || '',
          metadata.city || '',
        ]);

        profileId = profileResult.rows[0].id;
      }

      // 3. Create notification preferences with defaults
      await client.query(`
        INSERT INTO notification_preferences (user_id)
        VALUES ($1)
      `, [userId]);

      // 4. Create welcome notification
      await client.query(`
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES ($1, 'welcome', $2, $3, $4)
      `, [
        userId,
        'Benvenuto su Affittochiaro!',
        role === 'tenant'
          ? 'Il tuo profilo inquilino e stato creato. Completa il tuo CV per aumentare le possibilita di trovare casa!'
          : 'Il tuo account agenzia e attivo. Inizia a pubblicare annunci e a cercare inquilini verificati!',
        role === 'tenant' ? '/tenant/profile' : '/agency/dashboard',
      ]);

      return profileId;
    });

    // 5. Update Cognito with profile_id
    await cognito.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: event.userPoolId,
      Username: event.userName,
      UserAttributes: [
        { Name: 'custom:role', Value: role },
        { Name: 'custom:profile_id', Value: profileId },
      ],
    }));

    console.log(`User created successfully: ${email}, role: ${role}, profileId: ${profileId}`);

  } catch (error) {
    console.error('Error creating user:', error);
    // Don't throw - let the user be confirmed but log the error
    // They can complete profile later
  }

  return event;
};

/**
 * Calculate initial profile completeness based on provided metadata
 */
function calculateTenantCompleteness(metadata: Record<string, string>): number {
  const fields = [
    { key: 'firstName', weight: 10 },
    { key: 'lastName', weight: 10 },
    { key: 'phone', weight: 8 },
    { key: 'occupation', weight: 15 },
    { key: 'employmentType', weight: 10 },
    { key: 'monthlyIncome', weight: 15 },
    { key: 'city', weight: 5 },
    { key: 'maxBudget', weight: 5 },
  ];

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
  const completedWeight = fields.reduce((sum, f) => {
    return metadata[f.key] ? sum + f.weight : sum;
  }, 0);

  // Add base points for having an account
  const basePoints = 15;

  return Math.min(100, Math.round((completedWeight / totalWeight) * 85) + basePoints);
}
