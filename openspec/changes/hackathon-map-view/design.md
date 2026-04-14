# Technical Design: hackathon-map-view

## Resumen Ejecutivo

Este documento técnico detalla la arquitectura de implementación para agregar vista de mapa interactiva a la plataforma Hackra. El cambio introduce coordenadas GPS al modelo Hackathon, un componente de mapa con clustering, selector visual de ubicación, y geocodificación automática via Nominatim.

---

## 1. Architecture Overview

### 1.1 Contexto de Arquitectura Actual

La página de explore (`app/(public)/explore/page.tsx`) es un **Server Component** que:

1. Lee `searchParams` (promises en Next.js 16) para filtros de nuqs
2. Llama a `getHackathons(q, filters)` en el data layer
3. Pasa datos a `ExploreGrid` (Client Component)
4. `ExploreFilters` (Client Component) controla estado URL via nuqs

### 1.2 Nueva Arquitectura con Map View

```
┌─────────────────────────────────────────────────────────────────────┐
│                    app/(public)/explore/                           │
│                        page.tsx (SC)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  searchParams (nuqs) ──► getHackathons() ──► [Hackathon[]]        │
│                                             │                    │
│                              ┌──────────────┴──────────────┐      │
│                              ▼                             ▼      │
│                    ┌─────────────────┐      ┌─────────────────┐  │
│                    │  ExploreGrid    │      │ExploreMapWrapper │  │
│                    │  (Client SC)    │      │  (Client SC)    │  │
│                    └─────────────────┘      └─────────────────┘  │
│                              │                     │             │
│                              │        ┌────────────┴──────┐      │
│                              │        ▼                  ▼      │
│                              │  ┌──────────────────┐        │
│                              │  │   ExploreMap      │        │
│                              │  │   (Client SC)     │        │
│                              │  │   MapClusterLayer│        │
│                              │  │   + Markers       │        │
│                              │  └──────────────────┘        │
│                              │                                │
│                              ▼                                │
│                    ┌─────────────────┐                        │
│                    │ HackathonCard   │                        │
│                    └─────────────────┘                        │
│                                                                     │
└────────────────────────────────────��────────────────────────────────┘
```

**Flujo de datos:**

1. El **Server Component** (`page.tsx`) fetchea todos los hackathons con coordenadas incluidas
2. Pasa el array a `ExploreMapWrapper` o `ExploreGrid` dependiendo del URL param `view`
3. `ExploreMapWrapper` es un thin wrapper que recibe props y pasa a `ExploreMap`
4. `ExploreMap` (client-only) renderiza el mapa con mapcn

### 1.3 Component Hierarchy

| Componente          | Tipo   | Responsabilidad                               |
| ------------------- | ------ | --------------------------------------------- |
| `page.tsx`          | Server | Fetch data, render wrapper/grid               |
| `ExploreMapWrapper` | Client | Receive data, show loading, render ExploreMap |
| `ExploreMap`        | Client | Render mapcn Map, clusters, markers           |
| `ExploreFilters`    | Client | nuqs state + view toggle                      |
| `LocationPicker`    | Client | Map for create form, draggable marker         |

---

## 2. Data Flow Diagrams

### 2.1 Explore Page Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   page.tsx    │     │ExploreMapWrapper│     │   ExploreMap     │
│   (Server)   │     │   (Client)      │     │   (Client)       │
└──────┬───────┘     └────────┬────────┘     └────────┬─────────┘
       │                       │                        │
       │  getHackathons()      │                        │
       │  returns:            │                        │
       │  {id, slug, title,    │                        │
       │   latitude,          │                        │
       │   longitude, ...}   │                        │
       │                       │                        │
       ├─────────────────────►│                        │
       │  hackathons[]        │                        │
       │  view="map"          ├───────────────────────►
       │  (via props)        │   hackathons[]         ├──────────────────►
                            │  filters (from nuqs)   │   Render Map
                            │                       │   MapClusterLayer
                            │                       │   + Markers
                            │                       │   + Popup on click
