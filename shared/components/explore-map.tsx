"use client";

import {
  Calendar,
  ChevronDown,
  Globe,
  MapPin,
  Tag,
  Trophy,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { MapHackathon } from "@/data/hackatons";
import { cn } from "@/shared/lib/utils";
import {
  Map as MapLibreMap,
  MapClusterLayer,
  MapControls,
  MapPopup,
  useMap,
} from "@/ui/map";
import type { MapRef } from "@/ui/map";

import { StatusPill } from "./tag-badge";

interface ExploreMapProps {
  hackathons: MapHackathon[];
  className?: string;
  showFilters?: boolean;
}

// Brand colors for clusters: green (few) → purple (many)
// MapLibre GL only supports hex/rgb — no oklch
const CLUSTER_COLORS: [string, string, string] = [
  "#4ade80",
  "#8b5cf6",
  "#7c3aed",
];
const CLUSTER_THRESHOLDS: [number, number] = [5, 20];
const POINT_COLOR = "#4ade80";

const DEFAULT_CENTER = [0, 20] as [number, number];
const DEFAULT_ZOOM = 2;

interface HackathonProperties {
  id: string;
  slug: string;
  status: string;
  title: string;
}

// ─── Filter types ────────────────────────────────────────────────────────────

type FilterKind = "status" | "tag" | "tech";

interface FilterItem {
  kind: FilterKind;
  value: string;
}

interface ActiveFilter extends FilterItem {
  hackathons: MapHackathon[];
}

// FlyTo controller — lives inside Map context
function FlyToController({
  target,
}: {
  target: { lng: number; lat: number; zoom?: number } | null;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !target) return;
    map.flyTo({
      center: [target.lng, target.lat],
      duration: 1200,
      zoom: target.zoom ?? 6,
    });
  }, [map, target]);

  return null;
}

// ─── Derived data helpers ─────────────────────────────────────────────────────

function buildFilterOptions(hackathons: MapHackathon[]) {
  const statusMap = new Map<string, number>();
  const tagMap = new Map<string, number>();
  const techMap = new Map<string, number>();

  for (const h of hackathons) {
    statusMap.set(h.status, (statusMap.get(h.status) ?? 0) + 1);
    for (const t of h.tags) tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
    for (const t of h.techs) techMap.set(t, (techMap.get(t) ?? 0) + 1);
  }

  return { statusMap, tagMap, techMap };
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

interface FilterChipProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, count, icon, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-all shrink-0",
        "border backdrop-blur-md",
        active
          ? "bg-brand-green/20 border-brand-green text-brand-green shadow-[0_0_8px_oklch(0.72_0.19_145/0.3)]"
          : "bg-card/70 border-border/40 text-muted-foreground hover:border-brand-green/40 hover:text-foreground"
      )}
      aria-pressed={active}
    >
      {icon}
      <span className="max-w-[100px] truncate">{label}</span>
      <span
        className={cn(
          "ml-0.5 text-[9px] px-1 py-px",
          active
            ? "bg-brand-green/20 text-brand-green"
            : "bg-muted/60 text-muted-foreground"
        )}
      >
        {count}
      </span>
      {active && <ChevronDown className="size-3 ml-0.5" />}
    </button>
  );
}

// ─── Dropdown panel ───────────────────────────────────────────────────────────

interface FilterDropdownProps {
  filter: ActiveFilter;
  onClose: () => void;
  onFlyTo: (lng: number, lat: number) => void;
}

