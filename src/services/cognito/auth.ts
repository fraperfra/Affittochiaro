/**
 * AWS Cognito Authentication Service
 *
 * Handles user authentication flows:
 * - Sign up (tenant/agency)
 * - Sign in
 * - Sign out
 * - Password reset
 * - Email verification
 * - Token refresh
 */

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { setTokens, clearTokens } from '../api/client';

// Cognito configuration
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '';

// Initialize user pool
const poolData = {
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
};

let userPool: CognitoUserPool | null = null;

function getUserPool(): CognitoUserPool {
  if (!userPool) {
    if (!USER_POOL_ID || !CLIENT_ID) {
      console.warn('Cognito not configured. Using mock authentication.');
      throw new Error('Cognito not configured');
    }
    userPool = new CognitoUserPool(poolData);
  }
  return userPool;
}

// Types
export interface SignUpParams {
  email: string;
  password: string;
  role: 'tenant' | 'agency';
  firstName: string;
  lastName: string;
  phone?: string;
  // Tenant-specific
  occupation?: string;
  employmentType?: string;
  monthlyIncome?: string;
  city?: string;
  maxBudget?: string;
  hasPets?: boolean;
  // Agency-specific
  agencyName?: string;
  vatNumber?: string;
}

export interface AuthUser {
  sub: string;
  email: string;
  role: 'tenant' | 'agency' | 'admin';
  profileId?: string;
  emailVerified: boolean;
}

// Sign Up
export async function signUp(params: SignUpParams): Promise<ISignUpResult> {
  const { email, password, role, ...metadata } = params;

  const pool = getUserPool();

  const attributeList: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: 'email', Value: email }),
  ];

  // Convert metadata to client metadata for Lambda trigger
  const clientMetadata: Record<string, string> = {
    role,
    firstName: metadata.firstName || '',
    lastName: metadata.lastName || '',
  };

  // Add optional fields
  if (metadata.phone) clientMetadata.phone = metadata.phone;
  if (metadata.occupation) clientMetadata.occupation = metadata.occupation;
  if (metadata.employmentType) clientMetadata.employmentType = metadata.employmentType;
  if (metadata.monthlyIncome) clientMetadata.monthlyIncome = metadata.monthlyIncome;
  if (metadata.city) clientMetadata.city = metadata.city;
  if (metadata.maxBudget) clientMetadata.maxBudget = metadata.maxBudget;
  if (metadata.hasPets !== undefined) clientMetadata.hasPets = String(metadata.hasPets);
  if (metadata.agencyName) clientMetadata.agencyName = metadata.agencyName;
  if (metadata.vatNumber) clientMetadata.vatNumber = metadata.vatNumber;

  return new Promise((resolve, reject) => {
    pool.signUp(
      email,
      password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          reject(mapCognitoError(err));
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Sign up failed'));
        }
      },
      clientMetadata
    );
  });
}

// Confirm Sign Up (email verification)
export async function confirmSignUp(email: string, code: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(mapCognitoError(err));
      } else {
        resolve();
      }
    });
  });
}

// Resend confirmation code
export async function resendConfirmationCode(email: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(mapCognitoError(err));
      } else {
        resolve();
      }
    });
  });
}

// Sign In
export async function signIn(email: string, password: string): Promise<CognitoUserSession> {
  const pool = getUserPool();

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        // Store tokens
        setTokens(
          session.getAccessToken().getJwtToken(),
          session.getRefreshToken().getToken()
        );
        resolve(session);
      },
      onFailure: (err) => {
        reject(mapCognitoError(err));
      },
      newPasswordRequired: (userAttributes) => {
        reject({
          code: 'NewPasswordRequired',
          message: 'Devi impostare una nuova password',
          userAttributes,
        });
      },
    });
  });
}

// Sign Out
export function signOut(): void {
  try {
    const pool = getUserPool();
    const cognitoUser = pool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
  } catch {
    // Cognito not configured, just clear tokens
  }
  clearTokens();
}

// Get current session
export async function getCurrentSession(): Promise<CognitoUserSession | null> {
  try {
    const pool = getUserPool();
    const cognitoUser = pool.getCurrentUser();

    if (!cognitoUser) {
      return null;
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          resolve(null);
        } else {
          // Update stored tokens
          setTokens(
            session.getAccessToken().getJwtToken(),
            session.getRefreshToken().getToken()
          );
          resolve(session);
        }
      });
    });
  } catch {
    return null;
  }
}

// Get current user info from token
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const idToken = session.getIdToken();
  const payload = idToken.decodePayload();

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload['custom:role'] || 'tenant',
    profileId: payload['custom:profile_id'],
    emailVerified: payload.email_verified === true || payload.email_verified === 'true',
  };
}

// Refresh token
export async function refreshToken(): Promise<CognitoUserSession | null> {
  try {
    const pool = getUserPool();
    const cognitoUser = pool.getCurrentUser();

    if (!cognitoUser) {
      return null;
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          resolve(null);
          return;
        }

        const refreshToken = session.getRefreshToken();
        cognitoUser.refreshSession(refreshToken, (refreshErr, newSession) => {
          if (refreshErr) {
            resolve(null);
          } else {
            setTokens(
              newSession.getAccessToken().getJwtToken(),
              newSession.getRefreshToken().getToken()
            );
            resolve(newSession);
          }
        });
      });
    });
  } catch {
    return null;
  }
}

// Forgot Password - initiate
export async function forgotPassword(email: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(mapCognitoError(err)),
    });
  });
}

// Forgot Password - confirm
export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(mapCognitoError(err)),
    });
  });
}

// Change password (authenticated)
export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = pool.getCurrentUser();

  if (!cognitoUser) {
    throw new Error('Non sei autenticato');
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        reject(new Error('Sessione non valida'));
        return;
      }

      cognitoUser.changePassword(oldPassword, newPassword, (changeErr) => {
        if (changeErr) {
          reject(mapCognitoError(changeErr));
        } else {
          resolve();
        }
      });
    });
  });
}

// Helper to map Cognito errors to Italian messages
function mapCognitoError(error: any): Error {
  const code = error.code || error.name;
  const message = error.message;

  const errorMessages: Record<string, string> = {
    UsernameExistsException: 'Esiste già un account con questa email',
    UserNotFoundException: 'Account non trovato',
    NotAuthorizedException: 'Email o password non corretti',
    UserNotConfirmedException: 'Devi confermare il tuo account. Controlla la tua email.',
    CodeMismatchException: 'Codice di verifica non valido',
    ExpiredCodeException: 'Il codice di verifica è scaduto. Richiedine uno nuovo.',
    InvalidPasswordException: 'La password non rispetta i requisiti di sicurezza',
    LimitExceededException: 'Troppi tentativi. Riprova più tardi.',
    InvalidParameterException: 'Parametri non validi',
    TooManyRequestsException: 'Troppe richieste. Attendi qualche minuto.',
  };

  const italianMessage = errorMessages[code] || message || 'Si è verificato un errore';

  const mappedError = new Error(italianMessage);
  (mappedError as any).code = code;
  return mappedError;
}

// Check if Cognito is configured
export function isCognitoConfigured(): boolean {
  return Boolean(USER_POOL_ID && CLIENT_ID);
}