```

** Secuencia:**

1. **URL**: usuario accede a `?view=map`
2. **Server** (`page.tsx`):
   - Lee `searchParams` de nuqs
   - Llama `getHackathons()` con filtros
   - Determina view ("map" o "grid")
3. **Client** (`ExploreMapWrapper`):
   - Recibe `hackathons: MapHackathon[]`
   - Memoiza datos
   - Pasa a `ExploreMap`
4. **Client** (`ExploreMap`):
   - Inicializa mapcn Map
   - Llama `navigator.geolocation.getCurrentPosition()`
   - Renderiza `MapClusterLayer` con datos
   - Muestra `MarkerPopup` on click

### 2.2 Create Form Flow

```
┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ CreateHackathon  │     │ LocationPicker  │     │  Geocoding       │
│    Form         │     │   (Client)      │     │  Service        │
└────────┬────────┘     └────────┬────────┘     └────────┬──────────┘
         │                      │                         │
         │  locationMode       │                         │
         │  = "in_person"      │                         │
         ├─────────��─────────►│   Show Map              │
         │                    │   + Draggable Marker    │
         │                    │                        │
         │  User clicks map  │                        │
         │  or drags marker  │                        │
         │                  │◄────────────────────────
         │                  │   lat, lng               │
         │                  │                         │
         │  reverseGeocode  │                         │
         │  (lat, lng)      │                         │
         ├─────────────────►│                         │
         │  locationName    │   Display address      │
         │                  │                         │
         │                  │   onChange(lat, lng,    │
         │                  │              location)  │
         │                  │◄────────────────────────
         │
         │  Form submission  │
         │  + coordinates   │
         ├──────────────────►
         │  Server Action   │
         │  saves to DB     │
```

** Secuencia:**

1. **Usuario** selecciona `locationMode = "in_person"` o `"hybrid"`
2. **LocationPicker** muestra mapa con marker arrastrable
3. **Usuario**:
   - Click en el mapa → marker se mueve a posición clickeada
   - Drag del marker → posición se actualiza en tiempo real
4. **Reverse geocoding**:
   - Llama `reverseGeocode(lat, lng)` del geocoding service
   - Muestra address en UI
   - Actualiza form state
5. **Submit**:
   - Server Action recibe `latitude`, `longitude`, `location`
   - Prisma crea registro con coordenadas

### 2.3 Luma Import Flow

```
┌─────────────────┐     ┌────────────────┐     ┌─────────────────┐
│  Luma Scraper   │     │   Geocoding    │     │  Prisma DB     │
│  (server)       │     │   Service     │     │               │
└────────┬────────┘     └───────┬────────┘     └───────┬────────┘
         │                      │                      │
         │  scrape(url)          │                      │
         │  returns:            │                      │
         │  { location:         │                      │
         │    "San Francisco",  │                      │
         │    locationMode }   │                      │
         │                      │                      │
         │  Check locationMode │                      │
         │  != "remote"        │                      │
         ├────────────────────►│   geocodeLocation()  │
         │  "San Francisco"    │   returns:          │
         │                     │   {lat, lng} or null│
         │                     │                      │
         │  <──────────────    │                      │
         │  null (fails)       │                      │
         │  or {lat, lng}      │                      │
         │                     │                      │
         │  Create hackathon:  │                      │
         │  { location,       │                      │
         │    latitude,       │                      │
         │    longitude }    │◄────────────────────
         │                     │   INSERT            │
