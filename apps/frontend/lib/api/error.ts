import { isAxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/api';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado. Intenta nuevamente.',
): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (message) {
      return Array.isArray(message) ? message.join(' ') : message;
    }
    if (error.message) {
      return error.message;
    }
  }
  return fallback;
}
