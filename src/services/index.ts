/**
 * Services — mock only.
 * Ogni store e componente importa da qui.
 */

// ============================================================
// AUTH SERVICE
// ============================================================
export type { IAuthService, RegisterData } from './auth/IAuthService';

import { mockAuthApi } from './mock/mockAuthService';
export { MOCK_USERS } from './mock/mockAuthService';

export const authService = mockAuthApi;

// ============================================================
// CV SERVICE
// ============================================================
export type { ICVService } from './cv/ICVService';

import { mockCVService } from './mock/mockCVService';
export const cvService = mockCVService;