```

** Secuencia:**

1. **Scraper** (`luma-scraper.ts`):
   - Extrae `location` string del evento Luma
   - Devuelve `HackathonInput` con location, locationMode
2. **Geocoding service** (si `locationMode !== "remote"`):
   - Llama `geocodeLocation(location)`
   - Con cache: retorna dato cacheado
   - Sin cache: llama Nominatim API (1 req/sec max)
3. **Graceful degradation**:
   - Si geocoding falla → guardar solo `location` string
   - Si location no encontrado → null en coordenadas
4. **Prisma**:
   - Inserta registro con `latitude`, `longitude` (nullable)

---

## 3. Schema Migration Design

### 3.1 Prisma Schema Changes

**Archivo:** `prisma/schema.prisma`

```prisma
model Hackathon {
  id            String     @id @default(cuid())
  // ... existing fields ...
  title         String
  slug          String     @unique
  description   String?
  location     String?
  locationMode String    @default("remote") // "remote" | "in_person" | "hybrid"
  isOnline     Boolean   @default(false)
  // ... existing fields ...

  // ─── NEW FIELDS ────────────────────────────────────────────────
  latitude     Float?    // Geographic latitude (-90 to 90)
  longitude    Float?    // Geographic longitude (-180 to 180)

  // Index for future geographic queries
  @@index([latitude, longitude])
}
```

### 3.2 Migration Details

| Aspect             | Detail                                    |
| ------------------ | ----------------------------------------- |
| **Migration name** | `add_hackathon_coordinates`               |
| **Fields**         | `latitude Float?`, `longitude Float?`     |
| **Default**        | `null` (nullable)                         |
| **Index**          | Compound index on `[latitude, longitude]` |
| **Reversible**     | Yes (drop index + fields)                 |

**Alternativas consideradas:**

- Usar PostGIS (`geometry` type): **Descartado** — overkill para el caso de uso, complejidad adicional
- Separate `HackathonLocation` model: **Descartado** — no hay relaciones que lo justifiquen
- Solo índices individuales: **Descartado** — queries geográficos futuros necesitarán ambos campos juntos

### 3.3 Data Layer Update

**Archivo:** `data/hackathons.ts` (o equivalente)

```typescript
// Nuevo tipo para hydrate de coordenadas
export type MapHackathon = Omit<Hackathon, "latitude" | "longitude"> & {
  latitude: number | null;
  longitude: number | null;
};

// Función existente - retorna todos los campos
export async function getHackathons(filters: HackathonFilters) {
  // ... existing query ...
  // Ahora incluye latitude y longitude
}

// Nuevo: función para el mapa (sin paginación, retorna todos)
export async function getHackathonsForMap(filters: HackathonFilters) {
  return db.hackathon.findMany({
    where: {
      ...buildWhereClause(filters),
      // Excluir los que no tienen coordenadas para el mapa
      // Pero incluir TODOS los hackathons (los sin coords van a lista online)
    },
    select: {
      id: true,
      slug: true,
      title: true,
      location: true,
      latitude: true,
      longitude: true,
      locationMode: true,
      isOnline: true,
      tags: true,
      techs: true,
      startDate: true,
      endDate: true,
      topPrize: true,
      status: true,
    },
    orderBy: { startDate: "asc" },
  });
}
```

---

## 4. Component Architecture

### 4.1 ExploreMap Component

**Archivo:** `shared/components/explore-map.tsx`

```tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Map, MapClusterLayer, Marker, MarkerPopup } from "mapcn";
import type { MapHackathon } from "@/data/hackathons";

interface ExploreMapProps {
  hackathons: MapHackathon[];
  onHackathonClick?: (slug: string) => void;
}

/**
 * ExploreMap - Client component que renderiza el mapa interactivo
 * con clustering y markers individuales.
 *
 * - Viewport inicial basado en geolocation del usuario
 * - MapClusterLayer para agrupar markers cercanos
 * - MarkerPopup con HackathonCard en click
 * - Theme auto-detection desde document.classList
 */
