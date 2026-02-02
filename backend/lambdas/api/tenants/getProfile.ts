import { APIGatewayProxyHandler } from 'aws-lambda';
import { success, internalError, unauthorized } from '../../shared/utils/response';
import { requireTenant, AuthError } from '../../shared/utils/auth';
import { queryOne } from '../../shared/db/client';

interface TenantProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  // Employment
  occupation: string | null;
  employmentType: string | null;
  employer: string | null;
  annualIncome: number | null;
  incomeVisible: boolean;
  employmentStartDate: string | null;
  // Verification
  isVerified: boolean;
  hasVideo: boolean;
  videoUrl: string | null;
  videoDuration: number | null;
  // Profile metrics
  profileCompleteness: number;
  rating: number | null;
  reviewsCount: number;
  // Location
  currentCity: string | null;
  // Stats
  profileViews: number;
  applicationsSent: number;
  matchesReceived: number;
  availableFrom: string | null;
  createdAt: string;
  updatedAt: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const auth = requireTenant(event);

    const profile = await queryOne<any>(`
      SELECT
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
      FROM tenant_profiles tp
      JOIN users u ON tp.user_id = u.id
      WHERE u.cognito_sub = $1
    `, [auth.userId]);

    if (!profile) {
      return unauthorized('Profilo non trovato');
    }

    const response: TenantProfileResponse = {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      avatarUrl: profile.avatar_url,
      dateOfBirth: profile.date_of_birth,
      bio: profile.bio,
      occupation: profile.occupation,
      employmentType: profile.employment_type,
      employer: profile.employer,
      annualIncome: profile.annual_income ? parseFloat(profile.annual_income) : null,
      incomeVisible: profile.income_visible,
      employmentStartDate: profile.employment_start_date,
      isVerified: profile.is_verified,
      hasVideo: profile.has_video,
      videoUrl: profile.video_url,
      videoDuration: profile.video_duration,
      profileCompleteness: profile.profile_completeness,
      rating: profile.rating ? parseFloat(profile.rating) : null,
      reviewsCount: profile.reviews_count,
      currentCity: profile.current_city,
      profileViews: profile.profile_views,
      applicationsSent: profile.applications_sent,
      matchesReceived: profile.matches_received,
      availableFrom: profile.available_from,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
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
