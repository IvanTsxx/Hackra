# Delta Spec: hackathon-map-view

## Overview

This specification defines the requirements for adding interactive map views to the Hackra platform, enabling geographic visualization of hackathons and location-based selection during creation.

---

## 1. Schema Changes

### 1.1 Hackathon Model Coordinates

**Scenario: Adding latitude and longitude fields to Hackathon model**

- **Given** the Prisma schema for the Hackathon model
- **When** a migration is applied to add new fields
- **Then** the `Hackathon` model MUST contain two nullable Float fields:
  - `latitude`: Nullable Float representing the geographic latitude (-90 to 90)
  - `longitude`: Nullable Float representing the geographic longitude (-180 to 180)

**Implementation Requirements:**

- The fields MUST be nullable to support online-only hackathons that have no physical location
- The fields MUST default to `null` in the database schema
- The fields MUST have an index for efficient geographic queries in future iterations
- The fields SHOULD have validation constraints at the application layer to ensure:
  - latitude is between -90 and 90
  - longitude is between -180 and 180

**Schema Addition:**

```prisma
latitude   Float?
longitude  Float?

@@index([latitude, longitude])
```

---

## 2. Geocoding Utility

### 2.1 Nominatim Geocoding Service

**Scenario: Geocoding location strings to coordinates**

- **Given** a location string (e.g., "San Francisco, CA" or "London, UK")
- **When** the geocoding function is invoked with a valid location string
- **Then** the function MUST return an object containing:
  - `latitude`: Number representing the latitude
  - `longitude`: Number representing the longitude
  - `displayName`: String representing the normalized location name

**Scenario: Geocoding an invalid or unmappable location**

- **Given** an invalid location string (empty, special characters only, or non-existent place)
- **When** the geocoding function is invoked
- **Then** the function MUST return `null` instead of throwing an error
- **And** SHOULD log the failed location for debugging purposes

### 2.2 Rate Limiting

**Scenario: Exceeding Nominatim rate limits**

- **Given** multiple geocoding requests within a short time period
- **When** the rate limiter detects more than 1 request per second
- **Then** subsequent requests MUST be delayed to comply with Nominatim's 1 req/sec limit
- **And** the delay SHOULD use exponential backoff with a maximum of 5 seconds

**Implementation Requirements:**

- The geocoding utility MUST implement an in-memory rate limiter
- The rate limiter SHOULD track requests per process instance
- The utility MUST NOT expose internal rate limiting details to callers

### 2.3 Caching Strategy

**Scenario: Repeated geocoding requests for the same location**

- **Given** a location string that has been previously geocoded
- **When** the geocoding function is invoked with the same location string
- **Then** the cached result MUST be returned instead of making a new API call
- **And** the cache MUST have a minimum TTL of 7 days

**Implementation Requirements:**

- The cache MUST use a Map or similar in-memory data structure keyed by normalized location string
- The cache key SHOULD normalize the input (lowercase, trimmed whitespace)
- The cache MAY be cleared on application restart

### 2.4 Reverse Geocoding

**Scenario: Converting coordinates to a human-readable address**

- **Given** a latitude and longitude coordinate pair
- **When** the reverse geocoding function is invoked
- **Then** the function MUST return a display name string representing the location
- **Or** return `null` if the coordinates cannot be reverse-geocoded

---

## 3. Explore Map View

### 3.1 View Toggle

**Scenario: Switching between grid and map view**

- **Given** the explore page is loaded with grid view as default
- **When** the user navigates to `?view=map`
- **Then** the map view component MUST be rendered instead of the grid
- **And** the URL parameter MUST be recognized by the application
- **And** navigating to `?view=grid` SHOULD return to the grid view

**Implementation Requirements:**

- The view toggle MUST be implemented using nuqs for URL state management
- The default view when no parameter is specified SHOULD be `grid`
- The toggle component SHOULD show the current view state visually

### 3.2 Map Initialization

**Scenario: Initializing the map with user's geolocation**

