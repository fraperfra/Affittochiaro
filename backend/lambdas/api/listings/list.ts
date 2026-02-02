import { APIGatewayProxyHandler } from 'aws-lambda';
import { query, queryOne } from '../../shared/db/client';
import { success, internalError, parseQueryParams } from '../../shared/utils/response';
import { ListingFilters, Listing } from '../../shared/types';

/**
 * GET /listings
 *
 * Lists property listings with filtering and pagination.
 * Public endpoint - no authentication required.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse filters
    const filters = parseQueryParams<ListingFilters>(event.queryStringParameters, {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    // Build query conditions
    const conditions: string[] = ['l.status = $1'];
    const params: any[] = ['active'];
    let paramIndex = 2;

    // City filter
    if (filters.city) {
      conditions.push(`l.city ILIKE $${paramIndex++}`);
      params.push(`%${filters.city}%`);
    }

    // Property type filter
    if (filters.propertyType) {
      conditions.push(`l.property_type = $${paramIndex++}`);
      params.push(filters.propertyType);
    }

    // Price range
    if (filters.minPrice) {
      conditions.push(`l.price >= $${paramIndex++}`);
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      conditions.push(`l.price <= $${paramIndex++}`);
      params.push(filters.maxPrice);
    }

    // Rooms filter
    if (filters.minRooms) {
      conditions.push(`l.rooms >= $${paramIndex++}`);
      params.push(filters.minRooms);
    }
    if (filters.maxRooms) {
      conditions.push(`l.rooms <= $${paramIndex++}`);
      params.push(filters.maxRooms);
    }

    // Pets allowed
    if (filters.petsAllowed !== undefined) {
      conditions.push(`l.pets_allowed = $${paramIndex++}`);
      params.push(filters.petsAllowed);
    }

    // Furnished
    if (filters.furnished) {
      conditions.push(`l.furnished = $${paramIndex++}`);
      params.push(filters.furnished);
    }

    // Agency filter
    if (filters.agencyId) {
      conditions.push(`l.agency_id = $${paramIndex++}`);
      params.push(filters.agencyId);
    }

    const whereClause = conditions.join(' AND ');

    // Sorting
    const sortColumns: Record<string, string> = {
      price: 'l.price',
      createdAt: 'l.created_at',
      views: 'l.views',
    };
    const sortColumn = sortColumns[filters.sortBy || 'createdAt'] || 'l.created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Count total
    const countResult = await queryOne<{ count: string }>(`
      SELECT COUNT(*) as count
      FROM listings l
      WHERE ${whereClause}
    `, params);

    const total = parseInt(countResult?.count || '0');
    const totalPages = Math.ceil(total / filters.limit!);
    const offset = (filters.page! - 1) * filters.limit!;

    // Get paginated results with agency info and primary image
    const listings = await query(`
      SELECT
        l.id,
        l.title,
        l.description,
        l.property_type,
        l.city,
        l.zone,
        l.price,
        l.expenses,
        l.deposit,
        l.rooms,
        l.bathrooms,
        l.square_meters,
        l.floor,
        l.features,
        l.furnished,
        l.energy_class,
        l.available_from,
        l.pets_allowed,
        l.smoking_allowed,
        l.students_allowed,
        l.couples_allowed,
        l.views,
        l.applications_count,
        l.is_highlighted,
        l.created_at,
        l.external_source,
        ap.id as agency_id,
        ap.name as agency_name,
        ap.logo_url as agency_logo,
        ap.is_verified as agency_verified,
        (
          SELECT url FROM listing_images li
          WHERE li.listing_id = l.id AND li.is_primary = true
          LIMIT 1
        ) as primary_image,
        (
          SELECT COUNT(*) FROM listing_images li WHERE li.listing_id = l.id
        )::int as images_count
      FROM listings l
      JOIN agency_profiles ap ON l.agency_id = ap.id
      WHERE ${whereClause}
      ORDER BY l.is_highlighted DESC, ${sortColumn} ${sortOrder}
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `, [...params, filters.limit, offset]);

    return success(listings, {
      page: filters.page!,
      limit: filters.limit!,
      total,
      totalPages,
    });

  } catch (error: any) {
    console.error('Error listing listings:', error);
    return internalError('Failed to list listings');
  }
};
