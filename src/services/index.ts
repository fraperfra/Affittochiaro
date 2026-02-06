/**
 * Services Factory
 *
 * Switch automatico tra mock (sviluppo locale) e servizi reali (produzione).
 * Controllato dalla variabile d'ambiente VITE_USE_MOCK_API.
 *
 * Ogni store e componente importa da qui, mai direttamente dal mock o dall'API.
 */

// Feature flags
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// ============================================================
// AUTH SERVICE
// ============================================================
export type { IAuthService, RegisterData } from './auth/IAuthService';

// Import mock (sempre disponibile)
import { mockAuthApi } from './mock/mockAuthService';
export { MOCK_USERS } from './mock/mockAuthService';

// Factory: in futuro, se USE_MOCK === false, importa cognitoAuthService
// Per ora, mock e' l'unica implementazione disponibile
export const authService = mockAuthApi;

// ============================================================
// CV SERVICE
// ============================================================
export type { ICVService } from './cv/ICVService';

import { mockCVService } from './mock/mockCVService';
// import { cvApiService } from './cv/cvApiService'; // Da implementare con backend
export const cvService = mockCVService; // USE_MOCK ? mockCVService : cvApiService

// ============================================================
// API CLIENT (sempre disponibile per chiamate dirette)
// ============================================================
export {
  default as apiClient,
  ApiError,
  getAccessToken,
  setTokens,
  clearTokens,
} from './api/client';
export type { ApiResponse, PaginationInfo, PaginatedResponse } from './api/client';

// ============================================================
// TENANTS API
// ============================================================
export { tenantsApi } from './api/tenants';

// ============================================================
// LISTINGS API
// ============================================================
export { listingsApi, applicationsApi } from './api/listings';
