# src/pages/ — Page Areas

## Tenant Pages (`tenant/`)
| File | Route | Notes |
|------|-------|-------|
| TenantDashboardPage | /tenant | Budget calc, profile card, stats |
| TenantCVPage | /tenant/cv | 4 edit modals: rental history, refs, guarantors, docs |
| TenantProfilePage | /tenant/profile | Hobbies use lucide icons (not emoji) |
| TenantOnboardingPage | /tenant/onboarding | Multi-step first-run |
| TenantSearchPage→ListingsPage | /tenant/listings | Application flow |
| TenantAgenciesPage | /tenant/agencies | Browse + detail modal |
| MessagesPage | /tenant/messages | Shared with agency |
| SettingsPage | /settings | Shared tenant/agency; mobile: `?tab=xxx` full-screen |
| TenantMorePage | /tenant/more | Mobile profile menu + Extra Visibilità banner |

## Agency Pages (`agency/`)
| File | Route | Notes |
|------|-------|-------|
| AgencyDashboardPage | /agency | Stats, recent activity |
| TenantSearchPage | /agency/tenants | 245 mock tenants, matching algo, PDF export |
| MyListingsPage | /agency/listings | CRUD + applications modal per listing |
| ApplicationsPage | /agency/applications | Also in BottomTabNav (5th tab) |
| AgencyDocumentsPage | /agency/documents | 3 tabs: archive / contratti registrati / scadenzario |
| AgencyCalculatorsPage | /agency/calculators | 14 real estate calculators |
| AgencyMorePage | /agency/more | Mobile-only profile menu |
| AgencyUnlockedProfilesPage | /agency/unlocked | Viewed tenant profiles |

## Admin Pages (`admin/`)
TenantsManagementPage · AgenciesManagementPage · ListingsManagementPage ·
AdminApplicationsPage · AdminTicketsPage · AdminAdsPage · AdminBlogPage ·
AdminServicesManagementPage · AdminZonesPage · CMSAdminPage

## Shared Pages
- `LoginPage` / `RegisterPage` — split-screen layout (form left, branded panel right)
- `ConfirmEmailPage` / `ForgotPasswordPage`
- `MessagesPage` — shared by tenant + agency (listing filter for agency)
- `SettingsPage` — shared; dark theme + 2FA marked "coming soon"

## Mobile Navigation Pattern
BottomTabNav tabs per role:
- **Tenant**: Home · Annunci · CV · Notifiche · Altro
- **Agency**: Home · Cerca · Annunci · Candidature (badge) · Altro
