# src/ — App Frontend

## Stack
React 19 · TypeScript · Vite 6 · Tailwind CSS (PostCSS) · Zustand · React Router v7

## Directory Map
```
src/
  components/
    layout/     # DashboardLayout, BottomTabNav, Header/Footer wrappers
    ui/         # Design system: Button, Card, Input, Modal, EmptyState, Badge…
    profile/    # ProfileEditForm, ProfileEditModal, ProfileCompletionCard
  pages/
    tenant/     # TenantDashboardPage, TenantCVPage, TenantProfilePage…
    agency/     # AgencyDashboardPage, AgencyDocumentsPage, TenantSearchPage…
    admin/      # AdminDashboardPage, TenantsManagementPage…
  services/     # Service layer — see services/CLAUDE.md
  store/        # Zustand stores
  types/        # Shared TS types
  utils/        # constants, validators, formatters, mockData
  styles/       # design-tokens.css
```

## Zustand Stores (`src/store/`)
| Store | Key state |
|-------|-----------|
| `authStore` | user, isAuthenticated, pendingConfirmation, login/register/quickLogin |
| `cvStore` | cv data, completeness |
| `tenantStore` | tenant profile |
| `agencyStore` | agency profile, credits |
| `listingStore` | listings, applications |
| `notificationStore` | notifications, unreadCount |

Auth store has: `pendingConfirmation`, `confirmEmail`, `resendCode`, `resetPassword`, `confirmResetPassword`.

## Key Type Notes
- `TenantProfile.avatarUrl` (not `.avatar`), `AgencyProfile.logoUrl` (not `.logo`)
- `CVCompleteness.total` (not `.overall`)
- `CVGuarantor.fullName` (not firstName/lastName)
- `Status` includes `'suspended'`
- `ContractType` in tenant.ts, `TenantPreferences.preferredContractType`

## Routing
```
/               → HomePage (landing)
/login          → LoginPage
/register       → RegisterPage
/tenant/*       → Tenant dashboard area
/agency/*       → Agency dashboard area
/admin/*        → Admin panel
```
Path alias: `@/` → project root

## Styling
- Tailwind config: `tailwind.config.js` (PostCSS, not CDN)
- Design tokens: `src/styles/design-tokens.css`
- Global styles: `src/index.css` (components, utilities)
- Key colors: `primary-500` #00C48C · `teal-700` #0A5E4D · `accent-500` #FF6B35
- Modal z-index: `z-[110]` (above BottomTabNav `z-100`)
- EmptyState `icon` prop accepts `React.ReactNode` (pass `<Icon size={40} />`)

## Mobile Layout Rules
- `BottomTabNav` fixed bottom, `z-index: 100`, height ~88px
- All modals must use `z-[110]` and `pb-[88px] md:pb-0` on mobile overlay
- Settings tabs open as full-screen via `?tab=xxx` URL param on mobile
