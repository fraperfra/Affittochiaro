# src/services/ — Service Layer

## Pattern
Factory in `services/index.ts` — always import from here, never directly from `mock/` or `api/`.

```ts
import { authService, cvService } from '@/src/services';
```

Switch: `VITE_USE_MOCK_API !== 'false'` → mock, otherwise real AWS.

## Interfaces
- `IAuthService` — login, register, confirmEmail, resendCode, resetPassword, confirmResetPassword
- `ICVService` — getCV, updateSection, uploadDocument

## Implementations
| Interface | Mock | Real (TODO) |
|-----------|------|-------------|
| IAuthService | `mock/mockAuthService.ts` | Cognito (not yet wired) |
| ICVService | `mock/mockCVService.ts` | Lambda API (not yet wired) |

## API Client (`api/client.ts`)
- Base URL from `VITE_API_URL`
- JWT tokens: `getAccessToken()`, `setTokens()`, `clearTokens()`
- `ApiError` class for typed errors
- Endpoints: `api/auth.ts`, `api/tenants.ts`, `api/listings.ts`, `api/cv.ts`, `api/chat.ts`

## AWS Backend (target architecture)
- **Auth**: Cognito User Pools
- **API**: API Gateway → Lambda functions
- **DB**: RDS PostgreSQL (tenant/agency data) + DynamoDB (sessions, notifications)
- **Files**: S3 (avatars, CVs, documents)
- **Async**: SQS + SES (emails, notifications)
- **Target**: 30k+ tenants to import from existing AWS

## Data Bridge (localStorage — mock only)
| Key | Used by |
|-----|---------|
| `affittochiaro_applications` | tenant↔agency applications |
| `affittochiaro_agency_notifications` | agency unread badge |
| `affittochiaro_messages_*` / `_conversations_*` | MessagesPage |
| `affittochiaro_agency_documents` | AgencyDocumentsPage archive |
| `affittochiaro_agency_registered_contracts` | AgencyDocumentsPage contracts |
| `affittochiaro_agency_deadlines` | AgencyDocumentsPage scadenzario |