export function ExploreMap({ hackathons, onHackathonClick }: ExploreMapProps) {
  // Separar hackathons con coordenadas de los online-only
  const mapHackathons = useMemo(
    () => hackathons.filter((h) => h.latitude != null && h.longitude != null),
    [hackathons]
  );

  const onlineHackathons = useMemo(
    () => hackathons.filter((h) => h.isOnline || h.locationMode === "remote"),
    [hackathons]
  );

  // Estado para viewport
  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2,
  });

  // Geolocation del browser
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 10, // City-level
          });
        },
        () => {
          // Fallback: mundo
          setViewState({ latitude: 0, longitude: 0, zoom: 2 });
        }
      );
    }
  }, []);

  // Theme detection
  const theme = useMemo(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }, []);

  return (
    <div className="explore-map">
      <Map
        initialViewState={viewState}
        theme={theme}
        mapStyle="https://basemaps.cartocdn.com/gl/virtues-gl-style/style.json"
      >
        <MapClusterLayer
          data={mapHackathons}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterProperties={{
            // Color por cantidad
            "circle-color": [
              "case",
              ["<=", ["get", "point_count"], 5],
              "#22c55e", // brand-green < 5
              ["<=", ["get", "point_count"], 10],
              "#16a34a", // green-dark 5-10
              "#a855f7", // brand-purple > 10
            ],
            "circle-radius": ["+", ["%", ["get", "point_count"], 10], 20],
          }}
          // Click en cluster → zoom in
          onClick={({ features, geometry }) => {
            if (features[0]?.properties?.cluster_id) {
              const [lat, lng] =
                geometry.type === "Point" ? geometry.coordinates : [0, 0];
              setViewState({ latitude: lat, longitude: lng, zoom: 14 });
            }
          }}
        />

        {/* Individual markers - cuando zoom > 14 */}
        {mapHackathons.map((hackathon) => (
          <Marker
            key={hackathon.id}
            longitude={hackathon.longitude!}
            latitude={hackathon.latitude!}
            anchor="bottom"
            onClick={() => {
              onHackathonClick?.(hackathon.slug);
            }}
          >
            <MarkerPopup>
              <CompactHackathonCard hackathon={hackathon} />
            </MarkerPopup>
          </Marker>
        ))}
      </Map>

      {/* Online hackathons section */}
      {onlineHackathons.length > 0 && (
        <section className="online-hackathons">
          <h3>Online Hackathons</h3>
          <div className="online-grid">
            {onlineHackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

### 4.2 LocationPicker Component

**Archivo:** `shared/components/location-picker.tsx`

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Map, Marker } from "mapcn";
import { reverseGeocode } from "@/lib/geocoding";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  locationName: string;
  onChange: (lat: number, lng: number, name: string) => void;
  className?: string;
}

/**
 * LocationPicker - Map-based location selector para create form.
 *
 * - Muestra mapa cuando locationMode es in_person o hybrid
 * - Marker arrastrable para fine-tuning
 * - Click en mapa para seleccionar
 * - Reverse geocoding para llenar location text
 */
export function LocationPicker({
  latitude,
  longitude,
  locationName,
  onChange,
  className,
}: LocationPickerProps) {
  // Estado local
  const [selectedLat, setSelectedLat] = useState<number | null>(latitude);
  const [selectedLng, setSelectedLng] = useState<number | null>(longitude);
  const [displayName, setDisplayName] = useState(locationName);
  const [isLoading, setIsLoading] = useState(false);

  // Center del mapa
  const [center, setCenter] = useState({ latitude: 0, longitude: 0, zoom: 2 });

  // Inicializar center
  useEffect(() => {
    if (latitude != null && longitude != null) {
      setCenter({ latitude, longitude, zoom: 12 });
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            zoom: 10,
          });
        },
        () => {
          // Default SF
          setCenter({ latitude: 37.7749, longitude: -122.4194, zoom: 10 });
        }
      );
    }
  }, []);

  // Handle click en mapa
  const handleMapClick = useCallback(
    async (event: { lngLat: { lng: number; lat: number } }) => {
      const { lat, lng } = event.lngLat;
      setSelectedLat(lat);
      setSelectedLng(lng);
      setIsLoading(true);

      // Reverse geocode
      const name = await reverseGeocode(lat, lng);
      if (name) {
        setDisplayName(name);
        onChange(lat, lng, name);
      } else {
        onChange(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
      setIsLoading(false);
    },
    [onChange]
  );

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback(
    async (event: { lngLat: { lng: number; lat: number } }) => {
      const { lat, lng } = event.lngLat;
      setSelectedLat(lat);
      setSelectedLng(lat);
      setIsLoading(true);

      const name = await reverseGeocode(lat, lng);
      if (name) {
        setDisplayName(name);
        onChange(lat, lng, name);
      }
      setIsLoading(false);
    },
    [onChange]
  );

  // Theme detection
  const theme = useMemo(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }, []);

  return (
    <div className={cn("location-picker", className)}>
      <Map
        initialViewState={center}
        theme={theme}
        mapStyle="https://basemaps.cartocdn.com/gl/virtues-gl-style/style.json"
        onClick={handleMapClick}
        cursor="crosshair"
      >
        {selectedLat != null && selectedLng != null && (
          <Marker
            longitude={selectedLng}
            latitude={selectedLat}
            anchor="center"
            draggable
            onDragEnd={handleMarkerDragEnd}
          >
            <div className="marker-pin" />
          </Marker>
        )}
      </Map>

      {/* Location display */}
      <div className="location-display">
        <span className="label">Selected Location:</span>
        <span className={cn("value", isLoading && "loading")}>
          {isLoading ? "Loading..." : displayName}
        </span>
        {selectedLat != null && selectedLng != null && (
          <span className="coords">
            {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}
```

### 4.3 Geocoding Service

**Archivo:** `shared/lib/geocoding.ts`

```typescript
/**
 * Geocoding Service - Nominatim-based geocoding con caching y rate limiting.
 *
 * - Rate limit: 1 request por segundo (Nominatim policy)
 * - Cache: in-memory LRU con 7 días TTL
 * - Graceful degradation: retorna null en vez dethrow
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface CacheEntry {
  result: GeocodeResult | null;
  timestamp: number;
}

// In-memory cache
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Rate limiter
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

/**
 * geocodeLocation - Convierte string de ubicación a coordenadas
 *
 * @param location - String de ubicación (e.g., "San Francisco, CA")
 * @returns GeocodeResult con lat/lng o null si falla
 */
export async function geocodeLocation(
  location: string
): Promise<GeocodeResult | null> {
  if (!location?.trim()) return null;

  const normalizedKey = location.toLowerCase().trim();

  // Check cache
  const cached = cache.get(normalizedKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/search?${new URLSearchParams({
        q: location,
        format: "json",
        limit: "1",
      })}`,
      {
        headers: {
          "User-Agent": "Hackra/1.0 (https://hackra.dev; contact@hackra.dev)",
        },
      }
    );

    if (!response.ok) {
      console.warn("[geocoding] Nominatim error:", response.status);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      cache.set(normalizedKey, { result: null, timestamp: Date.now() });
      return null;
    }

    const result: GeocodeResult = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };

    // Validate bounds
    if (
      result.latitude < -90 ||
      result.latitude > 90 ||
      result.longitude < -180 ||
      result.longitude > 180
    ) {
      console.warn("[geocoding] Invalid coordinates:", result);
      cache.set(normalizedKey, { result: null, timestamp: Date.now() });
      return null;
    }

    cache.set(normalizedKey, { result, timestamp: Date.now() });
    lastRequestTime = Date.now();

    return result;
  } catch (error) {
    console.warn("[geocoding] Failed:", location, error);
    cache.set(normalizedKey, { result: null, timestamp: Date.now() });
    return null;
  }
}

/**
 * reverseGeocode - Convierte coordenadas a string de ubicación
 *
 * @param latitude - Latitud
 * @param longitude - Longitud
 * @returns String con nombre de ubicación o null si falla
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Check cache (reverse lookups tiene TTL más corto)
  const cached = cache.get(`reverse:${key}`);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result?.displayName ?? null;
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/reverse?${new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        format: "json",
      })}`,
      {
        headers: {
          "User-Agent": "Hackra/1.0 (https://hackra.dev; contact@hackra.dev)",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data?.display_name) return null;

    // Shorten the display name (take first part)
    const shortName = data.display_name.split(",").slice(0, 2).join(",");

    const result: GeocodeResult = {
      latitude,
      longitude,
      displayName: shortName,
    };

    cache.set(`reverse:${key}`, { result, timestamp: Date.now() });
    lastRequestTime = Date.now();

    return shortName;
  } catch (error) {
    console.warn("[geocoding] Reverse failed:", latitude, longitude, error);
    return null;
  }
}

/**
 * clearGeocodeCache - Limpia el cache (para testing)
 */
export function clearGeocodeCache(): void {
  cache.clear();
}
```

---

## 5. URL State Design

### 5.1 Nuqs Integration

**Archivo:** `app/(public)/explore/_components/explore-filters.tsx`

```typescript
"use client";

import { useQueryState, parseAsString } from "nuqs";

// View state - "grid" por defecto
export const [view, setView] = useQueryState(
  "view",
  parseAsString.withDefault("grid").withOptions({
    shallow: true,
    scroll: false,
  })
);

// Toggle handler
function toggleView(newView: "grid" | "map") {
  setView(newView);
}

// En el componente render:
<button
  onClick={() => toggleView("map")}
  data-active={view === "map"}
>
  Map
</button>
<button
  onClick={() => toggleView("grid")}
  data-active={view === "grid"}
>
  Grid
</button>
```

### 5.2 URL Patterns

| Acción         | URL Resultado                         |
| -------------- | ------------------------------------- |
| Default        | `/explore` → `?view=grid` (implícito) |
| Toggle a mapa  | `/explore?view=map`                   |
| Toggle a grid  | `/explore?view=grid`                  |
| Con filtros    | `/explore?view=map&q=ai&tags=hacking` |
| Sin view param | `/explore?q=ai` → grid view (default) |

---

## 6. Luma Import Integration

### 6.1 Scraper Update

**Archivo:** `shared/lib/luma-scraper.ts`

```typescript
import { geocodeLocation } from "./geocoding";

export async function importFromLuma(url: string) {
  const data = await scrapeLumaEvent(url);

  const input: Prisma.HackathonCreateInput = {
    title: data.title,
    slug: data.slug,
    location: data.location,
    locationMode: data.locationMode ?? "remote",
    isOnline: data.isOnline ?? data.locationMode === "remote",
    // ... other fields
  };

  // Geocode si hay location y no es remote
  if (
    data.location &&
    data.locationMode !== "remote" &&
    data.locationMode !== "hybrid"
  ) {
    const geo = await geocodeLocation(data.location);
    if (geo) {
      input.latitude = geo.latitude;
      input.longitude = geo.longitude;
      // Optionally update location string con normalized name
      // input.location = geo.displayName;
    }
  }

  // Hybrid mode: intentar geocode
  if (data.location && data.locationMode === "hybrid") {
    const geo = await geocodeLocation(data.location);
    if (geo) {
      input.latitude = geo.latitude;
      input.longitude = geo.longitude;
    }
  }

  return db.hackathon.create({ data: input });
}
```

---

## 7. Seed Data Coordinates

### 7.1 Seed Script Update

**Archivo:** `prisma/seed-hackathons.ts`

```typescript
const SEED_HACKATHONS = [
  {
    title: "ETHGlobal San Francisco",
    slug: "ethglobal-sf",
    location: "San Francisco, CA",
    locationMode: "in_person",
    isOnline: false,
    latitude: 37.7749,
    longitude: -122.4194,
    // ...
  },
  {
    title: "HackMIT",
    slug: "hackmit",
    location: "Cambridge, MA",
    locationMode: "in_person",
    isOnline: false,
    latitude: 42.3601,
    longitude: -71.0589,
    // ...
  },
  {
    title: "MHacks",
    slug: "mhacks",
    location: "Ann Arbor, MI",
    locationMode: "in_person",
    isOnline: false,
    latitude: 42.2808,
    longitude: -83.743,
    // ...
  },
  // ... más seed data
];
```

### 7.2 Ubicaciones de Seed Conocidas

| Hackathon         | Latitud  | Longitud  |
| ----------------- | -------- | --------- |
| San Francisco, CA | 37.7749  | -122.4194 |
| New York, NY      | 40.7128  | -74.0060  |
| London, UK        | 51.5074  | -0.1278   |
| Berlin, DE        | 52.5200  | 13.4050   |
| Tokyo, JP         | 35.6762  | 139.6503  |
| Singapore         | 1.3521   | 103.8198  |
| Toronto, CA       | 43.6532  | -79.3832  |
| Sydney, AU        | -33.8688 | 151.2093  |
| Amsterdam, NL     | 52.3676  | 4.9041    |

---

## 8. File Change Summary

| Archivo                                                             | Acción    | Descripción                                           |
| ------------------------------------------------------------------- | --------- | ----------------------------------------------------- |
| `prisma/schema.prisma`                                              | Modificar | Agregar campos latitude/longitude                     |
| `prisma/migrations/.../migration.sql`                               | Crear     | Migration Prisma                                      |
| `package.json`                                                      | Modificar | Agregar `mapcn` dependency                            |
| `data/hackathons.ts`                                                | Modificar | Agregar `getHackathonsForMap()`, tipos `MapHackathon` |
| `shared/lib/geocoding.ts`                                           | Crear     | Geocoding utility con cache + rate limiting           |
| `shared/components/explore-map.tsx`                                 | Crear     | Componente de mapa con clustering                     |
| `shared/components/location-picker.tsx`                             | Crear     | Selector visual de ubicación                          |
| `app/(public)/explore/page.tsx`                                     | Modificar | Agregar view toggle based on nuqs                     |
| `app/(public)/explore/_components/explore-filters.tsx`              | Modificar | Agregar view toggle buttons                           |
| `app/(public)/explore/_components/explore-grid.tsx`                 | Modificar | Mantener grid view                                    |
| `app/(public)/explore/_components/explore-map-wrapper.tsx`          | Crear     | Wrapper que carga datos para el mapa                  |
| `app/(private)/(user)/create/_components/create-hackathon-form.tsx` | Modificar | Reemplazar location input con LocationPicker          |
| `shared/lib/luma-scraper.ts`                                        | Modificar | Agregar geocoding automático                          |
| `prisma/seed-hackathons.ts`                                         | Modificar | Agregar coordenadas a seed data                       |

---

## 9. Implementation Phases

### Phase 1: Schema + Infrastructure

- [ ] Agregar `mapcn` a package.json
- [ ] Crear migración Prisma
- [ ] Ejecutar migración
- [ ] Crear `geocoding.ts` utility

### Phase 2: Explore Map

- [ ] Crear `ExploreMapWrapper`
- [ ] Crear `ExploreMap` componente
- [ ] Actualizar `ExploreFilters` con view toggle
- [ ] Actualizar `page.tsx` para conditional render

### Phase 3: Create Form

- [ ] Crear `LocationPicker`
- [ ] Integrar en `CreateHackathonForm`

### Phase 4: Luma Integration

- [ ] Actualizar `luma-scraper.ts` para geocode
- [ ] Agregar coordenadas a seed data

### Phase 5: Polish

- [ ] Theme detection
- [ ] Custom marker styling
- [ ] Error boundaries
- [ ] Empty states

---

## 10. Testing Strategy

### Unit Tests

- `geocoding.ts`: Test cache, rate limiting, graceful failures
- `geocoding.ts`: Test invalid inputs retornan null

### Integration Tests

- Explore page carga con `?view=map`
- View toggle cambia URL sin reload
- LocationPicker actualiza form state

### E2E Tests

- Full flow: import Luma → geocode → save → view on map
- Full flow: create hackathon → location picker → submit

---

## Appendix: Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Explore Page Sequence                   │
├─────────────────────────────────────────────────────────┤
│                                                      │
│  [Browser]              [Server]            [Client]   │
│     │                    │                    │         │
│  1  │── GET /explore?view=map ────────────────►│         │
│     │                    │                    │         │
│  2  │                    │── getHackathons()  │         │
│     │◄─────────────────│── returns [...]  │         │
│     │                    │                    │         │
│  3  │── render ExploreMapWrapper ─────────────►│         │
│     │                    │                    │         │
│  4  │                    │── useEffect    │         │
│     │                    │   navigator    │         │
│     │                    │   .geolocation│         │
│     │                    │◄── coords    │         │
│     │                    │                    │         │
│  5  │                    │── MapCluster  │         │
│     │                    │   Layer       │         │
│     │                    │── markers    │         │
│     │                    │              │         │
│  6  │◄───────────────────────────────────│ HTML   │
│     │                    │                    │         │
└─────────────────────────────────────────────────────────────────┘
```

---

**Documento preparado según SDD Design Phase specifications.**
