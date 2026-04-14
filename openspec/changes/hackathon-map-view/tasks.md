# Tasks: hackathon-map-view

> **DIRECTION CHANGE**: Cards are removed. The map IS the navigation. All hackathon browsing happens via map markers/popups. Only 100% online hackathons get a small list below the map. Search and filters live ON the map. Home page shows featured hackathons on a map too.

---

## Phase 1: Infrastructure ✅

### Task 1.1: Install mapcn dependency ✅

- **Files**: `package.json`
- **Status**: DONE

### Task 1.2: Add latitude/longitude to Prisma schema ✅

- **Files**: `prisma/schema.prisma`
- **Status**: DONE

### Task 1.3: Create geocoding utility ✅

- **Files**: `shared/lib/geocoding.ts`
- **Status**: DONE (has lint errors — needs fix)

### Task 1.4: Update seed data with coordinates ✅

- **Files**: `prisma/seed-hackathons.ts`, `shared/lib/mock-data.ts`
- **Status**: DONE

---

## Phase 2: Fix Lint Errors (blocking)

### Task 2.1: Fix lint errors in explore-map.tsx

- **Files**: `shared/components/explore-map.tsx`
- **Description**: Fix inline comments (move to separate lines), non-null assertions (use proper type narrowing), remove unused `TimeLabel` import, fix `!= null` to `!== null`
- **Acceptance**: `bun run check` passes with zero errors in this file
- **Dependencies**: None

### Task 2.2: Fix lint errors in geocoding.ts

- **Files**: `shared/lib/geocoding.ts`
- **Description**: Move inline comments to separate lines, refactor `new Promise` pattern to avoid `no-promise-executor-return` and `avoid-new` rules
- **Acceptance**: `bun run check` passes with zero errors in this file
- **Dependencies**: None

### Task 2.3: Fix/suppress lint errors in map.tsx

- **Files**: `shared/components/ui/map.tsx`
- **Description**: This is a shadcn-generated file. Add `// oxlint-disable` directives at the top for unavoidable rules (inline comments, prefer-destructuring, sort-keys, prefer-await-to-callbacks, avoid-new) rather than mutating generated code
- **Acceptance**: `bun run check` passes with zero errors in this file
- **Dependencies**: None

### Task 2.4: Fix unused `view` param in explore-filters.tsx

- **Files**: `app/(public)/explore/_components/explore-filters.tsx`
- **Description**: Rename `view` prop to `_view` or remove it — this component will be rewritten in Phase 3 anyway
- **Acceptance**: `bun run check` passes
- **Dependencies**: None

---

## Phase 3: Map-First Explore Page (CORE)

### Task 3.1: Rework ExploreMap into full-page navigation map

- **Files**: `shared/components/explore-map.tsx`
- **Description**: Redesign ExploreMap to be the PRIMARY navigation for finding hackathons:
  - Takes up most of the viewport (full-width, tall — `calc(100vh - nav)` or similar)
  - Search input overlaid on the map (top-left area)
  - Filter controls overlaid on the map (tags, techs, location as chips/dropdowns)
  - Clusters use brand-green → brand-purple gradient based on density
  - Individual markers are colored by status (LIVE=green, UPCOMING=purple, ENDED=muted)
  - Clicking a marker opens a rich popup card with: status pill, title (links to detail), date range, participant count, top prize, tags, location
  - Popup has "View Details →" link to `/hackathon/[slug]`
  - Online-only hackathons shown as a collapsible section below the map
  - Geolocation centers map on user's location
  - Dark/light theme detection for map style
- **Acceptance**: Map renders full-page, search/filters overlay on map, markers clickable with rich popups
- **Dependencies**: 2.1

### Task 3.2: Create MapSearchOverlay component

