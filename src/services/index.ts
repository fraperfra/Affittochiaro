/**
 * Services Index
 *
 * Central export for all API and authentication services.
 */

// API Client
export { default as apiClient, ApiError, getAccessToken, setTokens, clearTokens } from './api/client';
export type { ApiResponse, PaginationInfo, PaginatedResponse } from './api/client';

// Auth Service (Cognito)
export {
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  resendConfirmationCode,
  forgotPassword,
  confirmForgotPassword,
  changePassword,
  getCurrentSession,
  getCurrentUser,
  refreshToken,
  isCognitoConfigured,
} from './cognito/auth';
export type { SignUpParams, AuthUser } from './cognito/auth';

// Tenants API
export { tenantsApi } from './api/tenants';
export type { TenantProfile, TenantFilters, TenantDocument } from './api/tenants';

// Listings API
export { listingsApi, applicationsApi } from './api/listings';
export type {
  Listing,
  ListingImage,
  ListingFilters,
  Application,
  CreateListingData,
} from './api/listings';
