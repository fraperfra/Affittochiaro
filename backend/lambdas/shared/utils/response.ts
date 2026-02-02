import { APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponse, PaginationInfo } from '../types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

export function apiResponse<T>(
  statusCode: number,
  body: ApiResponse<T> | { error: string } | T,
  headers?: Record<string, string>
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, ...headers },
    body: JSON.stringify(body),
  };
}

export function success<T>(data: T, pagination?: PaginationInfo): APIGatewayProxyResult {
  const response: ApiResponse<T> = {
    success: true,
    data,
    pagination,
  };
  return apiResponse(200, response);
}

export function created<T>(data: T, message?: string): APIGatewayProxyResult {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message: message || 'Resource created successfully',
  };
  return apiResponse(201, response);
}

export function noContent(): APIGatewayProxyResult {
  return {
    statusCode: 204,
    headers: CORS_HEADERS,
    body: '',
  };
}

export function badRequest(message: string): APIGatewayProxyResult {
  return apiResponse(400, { success: false, error: message });
}

export function unauthorized(message: string = 'Unauthorized'): APIGatewayProxyResult {
  return apiResponse(401, { success: false, error: message });
}

export function forbidden(message: string = 'Forbidden'): APIGatewayProxyResult {
  return apiResponse(403, { success: false, error: message });
}

export function notFound(message: string = 'Resource not found'): APIGatewayProxyResult {
  return apiResponse(404, { success: false, error: message });
}

export function conflict(message: string): APIGatewayProxyResult {
  return apiResponse(409, { success: false, error: message });
}

export function unprocessableEntity(message: string): APIGatewayProxyResult {
  return apiResponse(422, { success: false, error: message });
}

export function internalError(message: string = 'Internal server error'): APIGatewayProxyResult {
  return apiResponse(500, { success: false, error: message });
}

// Parse query parameters with defaults
export function parseQueryParams<T extends Record<string, any>>(
  params: Record<string, string | undefined> | null,
  defaults?: Partial<T>
): T {
  const result: Record<string, any> = { ...defaults };

  if (!params) return result as T;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;

    // Handle booleans
    if (value === 'true') {
      result[key] = true;
    } else if (value === 'false') {
      result[key] = false;
    }
    // Handle numbers
    else if (!isNaN(Number(value)) && key !== 'city' && key !== 'sortBy') {
      result[key] = Number(value);
    }
    // Handle arrays (comma-separated)
    else if (value.includes(',')) {
      result[key] = value.split(',').map(v => v.trim());
    }
    // Handle strings
    else {
      result[key] = value;
    }
  }

  // Set pagination defaults
  if (!result.page) result.page = 1;
  if (!result.limit) result.limit = 20;
  if (result.limit > 100) result.limit = 100;

  return result as T;
}

// Parse JSON body safely
export function parseBody<T>(body: string | null): T | null {
  if (!body) return null;
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

// Extract path parameter
export function getPathParam(
  params: Record<string, string | undefined> | null,
  key: string
): string | null {
  return params?.[key] || null;
}
