"use client";

import { useCallback, useEffect, useState } from "react";

import { reverseGeocodeAction } from "@/shared/actions/geocode";
import {
  Map as MapLibreMap,
  MapMarker,
  MapControls,
  MarkerContent,
  useMap,
} from "@/shared/components/ui/map";
import { cn } from "@/shared/lib/utils";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  className?: string;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lng: number, lat: number) => void;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      onMapClick(e.lngLat.lng, e.lngLat.lat);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  className,
}: LocationPickerProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const hasCoordinates = latitude !== null && longitude !== null;

  const handleReverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsLoadingAddress(true);
      try {
        const result = await reverseGeocodeAction(lat, lng);
        if (result) {
          setAddress(result);
          onLocationChange(lat, lng, result);
        } else {
          setAddress(null);
          onLocationChange(lat, lng);
        }
      } catch {
        setAddress(null);
        onLocationChange(lat, lng);
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [onLocationChange]
  );

  const handleMapClick = useCallback(
    (lng: number, lat: number) => {
      void handleReverseGeocode(lat, lng);
    },
    [handleReverseGeocode]
  );

  const handleMarkerDragEnd = useCallback(
    (lngLat: { lng: number; lat: number }) => {
      void handleReverseGeocode(lngLat.lat, lngLat.lng);
    },
    [handleReverseGeocode]
  );

  const initialViewport = hasCoordinates
    ? { center: [longitude, latitude] as [number, number], zoom: 10 }
    : { center: [0, 20] as [number, number], zoom: 2 };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-[400px] border border-border/40 overflow-hidden cursor-crosshair">
        <MapLibreMap {...initialViewport} className="h-full w-full">
          <MapControls showZoom showLocate />
          <MapClickHandler onMapClick={handleMapClick} />
          {hasCoordinates && (
            <MapMarker
              latitude={latitude}
              longitude={longitude}
              draggable
              onDragEnd={handleMarkerDragEnd}
            >
              <MarkerContent>
                <div className="relative">
                  <div className="h-4 w-4 rounded-full border-2 border-white bg-brand-green shadow-lg" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-0.5 bg-brand-green" />
                </div>
              </MarkerContent>
            </MapMarker>
          )}
        </MapLibreMap>
      </div>
      <div className="px-1">
        {hasCoordinates ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-brand-green">📍</span>
            <span>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
            {address && (
              <>
                <span className="text-border/50">—</span>
                <span className="text-foreground truncate">{address}</span>
              </>
            )}
            {isLoadingAddress && (
              <span className="text-muted-foreground/50">(loading...)</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Click on the map to set a location
          </p>
        )}
      </div>
    </div>
  );
}
