import type { ReportStatus, UserRole } from '@safecity/shared-types';

export type UserStatus =
  | 'PENDIENTE_VERIFICACION'
  | 'ACTIVO'
  | 'SUSPENDIDO'
  | 'ELIMINADO';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  photoUrl: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface IncidentTypeSummary {
  id: string;
  code: string;
  label: string;
}

export interface IncidentType extends IncidentTypeSummary {
  icon: string | null;
  color: string | null;
  defaultValidityHours: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocalitySummary {
  id: string;
  name: string;
}

export interface Locality extends LocalitySummary {
  createdAt: string;
}

export interface NeighborhoodSummary {
  id: string;
  name: string;
}

export interface Neighborhood extends NeighborhoodSummary {
  locality: LocalitySummary;
}

export interface ReportOwnerSummary {
  id: string;
  name: string;
  photoUrl: string | null;
}

export interface Report {
  id: string;
  description: string | null;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  visibleOnMap: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  incidentType: IncidentTypeSummary;
  locality: LocalitySummary;
  neighborhood: NeighborhoodSummary | null;
  user: ReportOwnerSummary | null;
  confirmationCount: number;
  confirmedByMe: boolean;
}

export interface Confirmation {
  reportId: string;
  confirmedBy: string;
  confirmedAt: string;
}

export interface Reputation {
  id: string;
  name: string;
  reputation: number;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface ReportsQuery {
  incidentTypeId?: string;
  localityId?: string;
  neighborhoodId?: string;
  userId?: string;
  status?: ReportStatus;
  page?: number;
  limit?: number;
}

export interface CreateReportPayload {
  incidentTypeId: string;
  localityId: string;
  neighborhoodId?: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface UpdateReportPayload {
  description: string;
}

export interface IncidentTypesQuery {
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface LocalitiesQuery {
  page?: number;
  limit?: number;
}

export interface NeighborhoodsQuery {
  localityId?: string;
  page?: number;
  limit?: number;
}
