// Common types used across the application

export type UserRole = 'tenant' | 'agency' | 'admin';

export type Status = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';

export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: Pagination;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface Badge {
  id: string;
  type: 'verified' | 'video' | 'premium' | 'trusted' | 'new';
  label: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface FilterConfig {
  [key: string]: string | number | boolean | string[] | undefined;
}
