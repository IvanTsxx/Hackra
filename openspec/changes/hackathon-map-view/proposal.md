# Proposal: hackathon-map-view

## Intent

Agregar vista de mapa interactiva a la página de exploración para mejorar el UX de descubrimiento géographique de hackathons. Actualmente los usuarios solo pueden filtrar por location como string - no hay visualización geográfica ni forma visual de seleccionar ubicación al crear un hackathon. Este cambio introduce coordenadas GPS, mapa explorable, y geocodificación automática.

## Scope

### In Scope

- Agregar campos `latitude` y `longitude` (Float, nullable) al modelo Hackathon en Prisma
- Instalar paquete `mapcn` para clustering y markers
- Crear componente `ExploreMap` con MapClusterLayer y MarkerPopup
- Toggle grid/map view persistido en URL (`?view=map|grid`) vía nuqs
- Componente `LocationPicker` para crear hackathon con click en mapa
- Utility de geocodificación usando Nominatim (server-side)
- Actualizar Luma scraper para geocodificar location automáticamente
- Actualizar seed data con coordenadas

### Out of Scope

- Map bounds-based filtering (futuro)
- Proximity search / "hackathons near me" (futuro)
- Heatmap overlay (futuro)

## Capabilities

### New Capabilities

- `hackathon-map-view`: Vista de mapa interactiva en explore page con clustering
- `hackathon-location-picker`: Selector visual de ubicación en create form
- `hackathon-geocoding`: Geocodificación de strings a coordenadas

### Modified Capabilities

- `hackathon-explore`: Añadir toggle view param (grid → grid|map)

## Approach

1. **Schema**: Migración Prisma agregando lat/lng nullable
2. **Dependencies**: Instalar `mapcn` (provee Map, MapClusterLayer, Marker, MarkerPopup)
3. **Geocoding**: Crear `shared/lib/geocoding.ts` usando Nominatim API con cache y rate limiting
4. **ExploreMap**: Client component con MapClusterLayer, centrado via/browser geolocation
5. **LocationPicker**: Map con Marker arrastrable para select manual
6. **Luma**: Integrar geocoding en import workflow
7. **URL**: Agregar `view` param a nuqs, sync con filters existentes
8. **Seeds**: Script batch para geocodificar datos existentes

## Affected Areas

| Area                                                          | Impact   | Description                       |
| ------------------------------------------------------------- | -------- | --------------------------------- |
| `prisma/schema.prisma`                                        | Modified | Agregar latitude/longitude Float  |
| `package.json`                                                | Modified | Instalar mapcn                    |
| `app/(public)/explore/page.tsx`                               | Modified | Toggle grid/map via searchParams  |
| `app/(public)/explore/_components/explore-map.tsx`            | New      | Componente mapa con clustering    |
| `app/(public)/explore/_components/explore-grid.tsx`           | Modified | Grid conditional render           |
| `app/(private)/(user)/create/_components/location-picker.tsx` | New      | Selector ubicación visual         |
| `shared/lib/geocoding.ts`                                     | New      | Utility Nominatim server-side     |
| `shared/lib/luma-scraper.ts`                                  | Modified | Auto-geocode on import            |
| `prisma/seed.ts`                                              | Modified | Coordinates para datos existentes |

## Risks

| Risk                                    | Likelihood | Mitigation                           |
| --------------------------------------- | ---------- | ------------------------------------ |
| Null coordinates para hackathons online | High       | isOnline=true → skip geocoding       |
| Rate limit Nominatim (1 req/sec)        | Med        | Cache en DB, batch con delay         |
| Performance con 1000+ markers           | Med        | MapClusterLayer ya provee clustering |
| SSR hydration mismatch                  | Low        | Solo client-side render              |

## Rollback Plan

- Campos nullable: si mapa falla, grid view funciona igual
- Feature additive: no hay breaking changes
- Toggle view: users pueden usar `?view=grid` como fallback
- Geocoding utility aislada: fácil de deshabilitar

## Dependencies

- `mapcn`: Mapping library (NO installed)
- `maplibre-gl`: Ya en package.json como peer dependency
- `nominatim`: Free geocoding (no API key needed)

## Success Criteria

- [ ] Vista mapa carga sin errores en explore page
- [ ] Toggle "?view=map" y "?view=grid" funcionan via nuqs
- [ ] MapCluster agrupa markers cercanos (>50km)
- [ ] Location picker guarda lat/lng al crear hackathon
- [ ] Luma imports incluyen coordenadas
- [ ] Graceful fallback si geocoding falla
