'use client';

import { useEffect, useMemo, useRef } from 'react';
import L, { type LeafletMouseEvent } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LEAFLET_VERSION = '1.9.4';
const ICON_BASE_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/images`;

const markerIcon = L.icon({
  iconRetinaUrl: `${ICON_BASE_URL}/marker-icon-2x.png`,
  iconUrl: `${ICON_BASE_URL}/marker-icon.png`,
  shadowUrl: `${ICON_BASE_URL}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BOGOTA_CENTER: [number, number] = [4.6097, -74.0817];
const DEFAULT_ZOOM = 11;
const SELECTED_ZOOM = 16;

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

function ClickToPlaceMarker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function RecenterOnChange({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();
  const lastCentered = useRef<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    const key = `${latitude},${longitude}`;
    if (lastCentered.current === key) return;
    lastCentered.current = key;
    map.setView([latitude, longitude], Math.max(map.getZoom(), SELECTED_ZOOM));
  }, [latitude, longitude, map]);

  return null;
}

export function LocationMap({ latitude, longitude, onChange }: LocationMapProps) {
  const hasPosition = latitude !== null && longitude !== null;
  const position = useMemo<[number, number]>(
    () => (hasPosition ? [latitude as number, longitude as number] : BOGOTA_CENTER),
    [hasPosition, latitude, longitude],
  );

  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={position}
        zoom={hasPosition ? SELECTED_ZOOM : DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickToPlaceMarker onChange={onChange} />
        <RecenterOnChange latitude={latitude} longitude={longitude} />
        {hasPosition && (
          <Marker
            position={position}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const { lat, lng } = (event.target as L.Marker).getLatLng();
                onChange(lat, lng);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
