# Exploration: hackathon-map-view

## Current State Analysis

### Explore Page (`app/(public)/explore/page.tsx`)

- **Server Component** con cursor-based pagination (6 inicial, +3 al hacer scroll)
- `ExploreFilters`: Client Component que usa **nuqs** para estado URL (`q`, `location`, `tags`, `techs`)
- `ExploreGrid`: Client Component que renderiza `HackathonCard` en grid
- Sin toggle grid/map actualmente

### Data Model - Hackathon (`prisma/schema.prisma`)

- `location`: String (dirección texto)
- `locationMode`: "remote" | "in_person" | "hybrid" (enum implícito)
- `isOnline`: Boolean
- **NO tiene** campos `latitude` ni `longitude`

### Create Hackathon Flow (`app/(private)/(user)/create/page.tsx`)

- Form con input de texto para location
- No hay selector de mapa
- Usa Server Actions en `_actions.ts`

### Luma Scraper (`shared/lib/luma-scraper.ts`)

- Extrae `location` como string (`LumaEventData.location`)
- **NO hace geocoding** - solo guarda el string
- Interface tiene `locationMode` e `isOnline` opcionales

### Dependencies

- `maplibre-gl@5.23.0` ya installed en package.json
- `mapcn` **NO instalado**
- `nuqs@2.8.9` instalado y usado en explore-filters

## User Requirements Validation

| Req                        | Status              | Gap                             |
| -------------------------- | ------------------- | ------------------------------- |
| 1. Map view en explore     | ❌ No existe        | Crear ExploreMap component      |
| 2. Browser Geolocation API | ❌ No usado         | Agregar `navigator.geolocation` |
| 3. Map location picker     | ❌ Input texto      | Crear LocationPicker con mapcn  |
| 4. Luma auto-geocode       | ❌ No hay geocoding | Agregar geocoding utility       |
| 5. MapClusterLayer         | ❌ No hay mapcn     | Instalar mapcn                  |
| 6. URL view=map\|grid      | ❌ No existe        | Agregar a nuqs                  |

## Technical Findings

### nuqs Integration

- ExploreFilters ya usa nuqs con `useQueryState`
- Agregar `view` param es straightforward
- Filter sync: filtros de texto/tag/tech aplican a ambos views

### Geocoding Strategy

- **Nominatim** (OpenStreetMap): sin API key, rate limit 1 req/sec
- Alternativas: Mapbox (requiere API key), Google ($$$)
- Sever-side only para evitar leaked keys

### Cluster Strategy

- `mapcn` provee `MapClusterLayer` basado en supercluster
- Para MVP: agrupar por ~50km radius

### SSR Compatibility

- mapcn y maplibre-gl son **client-only**
- Necesitan `"use client"` wrapper components
- No hay SSR de mapas - solo hydrate en cliente