- **Files**: `shared/components/map-search-overlay.tsx`
- **Description**: Extract the search + filter UI into a component overlaid on the map:
  - Search input (top-left, glass-morphism style matching Hackra's design system)
  - Filter dropdowns for Tags, Technologies, Location
  - Active filter chips displayed as overlays
  - Uses `nuqs` for URL state (q, tags, techs, location)
  - Clear all button
  - Mobile-responsive (collapsible on small screens)
- **Acceptance**: Search and filter controls overlay on the map, work with URL params
- **Dependencies**: 3.1

### Task 3.3: Rewrite explore page as map-only

- **Files**: `app/(public)/explore/page.tsx`
- **Description**: Remove card grid entirely. The explore page IS the map:
  - Remove `ExploreGrid` import and view toggle logic
  - Default view is MAP (always)
  - Remove `view` param from `searchParams`
  - Fetch only `getHackathonsForMap()` (no `getHackathonsForExplore()`)
  - Render `ExploreMap` full-page with `MapSearchOverlay`
  - Remove `ExploreGrid` from imports
  - SEO metadata stays the same
- **Acceptance**: `/explore` shows map-only view, no card grid
- **Dependencies**: 3.2

### Task 3.4: Update ExploreMapWrapper

- **Files**: `app/(public)/explore/_components/explore-map-wrapper.tsx`
- **Description**: Update wrapper to match new ExploreMap props (pass filtered hackathons + filter options)
- **Acceptance**: Wrapper passes correct props
- **Dependencies**: 3.1

### Task 3.5: Remove ExploreGrid and old filters

- **Files**: `app/(public)/explore/_components/explore-grid.tsx`, `app/(public)/explore/_components/explore-filters.tsx`
- **Description**: Delete `explore-grid.tsx` and `explore-filters.tsx` — they are no longer needed. The grid and separate filters are replaced by the map + overlay.
- **Acceptance**: Files deleted, no import errors
- **Dependencies**: 3.3

---

## Phase 4: Home Page Map

### Task 4.1: Create FeaturedHackathonsMap component

- **Files**: `shared/components/featured-hackathons-map.tsx`
- **Description**: Create a smaller version of the map for the home page:
  - Shows only LIVE/UPCOMING featured hackathons (top 6-10 by participant count)
  - Shorter viewport height (~350-400px)
  - Same clustering and marker style as explore map
  - Same rich popup on click with "View Details →" link
  - Auto-fits bounds to show all featured markers
  - Dark/light theme detection
- **Acceptance**: Home page shows featured hackathons on an interactive map
- **Dependencies**: 3.1

### Task 4.2: Replace FeaturedHackatons card grid with map

- **Files**: `app/_components/featured-hackatons.tsx`
- **Description**: Replace the card grid with FeaturedHackathonsMap:
  - Fetch featured hackathons with `getFeaturedHackatons()` but filter to only ones with coordinates
  - For online-only featured hackathons, show a small card list below the map
  - Update section title to "ACTIVE HACKATHONS" with map icon
  - Keep "VIEW ALL →" link to `/explore`
- **Acceptance**: Home page uses map for featured hackathons
- **Dependencies**: 4.1

---

## Phase 5: Seeds & Data

### Task 5.1: Expand seed hackathons with diverse real-world coordinates

- **Files**: `shared/lib/mock-data.ts`, `prisma/seed-hackathons.ts`
- **Description**: Currently only 4 of 10 hackathons have coordinates (SF, London, Pittsburgh, Seattle, Berlin). Add coordinates for ALL in-person hackathons:
  - "Rust Belt Hack" → Pittsburgh ✓ (already has coords)
  - "Open Source Summit Hackathon" → Austin, TX (30.2672, -97.7431)
  - "Climate Tech Hackathon" → Copenhagen (55.6761, 12.5683)
  - "GameDev Jam 2025" → Tokyo (35.6762, 139.6503)
  - "LATAM Buildathon 2025" → Buenos Aires (-34.6037, -58.3816)
  - "DevTools Hackathon" → Tel Aviv (32.0853, 34.7818)
  - Keep online hackathons with null coords
  - Add 5-6 more seed hackathons with diverse global coordinates (Lagos, Singapore, São Paulo, Sydney, Mumbai) for better map coverage
- **Acceptance**: All in-person seeds have real coordinates, map shows hackathons worldwide
- **Dependencies**: 1.2

### Task 5.2: Add getFeaturedHackatonsForMap() data function

- **Files**: `data/hackatons.ts`
- **Description**: Create a data function that returns featured hackathons in the `MapHackathon` format (with lat/lng, topPrize, participantCount). Similar to `getHackathonsForMap()` but limited to top ~8 by participant count.
- **Acceptance**: Home page can fetch featured hackathons as MapHackathon[]
- **Dependencies**: 1.2

---

## Phase 6: Location Picker (Create/Edit)

### Task 6.1: Create LocationPicker component

- **Files**: `shared/components/location-picker.tsx`
- **Description**: Create client component with mapcn Map, draggable marker, click-to-select, and reverse geocoding display:
  - Small map (~400px height) for form embedding
  - Click on map places marker at that location
  - Marker is draggable
  - Shows reverse-geocoded address below the map
  - Returns `{ latitude, longitude, address }` to parent form
  - Works with TanStack Form field binding
- **Acceptance**: Clicking map places marker, dragging updates position, address displayed
- **Dependencies**: 1.1, 1.3

### Task 6.2: Integrate LocationPicker in create form

- **Files**: `app/(private)/(user)/create/_components/create-hackathon-form.tsx`
- **Description**: Replace the text-only location input with LocationPicker when locationMode is `in_person` or `hybrid`. For `remote`, hide the map entirely.
- **Acceptance**: LocationPicker shows for in-person/hybrid, hidden for remote
- **Dependencies**: 6.1

### Task 6.3: Add lat/lng to create action

- **Files**: `app/(private)/(user)/create/_actions.ts`
- **Description**: Update createHackathonAction to accept and save `latitude`/`longitude` fields. Geocode the text location as fallback if coordinates not provided.
- **Acceptance**: Coordinates saved to database on create
- **Dependencies**: 1.2, 6.2

### Task 6.4: Reverse geocoding display in LocationPicker

- **Files**: `shared/components/location-picker.tsx`
- **Description**: Use `reverseGeocode()` from geocoding.ts to show the address when marker is placed. Display as a small text below the map.
- **Acceptance**: Address shows after selecting location
- **Dependencies**: 6.1, 1.3

---

## Phase 7: Luma Integration

### Task 7.1: Add geocoding to Luma import

- **Files**: `shared/lib/luma-scraper.ts` (or relevant import action file)
- **Description**: Call `geocodeLocation()` after scraping Luma event location, handle graceful degradation (null coords if geocoding fails)
- **Acceptance**: Imported hackathons include coordinates when available
- **Dependencies**: 1.3

### Task 7.2: Update import action with lat/lng

- **Files**: `app/(private)/(user)/import/_actions.ts`
- **Description**: Update import action to include latitude/longitude in database insert
- **Acceptance**: Import flow saves coordinates
- **Dependencies**: 7.1, 1.2

---

## Phase 8: Polish & Edge Cases

### Task 8.1: Custom marker styling with brand feel

- **Files**: `shared/components/explore-map.tsx`
- **Description**: Style markers with brand green/purple colors, pixel-art inspired pulse animation for LIVE hackathons, subtle glow effects
- **Acceptance**: Markers match Hackra design system
- **Dependencies**: 3.1

### Task 8.2: Loading and error states

- **Files**: `shared/components/explore-map-wrapper.tsx`, `shared/components/featured-hackathons-map.tsx`
- **Description**: Add loading skeleton for map containers, error boundary with retry button, empty state when no hackathons match filters
- **Acceptance**: Graceful loading/error states
- **Dependencies**: 3.1, 4.1

### Task 8.3: Mobile responsiveness

- **Files**: `shared/components/explore-map.tsx`, `shared/components/map-search-overlay.tsx`
- **Description**: Ensure map and overlay work on mobile: collapsible search/filters, touch-friendly markers, responsive popup cards, swipe-friendly online section
- **Acceptance**: Map is usable on mobile viewport
- **Dependencies**: 3.1, 3.2

### Task 8.4: Update edit hackathon dialog

- **Files**: `app/(private)/(user)/dashboard/_components/edit-hackathon-dialog.tsx`
- **Description**: Add LocationPicker to edit dialog for updating location coordinates
- **Acceptance**: Can update coordinates when editing hackathon
- **Dependencies**: 6.1
