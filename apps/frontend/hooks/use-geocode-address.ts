'use client';

import { useMutation } from '@tanstack/react-query';
import { geocodingApi } from '@/lib/api/geocoding.api';

export function useGeocodeAddress() {
  return useMutation({
    mutationFn: (address: string) => geocodingApi.search(address),
  });
}
