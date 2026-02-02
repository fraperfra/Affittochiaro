import { PreSignUpTriggerEvent, PreSignUpTriggerHandler } from 'aws-lambda';
import { queryOne } from '../../shared/db/client';

/**
 * Cognito Pre Sign-Up Trigger
 *
 * Validates user registration before account creation:
 * - Checks if email already exists
 * - Validates role (tenant/agency)
 * - For agencies: validates VAT number format
 */
export const handler: PreSignUpTriggerHandler = async (
  event: PreSignUpTriggerEvent
): Promise<PreSignUpTriggerEvent> => {
  console.log('PreSignUp trigger:', JSON.stringify(event, null, 2));

  const { email } = event.request.userAttributes;
  const role = event.request.clientMetadata?.role || 'tenant';

  // Validate role
  if (!['tenant', 'agency'].includes(role)) {
    throw new Error('Invalid role. Must be tenant or agency.');
  }

  // Check if email already exists in our database
  try {
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
  } catch (error: any) {
    // If it's our custom error, re-throw it
    if (error.message.includes('already exists')) {
      throw error;
    }
    // Database connection errors should not block sign-up
    console.error('Database check failed:', error);
  }

  // For agencies, validate VAT number if provided
  if (role === 'agency') {
    const vatNumber = event.request.clientMetadata?.vatNumber;
    if (vatNumber && !isValidItalianVAT(vatNumber)) {
      throw new Error('Invalid Italian VAT number format.');
    }
  }

  // Auto-confirm if admin triggers this (e.g., admin creating user)
  if (event.request.clientMetadata?.adminCreated === 'true') {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
  }

  return event;
};

/**
 * Validates Italian VAT number (Partita IVA)
 * Format: 11 digits
 */
function isValidItalianVAT(vat: string): boolean {
  const cleaned = vat.replace(/\s/g, '');

  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }

  // Luhn-like checksum validation for Italian VAT
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(cleaned[i], 10);
    if (i % 2 === 0) {
      sum += digit;
    } else {
      const doubled = digit * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }

  return sum % 10 === 0;
}