- **Given** the map view is rendered
- **When** the map component mounts
- **Then** the map SHOULD attempt to obtain the user's browser geolocation
- **And** if geolocation is available, the map center MUST be set to the user's coordinates
- **And** the map zoom level SHOULD be appropriate for a city-level view (approximately zoom 10-12)

**Scenario: Browser geolocation unavailable**

- **Given** the user's browser does not support geolocation or the user denies permission
- **When** the map initializes
- **Then** the map SHOULD center on a default location (world view or a sensible default like San Francisco)
- **And** the default center coordinates SHOULD be configurable

### 3.3 Map Cluster Layer

**Scenario: Displaying clustered markers for hackathons**

- **Given** there are multiple hackathons with coordinates
- **When** the map renders with hackathon data
- **Then** hackathons within 50km of each other SHOULD be grouped into clusters
- **And** clusters MUST use custom colors matching the Hackra brand:
  - Primary cluster color: brand-green (#22c55e or similar)
  - Secondary cluster color: brand-purple (#a855f7 or similar)
- **And** cluster size SHOULD reflect the number of hackathons in the cluster
- **And** clicking a cluster SHOULD zoom into its bounds to show individual markers

**Implementation Requirements:**

- The clustering algorithm MUST use the MapClusterLayer component from mapcn
- The clusterMaxZoom SHOULD be set to 14 to prevent over-clustering at high zoom levels
- The clusterRadius SHOULD be set to 50 (pixels) for visual clustering

### 3.4 Individual Markers

**Scenario: Clicking a hackathon marker**

- **Given** a map with individual hackathon markers
- **When** the user clicks on a marker for a specific hackathon
- **Then** a popup MUST be displayed showing the HackathonCard in compact format
- **And** the popup MUST include:
  - Hackathon title (linked to the hackathon detail page)
  - Date range
  - Location string
  - Tags (up to 3)
  - Participation mode (in_person/hybrid/remote indicator)

**Scenario: Marker styling for hackra theme**

- **Given** a map is displayed
- **When** individual markers are rendered
- **Then** the markers SHOULD use custom styling that matches the pixel art theme
- **And** the marker icon SHOULD be distinguishable from default map markers

### 3.5 Filter Integration

**Scenario: Applying filters to map data**

- **Given** the user has active filters (q, tags, techs) in the URL
- **When** the map view is rendered
- **Then** only hackathons matching the active filters MUST be displayed on the map
- **And** changing filters SHOULD update the map markers without a full page reload
- **And** the filter state from nuqs MUST be passed to the map component

### 3.6 Online Hackathons Display

**Scenario: Displaying online-only hackathons**

- **Given** there are hackathons with `isOnline: true` or `locationMode: "remote"`
- **When** the map view is rendered
- **Then** these hackathons MUST be displayed in a separate section below the map
- **And** this section SHOULD be labeled clearly (e.g., "Online Hackathons" or similar)
- **And** the section SHOULD use the same card component as the grid view
- **And** the section SHOULD only appear when there are online hackathons to display

**Implementation Requirements:**

- The data layer MUST separate hackathons into two groups:
  - Those with valid coordinates (displayed on map)
  - Those without coordinates (displayed in the online section)
- The separation logic MUST apply all active filters to both groups

---

## 4. Location Picker in Create Form

### 4.1 Map Display for In-Person/Hybrid Modes

**Scenario: Displaying location picker map for in_person mode**

- **Given** the user selects "IN_PERSON" or "HYBRID" as the location mode
- **When** the form renders the location section
- **Then** a map component MUST be displayed instead of a text input
- **And** the map SHOULD show a draggable marker for location selection
- **And** the map SHOULD initialize with a default center (e.g., San Francisco or world view)

**Scenario: User switches from in_person to remote**

- **Given** the location picker map is displayed
- **When** the user changes location mode to "remote"
- **Then** the map component SHOULD be hidden
- **And** no coordinates SHOULD be stored for the hackathon

### 4.2 Draggable Marker

**Scenario: User drags the marker to select location**

- **Given** the location picker map is displayed
- **When** the user clicks and drags the marker to a new position
- **Then** the marker position MUST update in real-time during the drag
- **And** on drag end, the coordinates MUST be stored in the form state
- **And** reverse geocoding SHOULD be triggered to update the location text display

### 4.3 Click-to-Select

**Scenario: User clicks on map to set location**

- **Given** the location picker map is displayed
- **When** the user clicks on the map (not on the marker)
- **Then** a marker MUST be placed at the clicked location
- **And** the coordinates MUST be stored in the form state
- **And** reverse geocoding MUST be triggered to display the address

### 4.4 Reverse Geocoding Display

**Scenario: Displaying address from coordinates**

- **Given** coordinates have been set (via drag or click)
- **When** reverse geocoding completes
- **Then** the returned address string MUST be displayed to the user
- **And** the user SHOULD be able to override this with manual text input as a fallback

### 4.5 Form Submission with Coordinates

**Scenario: Submitting form with location coordinates**

- **Given** the user has selected a location on the map
- **When** the form is submitted
- **Then** the form data MUST include:
  - The location text string (from reverse geocoding or manual input)
  - The latitude coordinate
  - The longitude coordinate
- **And** these values MUST be saved to the database when the hackathon is created

**Scenario: Location mode is remote on form submission**

- **Given** the user selected "remote" as the location mode
- **When** the form is submitted
- **Then** latitude and longitude fields MUST be null in the database
- **And** the location field SHOULD contain "Online" or similar

---

## 5. Luma Import Geocoding

### 5.1 Automatic Geocoding on Import

**Scenario: Importing hackathon from Luma URL**

- **Given** a valid Luma URL is provided and the import is triggered
- **When** the Luma scraper successfully extracts the location string
- **Then** the geocoding function MUST be automatically invoked
- **And** if geocoding succeeds, the coordinates MUST be stored with the hackathon data
- **And** if geocoding fails, the location string MUST still be saved without coordinates

**Scenario: Luma import returns no location**

- **Given** the Luma scraper cannot extract a location from the event
- **When** the import is processed
- **Then** the hackathon MUST be created with null coordinates
- **And** the import SHOULD NOT fail due to missing location

### 5.2 Graceful Degradation

**Scenario: Geocoding service unavailable during import**

- **Given** the geocoding service is unreachable or rate-limited
- **When** an import attempts to geocode the location
- **Then** the import MUST still complete successfully
- **And** the location string MUST be stored without coordinates
- **And** a warning SHOULD be logged for later manual geocoding

---

## 6. Map Theme Integration

### 6.1 Auto Theme Detection

**Scenario: Detecting dark mode from document class**

- **Given** the user's operating system is set to dark mode
- **When** the map component initializes
- **Then** the map MUST use a dark theme
- **And** when the operating system theme changes, the map SHOULD update automatically
- **And** the same behavior MUST apply for light mode

**Implementation Requirements:**

- The theme detection MUST read from `document.documentElement.classList`
- The mapcn `<Map>` component SHOULD accept an `autoTheme` prop or similar
- The default theme when no detection is possible SHOULD be light

### 6.2 Custom Marker Styling

**Scenario: Applying hackra pixel theme to markers**

- **Given** the map is rendered
- **When** markers are displayed
- **Then** the marker icons SHOULD use custom SVG or image assets that match the hackra brand
- **And** the colors SHOULD use brand-green and brand-purple as accent colors
- **And** the marker size SHOULD be appropriate for map interactions (not too small to tap on mobile)

---

## 7. Seed Data

### 7.1 Pre-computed Coordinates

**Scenario: Adding coordinates to seed hackathons**

- **Given** the seed data contains hackathon location strings
- **When** the seed script is run or updated
- **Then** the seed script MUST include pre-computed latitude/longitude pairs for each location
- **And** the coordinates MUST be accurate for the specified location strings
- **And** online hackathons in the seed data MUST have null coordinates

**Implementation Requirements:**

- A mapping of known location strings to coordinates SHOULD be maintained
- The seed script MAY use the geocoding utility to generate initial mappings
- Manual verification of seed coordinates is RECOMMENDED for key locations (major cities)

### 7.2 Known Seed Locations

The seed data SHOULD include coordinates for at least these locations:

- San Francisco, CA: ~37.7749, -122.4194
- London, UK: ~51.5074, -0.1278
- New York, NY: ~40.7128, -74.0060
- Berlin, DE: ~52.5200, 13.4050
- Tokyo, JP: ~35.6762, 139.6503
- Online/null: null, null

---

## 8. Edge Cases and Error Handling

### 8.1 Empty State

**Scenario: No hackathons with coordinates**

- **Given** all hackathons in the database have null coordinates
- **When** the map view is rendered
- **Then** an appropriate empty state message SHOULD be displayed
- **And** the user SHOULD be informed that no map data is available

### 8.2 Partial Data

**Scenario: Some hackathons have coordinates, some don't**

- **Given** there is a mix of hackathons with and without coordinates
- **When** the map view is rendered
- **Then** only hackathons with valid coordinates MUST appear on the map
- **And** the offline/online section MUST display hackathons without coordinates
- **And** the filter counts SHOULD reflect the total (both mapped and unmapped)

### 8.3 Geocoding Errors

**Scenario: Geocoding returns invalid coordinates**

- **Given** the geocoding API returns coordinates outside valid ranges
- **When** processing the geocoding result
- **Then** the result MUST be treated as a failure
- **And** null coordinates MUST be stored instead of invalid data

### 8.4 Browser Compatibility

**Scenario: Browser does not support required map features**

- **Given** the user's browser is outdated or does not support WebGL
- **When** the map component attempts to render
- **Then** a fallback message SHOULD be displayed
- **And** the grid view MUST remain accessible

### 8.5 Network Failures

**Scenario: Map tiles fail to load**

- **Given** there is a network error fetching map tiles
- **When** the map attempts to load tiles
- **Then** the map SHOULD show placeholder tiles or a graceful error
- **And** the hackathon markers SHOULD still be functional (popups may show)

---

## 9. Acceptance Criteria

### Schema

- [ ] Prisma migration adds latitude and longitude nullable Float fields to Hackathon
- [ ] Database index created on coordinates for future query optimization

### Geocoding

- [ ] geocoding.ts exports `geocode(location: string): Promise<GeocodeResult | null>`
- [ ] geocoding.ts exports `reverseGeocode(lat: number, lng: number): Promise<string | null>`
- [ ] Rate limiting enforced at 1 req/sec
- [ ] In-memory cache with 7-day TTL
- [ ] Returns null on failure instead of throwing

### Explore Map

- [ ] ?view=map URL parameter toggles map view
- [ ] ?view=grid returns to grid view
- [ ] Default view is grid when no parameter present
- [ ] Map centers on user geolocation when available
- [ ] Map defaults to world view when geolocation unavailable
- [ ] MapClusterLayer clusters hackathons within 50km
- [ ] Cluster colors use brand-green and brand-purple
- [ ] Individual markers show popup with HackathonCard on click
- [ ] Filters (q, tags, techs) apply to map data
- [ ] Online hackathons displayed in separate section below map

### Location Picker

- [ ] Map displayed when locationMode is in_person or hybrid
- [ ] Map hidden when locationMode is remote
- [ ] Draggable marker updates form state on drag end
- [ ] Click on map places marker and updates form state
- [ ] Reverse geocoding displays address from coordinates
- [ ] Form submission includes latitude and longitude

### Luma Import

- [ ] Location string geocoded automatically on Luma import
- [ ] Graceful fallback if geocoding fails
- [ ] Location string saved even when geocoding fails

### Theme

- [ ] Map uses dark theme when document has dark class
- [ ] Map uses light theme when document has light class
- [ ] Custom marker styling matches hackra brand

### Seed Data

- [ ] Seed hackathons include pre-computed coordinates
- [ ] Online hackathons have null coordinates in seed

---

## 10. Non-Functional Requirements

- Map loading time SHOULD be under 2 seconds on average connection
- Geocoding responses SHOULD be cached to minimize API calls
- Map interactions SHOULD be smooth at 60fps on modern devices
- Mobile touch interactions MUST work for panning, zooming, and marker selection
