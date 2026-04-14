"use client";

import { Check, Loader2, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  geocodeSuggestAction,
  reverseGeocodeAction,
} from "@/shared/actions/geocode";
import type { GeocodeSuggestion } from "@/shared/lib/geocoding";
import { cn } from "@/shared/lib/utils";
import {
  Map as MapLibreMap,
  MapControls,
  MapMarker,
  MarkerContent,
  useMap,
} from "@/ui/map";
import type { MapRef } from "@/ui/map";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LocationAutocompleteProps {
  /** Current location text (free-form name) */
  value: string;
  /** Current latitude (null = not geocoded yet) */
  latitude: number | null;
  /** Current longitude (null = not geocoded yet) */
  longitude: number | null;
  /** Called on any change — text, coords, or both */
  onChange: (value: string, lat: number | null, lng: number | null) => void;
  /** Input placeholder */
  placeholder?: string;
  /** Tailwind class for the input */
  className?: string;
}

// ─── MapClickHandler + FlyTo (inside Map context) ────────────────────────────

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lng: number, lat: number) => void;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const handle = (e: maplibregl.MapMouseEvent) =>
      onMapClick(e.lngLat.lng, e.lngLat.lat);

    map.on("click", handle);
    return () => {
      map.off("click", handle);
    };
  }, [map, onMapClick]);

  return null;
}

// ─── LocationAutocomplete ─────────────────────────────────────────────────────

const DEBOUNCE_MS = 400;

export function LocationAutocomplete({
  value,
  latitude,
  longitude,
  onChange,
  placeholder = "San Francisco, CA",
  className,
}: LocationAutocompleteProps) {
  const mapRef = useRef<MapRef>(null);

  const [query, setQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<GeocodeSuggestion | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasCoordinates = latitude !== null && longitude !== null;

  // Sync when parent value changes externally (e.g. Luma import)
  useEffect(() => {
    setQuery(value);
    if (!value) {
      setSuggestions([]);
      setSelectedSuggestion(null);
    }
  }, [value]);

  // Debounced search
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setQuery(text);
      setSelectedSuggestion(null);
      onChange(text, null, null);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!text.trim() || text.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await geocodeSuggestAction(text);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch {
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, DEBOUNCE_MS);
    },
    [onChange]
  );

  // User picks a suggestion from the list
  const handleSelect = useCallback(
    (suggestion: GeocodeSuggestion) => {
      setQuery(suggestion.shortName);
      setSelectedSuggestion(suggestion);
      setSuggestions([]);
      setShowSuggestions(false);
      onChange(suggestion.shortName, suggestion.latitude, suggestion.longitude);

      // Fly the map to the selected location
      mapRef.current?.flyTo({
        center: [suggestion.longitude, suggestion.latitude],
        duration: 1200,
        zoom: 10,
      });
    },
    [onChange]
  );

  // User clicks on the map → reverse geocode → update everything
  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
      // Immediately move marker
      onChange(query, lat, lng);

      setIsLoadingAddress(true);
      try {
        const address = await reverseGeocodeAction(lat, lng);
        if (address) {
          setQuery(address);
          onChange(address, lat, lng);
        }
      } catch {
        /* leave as-is */
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [onChange, query]
  );

  // Drag end on map marker
  const handleDragEnd = useCallback(
    async (lngLat: { lng: number; lat: number }) => {
      onChange(query, lngLat.lat, lngLat.lng);
      setIsLoadingAddress(true);
      try {
        const address = await reverseGeocodeAction(lngLat.lat, lngLat.lng);
        if (address) {
          setQuery(address);
          onChange(address, lngLat.lat, lngLat.lng);
        }
      } catch {
        /* leave as-is */
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [onChange, query]
  );

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentMapCenter: [number, number] = hasCoordinates
    ? [longitude, latitude]
    : [0, 20];
  const currentMapZoom = hasCoordinates ? 10 : 2;

  return (
    <div className="space-y-2">
      {/* ── Input with suggestions ── */}
      <div ref={containerRef} className="relative">
        {/* Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
              "w-full pl-8 pr-8 bg-transparent border border-border/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 hover:border-brand-green/40 focus:border-brand-green/40 outline-none transition-colors",
              selectedSuggestion && "border-brand-green/40",
              className
            )}
          />
          {/* Status icons */}
          <div className="absolute right-3 flex items-center gap-1">
            {isSearching && (
              <Loader2 className="size-3 animate-spin text-muted-foreground" />
            )}
            {selectedSuggestion && !isSearching && (
              <Check className="size-3 text-brand-green" />
            )}
            {query && !isSearching && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setSelectedSuggestion(null);
                  setShowSuggestions(false);
                  onChange("", null, null);
                }}
                className="text-muted-foreground/50 hover:text-foreground transition-colors"
                aria-label="Clear location"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            role="listbox"
            className="absolute top-full left-0 right-0 z-50 mt-0.5 border border-border/50 bg-popover shadow-lg overflow-hidden"
          >
            {suggestions.map((s, i) => (
              <li
                key={`${s.latitude}-${s.longitude}-${i}`}
                role="option"
                aria-selected={false}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full flex items-start gap-2 px-3 py-2 text-left text-xs hover:bg-brand-green/5 hover:text-brand-green transition-colors group"
                >
                  <MapPin className="size-3 mt-0.5 shrink-0 text-muted-foreground group-hover:text-brand-green" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.shortName}</p>
                    <p className="text-[10px] text-muted-foreground/60 truncate">
                      {s.displayName}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Map ── */}
      <div className="h-[360px] border border-border/40 overflow-hidden cursor-crosshair">
        <MapLibreMap
          ref={mapRef}
          center={currentMapCenter}
          zoom={currentMapZoom}
          className="h-full w-full"
        >
          <MapControls showZoom showLocate />
          <MapClickHandler onMapClick={handleMapClick} />

          {hasCoordinates && (
            <MapMarker
              latitude={latitude}
              longitude={longitude}
              draggable
              onDragEnd={handleDragEnd}
            >
              <MarkerContent>
                <div className="relative group">
                  <div className="size-4 rounded-full border-2 border-white bg-brand-green shadow-lg" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-0.5 bg-brand-green" />
                </div>
              </MarkerContent>
            </MapMarker>
          )}
        </MapLibreMap>
      </div>

      {/* ── Status bar ── */}
      <div className="px-1 min-h-[16px]">
        {isLoadingAddress ? (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Loader2 className="size-2.5 animate-spin" />
            Resolving address...
          </div>
        ) : hasCoordinates ? (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="text-brand-green">📍</span>
            <span>
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
            <span className="text-border/50">—</span>
            <span className="text-foreground truncate">
              {query || "Location set"}
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            Type to search or click the map to set a location
          </p>
        )}
      </div>
    </div>
  );
}
