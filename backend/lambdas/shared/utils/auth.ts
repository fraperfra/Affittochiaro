import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthContext, UserRole } from '../types';
import { query, queryOne } from '../db/client';

export function getAuthContext(event: APIGatewayProxyEvent): AuthContext | null {
  const claims = event.requestContext.authorizer?.claims;

  if (!claims) {
    return null;
  }

  return {
    userId: claims.sub,
    email: claims.email,
    role: claims['custom:role'] as UserRole,
    profileId: claims['custom:profile_id'],
  };
}

export function requireAuth(event: APIGatewayProxyEvent): AuthContext {
  const context = getAuthContext(event);
  if (!context) {
    throw new AuthError('Authentication required');
  }
  return context;
}

export function requireRole(event: APIGatewayProxyEvent, ...roles: UserRole[]): AuthContext {
  const context = requireAuth(event);
  if (!roles.includes(context.role)) {
    throw new AuthError(`Access denied. Required roles: ${roles.join(', ')}`);
  }
  return context;
}

export function requireTenant(event: APIGatewayProxyEvent): AuthContext {
  return requireRole(event, 'tenant');
}

export function requireAgency(event: APIGatewayProxyEvent): AuthContext {
  return requireRole(event, 'agency');
}

export function requireAdmin(event: APIGatewayProxyEvent): AuthContext {
  return requireRole(event, 'admin');
}

export function requireAgencyOrAdmin(event: APIGatewayProxyEvent): AuthContext {
  return requireRole(event, 'agency', 'admin');
}

// Get user with profile from database
export async function getUserWithProfile(userId: string): Promise<any> {
  const user = await queryOne(`
    SELECT u.*,
           tp.id as tenant_profile_id,
           ap.id as agency_profile_id
    FROM users u
    LEFT JOIN tenant_profiles tp ON tp.user_id = u.id
    LEFT JOIN agency_profiles ap ON ap.user_id = u.id
    WHERE u.cognito_sub = $1
  `, [userId]);

  if (!user) {
    throw new AuthError('User not found');
  }

  return user;
}

// Get tenant profile for current user
export async function getTenantProfile(userId: string): Promise<any> {
  const profile = await queryOne(`
    SELECT tp.*, u.email
    FROM tenant_profiles tp
    JOIN users u ON tp.user_id = u.id
    WHERE u.cognito_sub = $1
  `, [userId]);

  if (!profile) {
    throw new AuthError('Tenant profile not found');
  }

  return profile;
}

// Get agency profile for current user
export async function getAgencyProfile(userId: string): Promise<any> {
  const profile = await queryOne(`
    SELECT ap.*, u.email
    FROM agency_profiles ap
    JOIN users u ON ap.user_id = u.id
    WHERE u.cognito_sub = $1
  `, [userId]);

  if (!profile) {
    throw new AuthError('Agency profile not found');
  }

  return profile;
}

// Custom error class for auth errors
export class AuthError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

// Check if agency has enough credits
export async function checkCredits(agencyId: string, required: number): Promise<boolean> {
  const agency = await queryOne<{ credits: number }>(
    'SELECT credits FROM agency_profiles WHERE id = $1',
    [agencyId]
  );
  return agency ? agency.credits >= required : false;
}

// Deduct credits from agency
export async function deductCredits(
  agencyId: string,
  amount: number,
  description: string,
  relatedTenantId?: string
): Promise<void> {
  await query(`
    WITH updated AS (
      UPDATE agency_profiles
      SET credits = credits - $1,
          credits_used_this_month = credits_used_this_month + $1,
          updated_at = NOW()
      WHERE id = $2 AND credits >= $1
      RETURNING credits
    )
    INSERT INTO credit_transactions (agency_id, type, amount, balance_after, description, related_tenant_id)
    SELECT $2, 'usage', -$1, credits, $3, $4
    FROM updated
  `, [amount, agencyId, description, relatedTenantId]);
}