function FilterDropdown({ filter, onClose, onFlyTo }: FilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const withCoords = filter.hackathons.filter(
    (h) => Number.isFinite(h.latitude) && Number.isFinite(h.longitude)
  );
  const online = filter.hackathons.filter(
    (h) => h.isOnline || h.locationMode === "remote"
  );

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-30 w-[320px] animate-in fade-in-0 slide-in-from-top-2"
    >
      <div className="glass bg-card/90 border border-border/50 backdrop-blur-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
          <span className="text-[10px] font-pixel text-brand-green tracking-wider uppercase">
            {filter.kind === "status" ? filter.value : `#${filter.value}`} —{" "}
            {filter.hackathons.length} hackathones
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close filter"
          >
            <X className="size-3" />
          </button>
        </div>

        {/* Hackathon list */}
        <div className="max-h-[280px] overflow-y-auto">
          {filter.hackathons.length === 0 && (
            <p className="text-[11px] text-muted-foreground p-3 text-center">
              No hackathones encontrados
            </p>
          )}

          {/* Map hackathons */}
          {withCoords.map((h) => (
            <FilterDropdownRow
              key={h.id}
              hackathon={h}
              onFlyTo={onFlyTo}
              onClose={onClose}
            />
          ))}

          {/* Online only */}
          {online.map((h) => (
            <FilterDropdownRow
              key={h.id}
              hackathon={h}
              onFlyTo={onFlyTo}
              onClose={onClose}
              isOnline
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FilterDropdownRowProps {
  hackathon: MapHackathon;
  onFlyTo: (lng: number, lat: number) => void;
  onClose: () => void;
  isOnline?: boolean;
}

function FilterDropdownRow({
  hackathon: h,
  onFlyTo,
  onClose,
  isOnline = false,
}: FilterDropdownRowProps) {
  const startDate = new Date(h.startDate);

  const handleClick = () => {
    onClose();
    if (
      !isOnline &&
      Number.isFinite(h.longitude) &&
      Number.isFinite(h.latitude)
    ) {
      onFlyTo(Number(h.longitude), Number(h.latitude));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-accent/20 transition-colors border-b border-border/20 last:border-0 text-left group"
    >
      {/* Status / Online badge */}
      <div className="pt-0.5 shrink-0">
        {isOnline ? (
          <span className="flex items-center gap-1 text-[9px] border border-brand-purple/40 px-1 py-px text-brand-purple">
            <Wifi className="size-2" />
            ONLINE
          </span>
        ) : (
          <StatusPill
            index={0}
            status={h.status as "LIVE" | "UPCOMING" | "ENDED"}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-foreground group-hover:text-brand-green transition-colors truncate leading-tight">
          {h.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Calendar className="size-2.5" />
            {startDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-0.5">
            <Users className="size-2.5" />
            {h.participantCount}
          </span>
          {h.topPrize && (
            <span className="flex items-center gap-0.5 text-brand-green">
              <Trophy className="size-2.5" />
              {h.topPrize.toLocaleString("en-US", {
                currency: "USD",
                maximumFractionDigits: 0,
                style: "currency",
              })}
            </span>
          )}
        </div>
        {!isOnline && Number.isFinite(h.latitude) && (
          <span className="flex items-center gap-0.5 mt-0.5 text-[9px] text-muted-foreground/60">
            <MapPin className="size-2" />
            {h.location.split(",")[0]}
            <span className="ml-1 text-brand-green/60">→ click para ir</span>
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExploreMap({
  hackathons,
  className,
  showFilters = true,
}: ExploreMapProps) {
  const mapRef = useRef<MapRef>(null);

  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: HackathonProperties;
  } | null>(null);

  const [viewport, setViewport] = useState({
    bearing: 0,
    center: DEFAULT_CENTER,
    pitch: 0,
    zoom: DEFAULT_ZOOM,
  });

  const [flyTarget, setFlyTarget] = useState<{
    lng: number;
    lat: number;
    zoom?: number;
  } | null>(null);

  const [isLocating, setIsLocating] = useState(false);

  // Active filter dropdown state
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  // Split hackathons: those with valid coords go on map, online-only go in list
  const mapHackathons = useMemo(
    () =>
      hackathons.filter(
        (h): h is MapHackathon & { latitude: number; longitude: number } =>
          Number.isFinite(h.latitude) && Number.isFinite(h.longitude)
      ),
    [hackathons]
  );

  const onlineHackathons = useMemo(
    () => hackathons.filter((h) => h.isOnline || h.locationMode === "remote"),
    [hackathons]
  );

  // Build filter options
  const { statusMap, tagMap, techMap } = useMemo(
    () => buildFilterOptions(hackathons),
    [hackathons]
  );

  // Build GeoJSON for MapClusterLayer
  const geojson = useMemo(
    () => ({
      features: mapHackathons
        .filter(
          (h) => Number.isFinite(h.longitude) && Number.isFinite(h.latitude)
        )
        .map((h) => ({
          geometry: {
            coordinates: [Number(h.longitude), Number(h.latitude)] as [
              number,
              number,
            ],
            type: "Point" as const,
          },
          properties: {
            id: h.id,
            slug: h.slug,
            status: h.status,
            title: h.title,
          },
          type: "Feature" as const,
        })),
      type: "FeatureCollection" as const,
    }),
    [mapHackathons]
  );

  // Lookup map for popup details
  const hackathonMap = useMemo(() => {
    const map = new Map<string, (typeof mapHackathons)[number]>();
    for (const h of mapHackathons) {
      map.set(h.id, h);
    }
    return map;
  }, [mapHackathons]);

  // Handle locate user
  const locateUser = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFlyTarget({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            zoom: 10,
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  // Handle point click from cluster layer
  const handlePointClick = useCallback(
    (
      feature: GeoJSON.Feature<GeoJSON.Point, HackathonProperties>,
      coordinates: [number, number]
    ) => {
      const id = feature.properties?.id;
      if (id) {
        setSelectedPoint({ coordinates, properties: feature.properties });
        setActiveFilter(null);
      }
    },
    []
  );

  // Selected hackathon for popup
  const selectedHackathon = selectedPoint
    ? (hackathonMap.get(selectedPoint.properties.id) ?? null)
    : null;

  // Toggle filter dropdown
  const handleFilterClick = useCallback(
    (kind: FilterKind, value: string) => {
      if (activeFilter?.kind === kind && activeFilter?.value === value) {
        setActiveFilter(null);
        return;
      }

      // Filter hackathons matching this filter
      const matched = hackathons.filter((h) => {
        if (kind === "status") return h.status === value;
        if (kind === "tag") return h.tags.includes(value);
        if (kind === "tech") return h.techs.includes(value);
        return false;
      });

      setActiveFilter({ hackathons: matched, kind, value });
      setSelectedPoint(null);
    },
    [activeFilter, hackathons]
  );

  const handleFlyTo = useCallback((lng: number, lat: number, zoom?: number) => {
    setFlyTarget({ lat, lng, zoom });
  }, []);

  return (
    <div className={cn("relative h-full", className)}>
      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="relative z-20 flex items-center gap-2 px-3 py-2 bg-card/80 border-b border-border/30 backdrop-blur-md overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={locateUser}
            disabled={isLocating}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-all shrink-0 border backdrop-blur-md",
              isLocating
                ? "bg-brand-green/20 border-brand-green text-brand-green animate-pulse"
                : "bg-card/70 border-border/40 text-muted-foreground hover:border-brand-green/40 hover:text-foreground"
            )}
          >
            <MapPin className="size-3" />
            <span>{isLocating ? "Buscando..." : "Buscar cerca de mí"}</span>
          </button>

          <div className="w-px h-4 bg-border/40 shrink-0" />

          <span className="text-[10px] font-pixel text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
            Filtrar
          </span>

          {/* Status filters */}
          {[...statusMap.entries()].map(([status, count]) => (
            <div key={`s-${status}`} className="relative">
              <FilterChip
                label={status}
                count={count}
                icon={<Zap className="size-3" />}
                active={
                  activeFilter?.kind === "status" &&
                  activeFilter?.value === status
                }
                onClick={() => handleFilterClick("status", status)}
              />
              {activeFilter?.kind === "status" &&
                activeFilter?.value === status && (
                  <FilterDropdown
                    filter={activeFilter}
                    onClose={() => setActiveFilter(null)}
                    onFlyTo={handleFlyTo}
                  />
                )}
            </div>
          ))}

          <div className="w-px h-4 bg-border/40 shrink-0" />

          {/* Top tags */}
          {[...tagMap.entries()]
            .toSorted((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([tag, count]) => (
              <div key={`t-${tag}`} className="relative">
                <FilterChip
                  label={tag}
                  count={count}
                  icon={<Tag className="size-3" />}
                  active={
                    activeFilter?.kind === "tag" && activeFilter?.value === tag
                  }
                  onClick={() => handleFilterClick("tag", tag)}
                />
                {activeFilter?.kind === "tag" &&
                  activeFilter?.value === tag && (
                    <FilterDropdown
                      filter={activeFilter}
                      onClose={() => setActiveFilter(null)}
                      onFlyTo={handleFlyTo}
                    />
                  )}
              </div>
            ))}

          <div className="w-px h-4 bg-border/40 shrink-0" />

          {/* Top techs */}
          {[...techMap.entries()]
            .toSorted((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tech, count]) => (
              <div key={`tc-${tech}`} className="relative">
                <FilterChip
                  label={tech}
                  count={count}
                  icon={<Zap className="size-2.5" />}
                  active={
                    activeFilter?.kind === "tech" &&
                    activeFilter?.value === tech
                  }
                  onClick={() => handleFilterClick("tech", tech)}
                />
                {activeFilter?.kind === "tech" &&
                  activeFilter?.value === tech && (
                    <FilterDropdown
                      filter={activeFilter}
                      onClose={() => setActiveFilter(null)}
                      onFlyTo={handleFlyTo}
                    />
                  )}
              </div>
            ))}
        </div>
      )}

      {/* ── Map ────────────────────────────────────────────────────────────── */}
      <div className="relative h-[calc(100dvh-4rem-40px)] border border-border/40 overflow-hidden">
        <MapLibreMap
          ref={mapRef}
          viewport={viewport}
          onViewportChange={(v) => setViewport(v)}
          className="h-full w-full"
        >
          <MapControls position="top-right" showZoom showCompass showLocate />

          {/* FlyTo controller inside Map context */}
          <FlyToController target={flyTarget} />

          <MapClusterLayer<HackathonProperties>
            data={geojson}
            clusterMaxZoom={14}
            clusterRadius={50}
            clusterColors={CLUSTER_COLORS}
            clusterThresholds={CLUSTER_THRESHOLDS}
            pointColor={POINT_COLOR}
            onPointClick={handlePointClick}
          />

          {selectedPoint && selectedHackathon && (
            <MapPopup
              key={`${selectedPoint.coordinates[0]}-${selectedPoint.coordinates[1]}`}
              longitude={selectedPoint.coordinates[0]}
              latitude={selectedPoint.coordinates[1]}
              onClose={() => setSelectedPoint(null)}
              closeOnClick={false}
              focusAfterOpen={false}
              closeButton
            >
              <HackathonPopupCard hackathon={selectedHackathon} />
            </MapPopup>
          )}
        </MapLibreMap>

        {/* Online hackathons overlay panel - bottom-left */}
        {onlineHackathons.length > 0 && (
          <div className="absolute bottom-4 left-4 z-10 w-[280px] sm:w-[320px]">
            <div className="glass bg-card/80 backdrop-blur-md border border-border/40 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={12} className="text-brand-green" />
                <h3 className="font-pixel text-[10px] text-brand-green tracking-wider">
                  ONLINE HACKATHONS
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  ({onlineHackathons.length})
                </span>
              </div>
              <div className="max-h-[180px] overflow-y-auto space-y-1.5">
                {onlineHackathons.slice(0, 5).map((h) => (
                  <OnlineHackathonRow key={h.id} hackathon={h} />
                ))}
                {onlineHackathons.length > 5 && (
                  <p className="text-[10px] text-muted-foreground/60">
                    +{onlineHackathons.length - 5} more online
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Hackathons Results overlay panel - bottom-right */}
        {mapHackathons.length > 0 && (
          <div className="absolute bottom-4 right-4 z-10 w-[240px] sm:w-[280px]">
            <div className="glass bg-card/80 backdrop-blur-md border border-border/40 p-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={12} className="text-brand-green" />
                <h3 className="font-pixel text-[10px] text-brand-green tracking-wider">
                  EN EL MAPA
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  (
                  {
                    (activeFilter
                      ? activeFilter.hackathons.filter((h) =>
                          Number.isFinite(h.latitude)
                        )
                      : mapHackathons
                    ).length
                  }
                  )
                </span>
              </div>
              <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
                {(activeFilter
                  ? activeFilter.hackathons.filter((h) =>
                      Number.isFinite(h.latitude)
                    )
                  : mapHackathons
                ).map((h) => (
                  <MapResultRow
                    key={h.id}
                    hackathon={h}
                    onFlyTo={handleFlyTo}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HackathonPopupCard({
  hackathon: h,
}: {
  hackathon: MapHackathon & { latitude: number; longitude: number };
}) {
  const startDate = new Date(h.startDate);
  const endDate = new Date(h.endDate);

  return (
    <div className="min-w-[240px] max-w-[300px] space-y-2 bg-card p-3 border border-border/40">
      {/* Header row: status + location */}
      <div className="flex items-center gap-2">
        <StatusPill
          index={0}
          status={h.status as "LIVE" | "UPCOMING" | "ENDED"}
        />
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin size={8} />
          {h.location.split(",")[0]}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/hackathon/${h.slug}`}
        className="block text-sm font-medium text-foreground hover:text-brand-green transition-colors line-clamp-2"
      >
        {h.title}
      </Link>

      {/* Info row: dates + participants */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          {startDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
          {" – "}
          {endDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span className="flex items-center gap-1">
          <Users size={10} />
          {h.participantCount}
          {h.maxParticipants && (
            <span className="text-muted-foreground/50">
              /{h.maxParticipants}
            </span>
          )}
        </span>
      </div>

      {/* Top prize */}
      {h.topPrize && (
        <div className="flex items-center gap-1 text-[11px] text-brand-green">
          <Trophy size={10} />
          {h.topPrize}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {h.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] border border-brand-purple/30 px-1.5 py-0.5 text-brand-purple"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* View Details Link */}
      <Link
        href={`/hackathon/${h.slug}`}
        className="inline-flex items-center gap-1 text-[11px] text-brand-green hover:underline hover:decoration-brand-green hover:decoration-wavy transition-colors font-medium"
      >
        View Details
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function OnlineHackathonRow({ hackathon: h }: { hackathon: MapHackathon }) {
  const startDate = new Date(h.startDate);

  return (
    <Link href={`/hackathon/${h.slug}`} className="block group">
      <article className="flex items-center gap-2 p-1.5 hover:bg-accent/30 transition-colors">
        <span className="flex items-center gap-1 text-[9px] text-muted-foreground border border-border/30 px-1 py-0.5 shrink-0">
          <Wifi size={6} /> REMOTE
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-foreground group-hover:text-brand-green transition-colors truncate">
            {h.title}
          </p>
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Calendar size={6} />
              {startDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="flex items-center gap-0.5">
              <Users size={6} />
              {h.participantCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function MapResultRow({
  hackathon: h,
  onFlyTo,
}: {
  hackathon: MapHackathon;
  onFlyTo: (lng: number, lat: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (Number.isFinite(h.longitude) && Number.isFinite(h.latitude)) {
          onFlyTo(Number(h.longitude), Number(h.latitude));
        }
      }}
      className="w-full flex items-start gap-2 p-1.5 hover:bg-accent/30 transition-colors text-left group border border-transparent hover:border-border/30"
    >
      <div className="pt-0.5 shrink-0">
        <StatusPill
          index={0}
          status={h.status as "LIVE" | "UPCOMING" | "ENDED"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-foreground group-hover:text-brand-green transition-colors truncate">
          {h.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-0.5 truncate">
            {h.location.split(",")[0]}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-brand-green/80 flex items-center gap-0.5">
            Volver
          </span>
        </div>
      </div>
    </button>
  );
}
