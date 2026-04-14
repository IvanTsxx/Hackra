# Exploration: hackathon-map-view

## Current State

The Explore page (`app/(public)/explore/page.tsx`) is a **Server Component** that:

- Fetches hackathons via `getHackathonsForExplore()` from `data/hackatons.ts`
- Uses **cursor-based pagination** (initial 6, load +3)
- Renders `ExploreFilters` (client component with nuqs) + `ExploreGrid` (client component with infinite scroll)
- Current location filter is a **string match** (no geographic filtering)

**Hackathon Model** (`prisma/schema.prisma`):

- Has `location: String` (not nullable)
- Has `locationMode: String` ("remote" | "in_person" | "hybrid")
- Has `isOnline: Boolean`
- **NO latitude/longitude fields**

**Seed Data** (`shared/lib/mock-data.ts`):

- Locations are human-readable strings: "San Francisco, CA", "London, UK", "Online", "Pittsburgh, PA"
- No coordinates embedded

**Dependencies**:

- `maplibre-gl` already installed (v5.23.0)
- `mapcn` NOT installed
- `nuqs` already handles URL state for filters

## Affected Areas

| File                                | Why Affected                                             |
| ----------------------------------- | -------------------------------------------------------- |
| `prisma/schema.prisma`              | Needs latitude/longitude fields added                    |
| `data/hackatons.ts`                 | Needs new query for map data (all points, no pagination) |
| `app/(public)/explore/page.tsx`     | Needs to handle map vs grid toggle                       |
| `app/(public)/explore/_components/` | New map component needed                                 |
| `shared/lib/mock-data.ts`           | Seed needs coordinates                                   |
| `shared/lib/luma-scraper.ts`        | May need geocoding step for new imports                  |
| `package.json`                      | Needs mapcn dependency                                   |

## Approaches

### 1. Data Model Impact

| Approach                                 | Pros                                            | Cons                                                  | Complexity |
| ---------------------------------------- | ----------------------------------------------- | ----------------------------------------------------- | ---------- |
| **A. Add nullable lat/lng fields**       | Backward compatible, optional for existing data | Requires migration, need geocoding pipeline           | Medium     |
| **B. Add required lat/lng with default** | Always have coordinates                         | Must compute defaults, breaks existing if not handled | High       |
| **C. Separate GeoLocation model**        | Normalized, reusable                            | More complex queries, extra join                      | High       |

**Recommendation**: Approach A — Add nullable `latitude: Float?` and `longitude: Float?` to Hackathon. Existing data can be geocoded async (batch job). New data can be geocoded on create/import.

---

### 2. Component Architecture

| Approach                       | Pros                              | Cons                                 | Complexity |
| ------------------------------ | --------------------------------- | ------------------------------------ | ---------- |
| **A. Toggle (Map/Grid tabs)**  | Best of both, user choice         | More state to manage, two code paths | Low        |
| **B. Map replaces grid**       | Simpler, focused                  | Lose list UX, users expect grid      | Low        |
| **C. Map + list side-by-side** | Both visible, map highlights list | Complex layout, mobile issue         | High       |

**Recommendation**: Approach A — Add a view toggle (Grid | Map) at top of Explore page. Default to grid (familiar), allow switch to map. Persist view mode in URL (`?view=map`).

---

### 3. mapcn Integration

**Key Insight**: mapcn is a **client-only** library (uses MapLibre GL JS, which needs window/browser).

Architecture:

```
ExplorePage (Server)
  └── ExploreContent (Server)
        ├── ExploreFilters (Client) — keeps existing
        ├── ViewToggle (Client) — NEW: map/grid toggle
        └── [if grid] ExploreGrid (Client)
             └── HackathonCard (Client)
             [if map] HackathonMap (Client) — NEW
                  └── Map (mapcn)
                       └── MapClusterLayer
```

**Data Fetching**:

- Grid: Uses existing cursor pagination (server → client)
- Map: Needs **all visible hackathons at once** (no pagination). Create new function `getHackathonsForMap(filters)` that returns all matching hackathons (no cursor).

**Recommendation**: Create `ExploreMap` client component. Fetch map data via Server Action or pass from parent (filter changes trigger re-fetch).

---

### 4. Cluster vs Individual Markers

| Approach                                                 | Pros                                  | Cons                             | Complexity |
| -------------------------------------------------------- | ------------------------------------- | -------------------------------- | ---------- |
| **A. MapClusterLayer**                                   | Handles 100s of points, auto-clusters | Click behavior needs UX decision | Medium     |
| **B. Individual markers**                                | Simple, exact positioning             | Performance hit with many points | Low        |
| **C. Hybrid (clusters at zoom out, markers at zoom in)** | Best UX, industry standard            | More complex implementation      | High       |

