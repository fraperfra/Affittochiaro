import { PreTokenGenerationTriggerEvent, PreTokenGenerationTriggerHandler } from 'aws-lambda';
import { queryOne, execute } from '../../shared/db/client';

/**
 * Cognito Pre Token Generation Trigger
 *
 * Adds custom claims to the JWT token:
 * - role: user role (tenant/agency/admin)
 * - profileId: user's profile ID
 * - plan: agency subscription plan (if agency)
 * - verified: whether profile is verified
 *
 * Also updates last_login timestamp
 */
export const handler: PreTokenGenerationTriggerHandler = async (
  event: PreTokenGenerationTriggerEvent
): Promise<PreTokenGenerationTriggerEvent> => {
  console.log('PreTokenGeneration trigger:', JSON.stringify(event, null, 2));

  const { sub } = event.request.userAttributes;

  try {
    // Get user data from database
    const user = await queryOne(`
      SELECT
        u.id,
        u.role,
        u.status,
        tp.id as tenant_profile_id,
        tp.is_verified as tenant_verified,
        tp.profile_completeness,
        ap.id as agency_profile_id,
        ap.is_verified as agency_verified,
        ap.plan as agency_plan,
        ap.credits as agency_credits
      FROM users u
      LEFT JOIN tenant_profiles tp ON tp.user_id = u.id
      LEFT JOIN agency_profiles ap ON ap.user_id = u.id
      WHERE u.cognito_sub = $1
    `, [sub]);

    if (user) {
      // Check if user is suspended
      if (user.status === 'suspended') {
        throw new Error('Account suspended. Please contact support.');
      }

      // Add custom claims to token
      event.response.claimsOverrideDetails = {
        claimsToAddOrOverride: {
          'custom:db_user_id': user.id,
          'custom:role': user.role,
          'custom:profile_id': user.tenant_profile_id || user.agency_profile_id || '',
          'custom:verified': String(user.tenant_verified || user.agency_verified || false),
        },
      };

      // Add agency-specific claims
      if (user.role === 'agency' && user.agency_profile_id) {
        event.response.claimsOverrideDetails.claimsToAddOrOverride!['custom:plan'] = user.agency_plan;
        event.response.claimsOverrideDetails.claimsToAddOrOverride!['custom:credits'] = String(user.agency_credits);
      }

      // Add tenant-specific claims
      if (user.role === 'tenant' && user.tenant_profile_id) {
        event.response.claimsOverrideDetails.claimsToAddOrOverride!['custom:completeness'] = String(user.profile_completeness);
      }

      // Update last login (async, don't wait)
      execute(
        'UPDATE users SET last_login = NOW() WHERE cognito_sub = $1',
        [sub]
      ).catch(err => console.error('Failed to update last_login:', err));
    }

  } catch (error: any) {
    console.error('PreTokenGeneration error:', error);

    // If account is suspended, deny the token
    if (error.message?.includes('suspended')) {
      throw error;
    }
    // For other errors, continue but without custom claims
  }

  return event;
};
