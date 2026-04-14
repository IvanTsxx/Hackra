import "server-only";

// Geocoding Service — Nominatim-based geocoding with caching and rate limiting.
//
// - Rate limit: 1 request per second (Nominatim policy)
// - Cache: in-memory LRU with 7-day TTL
// - Graceful degradation: returns null instead of throwing

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT =
  "Hackra/1.0 (https://hackra.bongi.dev; hello@hackra.bongi.dev)";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface CacheEntry {
  result: GeocodeResult | null;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

// 7 days
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

let lastRequestTime = 0;

// 1.1s to be safe with Nominatim
const MIN_REQUEST_INTERVAL = 1100;

function sleep(ms: number): Promise<void> {
  // oxlint-disable avoid-new -- setTimeout requires Promise wrapper
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// eslint-disable-next-line eslint-plugin-promise/avoid-new -- setTimeout needs Promise wrapper
async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - elapsed);
  }
  lastRequestTime = Date.now();
  return fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
}

function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// geocodeLocation — Converts a location string to coordinates.
export async function geocodeLocation(
  location: string
): Promise<GeocodeResult | null> {
  if (!location?.trim()) return null;

  const key = `geocode:${location.toLowerCase().trim()}`;

  // Check cache
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  try {
    const response = await rateLimitedFetch(
      `${NOMINATIM_BASE}/search?${new URLSearchParams({
        format: "json",
        limit: "1",
        q: location,
      })}`
    );

    if (!response.ok) {
      console.warn("[geocoding] Nominatim error:", response.status);
      return null;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      cache.set(key, { result: null, timestamp: Date.now() });
      return null;
    }

    const lat = Number.parseFloat(data[0].lat);
    const lng = Number.parseFloat(data[0].lon);

    if (!validateCoordinates(lat, lng)) {
      console.warn("[geocoding] Invalid coordinates:", { lat, lng });
      cache.set(key, { result: null, timestamp: Date.now() });
      return null;
    }

    const result: GeocodeResult = {
      displayName: data[0].display_name,
      latitude: lat,
      longitude: lng,
    };

    cache.set(key, { result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.warn("[geocoding] Failed:", location, error);
    return null;
  }
}

// reverseGeocode — Converts coordinates to a location string.
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const key = `reverse:${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Check cache
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result?.displayName ?? null;
  }

  try {
    const response = await rateLimitedFetch(
      `${NOMINATIM_BASE}/reverse?${new URLSearchParams({
        format: "json",
        lat: String(latitude),
        lon: String(longitude),
      })}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data?.display_name) return null;

    // Shorten: take city, country level (first 2 parts)
    const parts = data.display_name.split(",");
    const shortName = parts.slice(0, 2).join(",").trim();

    const result: GeocodeResult = {
      displayName: shortName,
      latitude,
      longitude,
    };

    cache.set(key, { result, timestamp: Date.now() });
    return shortName;
  } catch (error) {
    console.warn("[geocoding] Reverse failed:", latitude, longitude, error);
    return null;
  }
}

// clearGeocodeCache — Clears the in-memory cache (for testing)
export function clearGeocodeCache(): void {
  cache.clear();
}