**Recommendation**: Approach A with hybrid click behavior:

- **Click cluster**: Zoom into cluster bounds (MapClusterLayer default)
- **Click marker**: Show popup with HackathonCard preview, link to detail
- Use `MapMarker` for individual (after zoom), `MapClusterLayer` for overview

---

### 5. Filter Synchronization

**Current**: nuqs manages URL: `?q=...&location=...&tag=...&tech=...`

| Approach                                    | Pros                             | Cons                                          | Complexity |
| ------------------------------------------- | -------------------------------- | --------------------------------------------- | ---------- |
| **A. Map bounds → URL params**              | Map becomes filter UI            | Complex sync, bounds change on every pan/zoom | High       |
| **B. Map click filters list (independent)** | Simpler, map highlights filtered | Users might expect map to filter list         | Medium     |
| **C. Filters drive map (one-way)**          | List filters → map shows subset  | Map is visualization of list                  | Low        |

**Recommendation**: Approach C — Filters already work, map just **visualizes** the filtered set. When user clicks a cluster/marker, could filter to that region (future enhancement). For MVP: map is read-only visualization.

---

### 6. Performance

**Current**: `getHackathonsForExplore()` uses cursor pagination (6 initial, +3 on scroll)

**Map needs**: All matching hackathons at once (could be 100+)

**Solution**:

1. Create `getHackathonsForMap(filters)` — same filter logic but `take: -1` (no limit) or reasonable cap (500)
2. Add caching (same `cacheTag` pattern)
3. Only fetch map data when view === "map" (lazy load)

---

### 7. Geocoding Strategy

| Source            | How to Geocode                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------- |
| **Seed data**     | Run once-time batch geocoding, store in mock-data or separate seed script                 |
| **Manual create** | Add geocoding to create flow (call geocoding API on save)                                 |
| **Luma import**   | Add geocoding step after scrape (scrape returns location string → geocode → store coords) |

**Options for geocoding**:

- **Nominatim (free)**: OpenStreetMap, rate-limited, no API key
- **Google Maps API**: Requires key, paid
- **Mapbox**: Requires key, free tier

**Recommendation**: For MVP, use **Nominatim** (free, no key for small scale). Create utility `geocodeLocation(location: string): { lat: number; lng: number } | null`. Handle failures gracefully (null coords = don't show on map, or show in "Unknown" category).

**Batch geocoding for existing**:

- Create `scripts/geocode-hackathons.ts`
- Run once, update all hackathons with lat/lng
- Mark as done via a flag or just re-run

---

### 8. Seed Data

The seed file (`prisma/seed-hackathons.ts`) imports from `shared/lib/mock-data.ts`. Need to:

1. Add `latitude` and `longitude` to each hackathon in mock-data
2. Or create separate geocoding step in seed that runs after creating hackathons

**Recommendation**: Add coordinates to mock-data directly for seed speed and determinism. Pre-compute for known cities:

- San Francisco, CA: 37.7749, -122.4194
- London, UK: 51.5074, -0.1278
- Pittsburgh, PA: 40.4406, -79.9959
- Seattle, WA: 47.6062, -122.3321
- Online: null (no coordinates)

---

### 9. Migration Path

**Safe migration** (backward compatible):

1. **Schema change**: Add nullable `latitude` and `longitude` fields
2. **Data migration**: Run geocoding batch job (async, can be done after deploy)
3. **UI**: Add map component, toggle, no breaking changes
4. **Geocoding on create**: Add after schema + UI ready

**Steps**:

```prisma
// Schema (nullable)
latitude  Float?
longitude Float?

// Migration can be done in stages:
# 1. Add fields (nullable)
# 2. Populate existing (background job)
# 3. Make optional in create flow
```

---

## Recommendation

**Proceed with the following plan**:

1. **Schema**: Add nullable `latitude` and `longitude` to Hackathon model
2. **Seed**: Pre-compute coordinates for mock data
3. **View Toggle**: Add Grid/Map toggle at top of Explore (default: grid)
4. **Map Component**: Create `ExploreMap` client component using mapcn
5. **Map Data**: Add `getHackathonsForMap()` that returns all (no pagination)
6. **Geocoding**: Create utility + batch script for existing data
7. **Luma**: Add optional geocoding step in import flow

**Risk**: Geocoding failures could leave some hackathons without coordinates. Mitigation: Handle null gracefully, show in "Unknown" section or exclude from map.

**Ready for Proposal**: Yes — scope is clear, trade-offs are understood, implementation can proceed in phases (schema → data → UI).

---
