import axios from 'axios';

export interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

const nominatimClient = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
});

export const geocodingApi = {
  search: async (query: string): Promise<GeocodeResult | null> => {
    const { data } = await nominatimClient.get<NominatimSearchResult[]>('/search', {
      params: {
        q: query,
        format: 'jsonv2',
        limit: 1,
        countrycodes: 'co',
      },
    });

    const [first] = data;
    if (!first) return null;

    return {
      displayName: first.display_name,
      latitude: Number(first.lat),
      longitude: Number(first.lon),
    };
  },
};
