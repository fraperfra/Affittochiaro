import { APIGatewayProxyHandler } from 'aws-lambda';
import { query, queryOne } from '../../shared/db/client';
import { success, badRequest, forbidden, internalError, parseQueryParams } from '../../shared/utils/response';
import { requireAgencyOrAdmin, getAgencyProfile } from '../../shared/utils/auth';
import { TenantFilters, TenantProfile } from '../../shared/types';

/**
 * GET /tenants
 *
 * Lists tenant profiles with filtering and pagination.
 * Only accessible by agencies and admins.
 * Sensitive data (contact info, full income) is hidden unless tenant is unlocked.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Require agency or admin role
    const auth = requireAgencyOrAdmin(event);

    // Parse filters
    const filters = parseQueryParams<TenantFilters>(event.queryStringParameters, {
      page: 1,
      limit: 20,
      sortBy: 'profileCompleteness',
      sortOrder: 'desc',
    });

    // Get agency profile to check unlocked tenants
    let agencyId: string | null = null;
    let unlockedTenantIds: string[] = [];

    if (auth.role === 'agency') {
      const agency = await getAgencyProfile(auth.userId);
      agencyId = agency.id;

      // Get list of unlocked tenants for this agency
      const unlocked = await query<{ tenant_id: string }>(
        'SELECT tenant_id FROM unlocked_tenants WHERE agency_id = $1',
        [agencyId]
      );
      unlockedTenantIds = unlocked.map(u => u.tenant_id);
    }

    // Build query
    const conditions: string[] = ['u.status = $1'];
    const params: any[] = ['active'];
    let paramIndex = 2;

    // City filter
    if (filters.city) {
      conditions.push(`tp.current_city ILIKE $${paramIndex++}`);
      params.push(`%${filters.city}%`);
    }

    // Verification filter
    if (filters.isVerified !== undefined) {
      conditions.push(`tp.is_verified = $${paramIndex++}`);
      params.push(filters.isVerified);
    }

    // Video filter
    if (filters.hasVideo !== undefined) {
      conditions.push(`tp.has_video = $${paramIndex++}`);
      params.push(filters.hasVideo);
    }

    // Employment type filter
    if (filters.employmentType) {
      conditions.push(`tp.employment_type = $${paramIndex++}`);
      params.push(filters.employmentType);
    }

    // Min income filter
    if (filters.minIncome) {
      conditions.push(`tp.annual_income >= $${paramIndex++}`);
      params.push(filters.minIncome);
    }

    // Max budget filter (from preferences)
    if (filters.maxBudget) {
      conditions.push(`tpref.max_budget <= $${paramIndex++}`);
      params.push(filters.maxBudget);
    }

    // Pets filter
    if (filters.hasPets !== undefined) {
      conditions.push(`tpref.has_pets = $${paramIndex++}`);
      params.push(filters.hasPets);
    }

    // Only show profiles with at least 30% completeness
    conditions.push('tp.profile_completeness >= 30');

    const whereClause = conditions.join(' AND ');

    // Sorting
    const sortColumns: Record<string, string> = {
      profileCompleteness: 'tp.profile_completeness',
      createdAt: 'tp.created_at',
      lastActive: 'tp.last_active',
    };
    const sortColumn = sortColumns[filters.sortBy || 'profileCompleteness'] || 'tp.profile_completeness';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Count total
    const countResult = await queryOne<{ count: string }>(`
      SELECT COUNT(*) as count
      FROM tenant_profiles tp
      JOIN users u ON tp.user_id = u.id
      LEFT JOIN tenant_preferences tpref ON tp.id = tpref.tenant_id
      WHERE ${whereClause}
    `, params);

    const total = parseInt(countResult?.count || '0');
    const totalPages = Math.ceil(total / filters.limit!);
    const offset = (filters.page! - 1) * filters.limit!;

    // Get paginated results
    const tenants = await query(`
      SELECT
        tp.id,
        tp.first_name,
        tp.last_name,
        tp.avatar_url,
        tp.occupation,
        tp.employment_type,
        tp.current_city,
        tp.is_verified,
        tp.has_video,
        tp.profile_completeness,
        tp.rating,
        tp.reviews_count,
        tp.available_from,
        tp.created_at,
        tpref.max_budget,
        tpref.has_pets,
        tpref.pet_type,
        tpref.preferred_cities,
        -- Sensitive data (only if unlocked or admin)
        CASE WHEN tp.id = ANY($${paramIndex}::uuid[]) OR $${paramIndex + 1} = 'admin'
          THEN tp.annual_income ELSE NULL END as annual_income,
        CASE WHEN tp.id = ANY($${paramIndex}::uuid[]) OR $${paramIndex + 1} = 'admin'
          THEN tp.bio ELSE SUBSTRING(tp.bio, 1, 100) || '...' END as bio
      FROM tenant_profiles tp
      JOIN users u ON tp.user_id = u.id
      LEFT JOIN tenant_preferences tpref ON tp.id = tpref.tenant_id
      WHERE ${whereClause}
      ORDER BY tp.is_verified DESC, ${sortColumn} ${sortOrder}
      LIMIT $${paramIndex + 2} OFFSET $${paramIndex + 3}
    `, [...params, unlockedTenantIds, auth.role, filters.limit, offset]);

    // Transform response
    const tenantsWithUnlockStatus = tenants.map(t => ({
      ...t,
      isUnlocked: unlockedTenantIds.includes(t.id) || auth.role === 'admin',
      incomeRange: t.annual_income ? getIncomeRange(t.annual_income) : null,
    }));

    return success(tenantsWithUnlockStatus, {
      page: filters.page!,
      limit: filters.limit!,
      total,
      totalPages,
    });

  } catch (error: any) {
    console.error('Error listing tenants:', error);

    if (error.name === 'AuthError') {
      return forbidden(error.message);
    }

    return internalError('Failed to list tenants');
  }
};

// Helper to convert annual income to range string (privacy)
function getIncomeRange(annualIncome: number): string {
  const monthly = annualIncome / 12;
  if (monthly < 1500) return '< €1.500/mese';
  if (monthly < 2000) return '€1.500 - €2.000/mese';
  if (monthly < 2500) return '€2.000 - €2.500/mese';
  if (monthly < 3000) return '€2.500 - €3.000/mese';
  if (monthly < 4000) return '€3.000 - €4.000/mese';
  if (monthly < 5000) return '€4.000 - €5.000/mese';
  return '> €5.000/mese';
}
