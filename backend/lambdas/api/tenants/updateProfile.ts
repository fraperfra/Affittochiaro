import { APIGatewayProxyHandler } from 'aws-lambda';
import { success, badRequest, internalError, unauthorized } from '../../shared/utils/response';
import { requireTenant, AuthError } from '../../shared/utils/auth';
import { queryOne } from '../../shared/db/client';

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
  // Employment
  occupation?: string;
  employmentType?: string;
  employer?: string;
  annualIncome?: number;
  incomeVisible?: boolean;
  // Location
  currentCity?: string;
  // Availability
  availableFrom?: string;
}

// Calculate profile completeness based on filled fields
function calculateCompleteness(profile: any): number {
  const weights: Record<string, number> = {
    first_name: 10,
    last_name: 10,
    avatar_url: 10,
    bio: 15,
    occupation: 10,
    employment_type: 10,
    annual_income: 15,
    current_city: 5,
    has_video: 15,
  };

  let total = 0;
  let earned = 0;

  for (const [field, weight] of Object.entries(weights)) {
    total += weight;
    if (profile[field]) {
      earned += weight;
    }
  }

  return Math.round((earned / total) * 100);
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const auth = requireTenant(event);

    if (!event.body) {
      return badRequest('Request body is required');
    }

    let data: UpdateProfileRequest;
    try {
      data = JSON.parse(event.body);
    } catch {
      return badRequest('Invalid JSON body');
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const fieldMappings: Record<keyof UpdateProfileRequest, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      dateOfBirth: 'date_of_birth',
      bio: 'bio',
      occupation: 'occupation',
      employmentType: 'employment_type',
      employer: 'employer',
      annualIncome: 'annual_income',
      incomeVisible: 'income_visible',
      currentCity: 'current_city',
      availableFrom: 'available_from',
    };

    for (const [jsField, dbField] of Object.entries(fieldMappings)) {
      if (data[jsField as keyof UpdateProfileRequest] !== undefined) {
        updates.push(`${dbField} = $${paramIndex}`);
        values.push(data[jsField as keyof UpdateProfileRequest]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return badRequest('No fields to update');
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);

    // Execute update and return updated profile
    const query = `
      UPDATE tenant_profiles tp
      SET ${updates.join(', ')}
      FROM users u
      WHERE tp.user_id = u.id
        AND u.cognito_sub = $${paramIndex}
      RETURNING
        tp.id,
        u.email,
        tp.first_name,
        tp.last_name,
        tp.avatar_url,
        tp.date_of_birth,
        tp.bio,
        tp.occupation,
        tp.employment_type,
        tp.employer,
        tp.annual_income,
        tp.income_visible,
        tp.employment_start_date,
        tp.is_verified,
        tp.has_video,
        tp.video_url,
        tp.video_duration,
        tp.profile_completeness,
        tp.rating,
        tp.reviews_count,
        tp.current_city,
        tp.profile_views,
        tp.applications_sent,
        tp.matches_received,
        tp.available_from,
        tp.created_at,
        tp.updated_at
    `;

    values.push(auth.userId);

    const updatedProfile = await queryOne<any>(query, values);

    if (!updatedProfile) {
      return unauthorized('Profilo non trovato');
    }

    // Update profile completeness
    const completeness = calculateCompleteness(updatedProfile);
    if (completeness !== updatedProfile.profile_completeness) {
      await queryOne(`
        UPDATE tenant_profiles
        SET profile_completeness = $1
        WHERE id = $2
      `, [completeness, updatedProfile.id]);
      updatedProfile.profile_completeness = completeness;
    }

    // Format response
    const response = {
      id: updatedProfile.id,
      email: updatedProfile.email,
      firstName: updatedProfile.first_name || '',
      lastName: updatedProfile.last_name || '',
      avatarUrl: updatedProfile.avatar_url,
      dateOfBirth: updatedProfile.date_of_birth,
      bio: updatedProfile.bio,
      occupation: updatedProfile.occupation,
      employmentType: updatedProfile.employment_type,
      employer: updatedProfile.employer,
      annualIncome: updatedProfile.annual_income ? parseFloat(updatedProfile.annual_income) : null,
      incomeVisible: updatedProfile.income_visible,
      employmentStartDate: updatedProfile.employment_start_date,
      isVerified: updatedProfile.is_verified,
      hasVideo: updatedProfile.has_video,
      videoUrl: updatedProfile.video_url,
      videoDuration: updatedProfile.video_duration,
      profileCompleteness: updatedProfile.profile_completeness,
      rating: updatedProfile.rating ? parseFloat(updatedProfile.rating) : null,
      reviewsCount: updatedProfile.reviews_count,
      currentCity: updatedProfile.current_city,
      profileViews: updatedProfile.profile_views,
      applicationsSent: updatedProfile.applications_sent,
      matchesReceived: updatedProfile.matches_received,
      availableFrom: updatedProfile.available_from,
      createdAt: updatedProfile.created_at,
      updatedAt: updatedProfile.updated_at,
    };

    return success(response);
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof AuthError) {
      return unauthorized(error.message);
    }
    return internalError('Internal server error');
  }
};
