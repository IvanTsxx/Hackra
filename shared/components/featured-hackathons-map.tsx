"use client";

import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import type { MapHackathon } from "@/data/hackatons";
import { cn } from "@/shared/lib/utils";
import {
  Map as MapLibreMap,
  MapClusterLayer,
  MapControls,
  MapPopup,
} from "@/ui/map";

import { StatusPill } from "./tag-badge";

interface FeaturedHackathonsMapProps {
  hackathons: MapHackathon[];
  className?: string;
}

// Hex only — MapLibre GL doesn't support oklch
const CLUSTER_COLORS: [string, string, string] = [
  "#4ade80",
  "#8b5cf6",
  "#7c3aed",
];
const CLUSTER_THRESHOLDS: [number, number] = [5, 20];
const POINT_COLOR = "#4ade80";

interface HackathonProperties {
  id: string;
  slug: string;
  status: string;
  title: string;
}

export function FeaturedHackathonsMap({
  hackathons,
  className,
}: FeaturedHackathonsMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: HackathonProperties;
  } | null>(null);

  const [viewport, setViewport] = useState({
    bearing: 0,
    center: [0, 20] as [number, number],
    pitch: 0,
    zoom: 1,
  });

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

  // GeoJSON for cluster layer
  const geojson = useMemo(
    () => ({
      features: mapHackathons.map((h) => ({
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
        } as HackathonProperties,
        type: "Feature" as const,
      })),
      type: "FeatureCollection" as const,
    }),
    [mapHackathons]
  );

  // Lookup for full hackathon data
  const hackathonMap = useMemo(() => {
    const map = new Map<string, (typeof mapHackathons)[number]>();
    for (const h of mapHackathons) map.set(h.id, h);
    return map;
  }, [mapHackathons]);

  const handlePointClick = useCallback(
    (
      feature: GeoJSON.Feature<GeoJSON.Point, HackathonProperties>,
      coordinates: [number, number]
    ) => {
      setSelectedPoint({ coordinates, properties: feature.properties });
    },
    []
  );

  const selectedHackathon = selectedPoint
    ? (hackathonMap.get(selectedPoint.properties.id) ?? null)
    : null;

  return (
    <div className={cn("relative", className)}>
      <div className="relative h-[380px] border border-border/40 overflow-hidden">
        <MapLibreMap
          viewport={viewport}
          onViewportChange={(v) => setViewport(v)}
          className="h-full w-full"
        >
          <MapControls position="top-right" showZoom showCompass />

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
              <FeaturedPopupCard hackathon={selectedHackathon} />
            </MapPopup>
          )}
        </MapLibreMap>
      </div>

      {/* Online hackathons grid below map */}
      {onlineHackathons.length > 0 && (
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {onlineHackathons.slice(0, 3).map((h) => (
            <OnlineOnlyCard key={h.id} hackathon={h} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Popup card — misma info que explore-map ─────────────────────────────────

function FeaturedPopupCard({
  hackathon: h,
}: {
  hackathon: MapHackathon & { latitude: number; longitude: number };
}) {
  const startDate = new Date(h.startDate);
  const endDate = new Date(h.endDate);

  return (
    <div className="min-w-[240px] max-w-[300px] space-y-2 bg-card p-3 border border-border/40">
      {/* Status + location */}
      <div className="flex items-center gap-2">
        <StatusPill
          index={0}
          status={h.status as "LIVE" | "UPCOMING" | "ENDED"}
        />
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-2.5" />
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

      {/* Dates + participants */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="size-2.5" />
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
          <Users className="size-2.5" />
          {h.participantCount}
          {h.maxParticipants && (
            <span className="text-muted-foreground/50">
              /{h.maxParticipants}
            </span>
          )}
        </span>
      </div>

      {/* Prize */}
      {h.topPrize && (
        <div className="flex items-center gap-1 text-[11px] text-brand-green">
          <Trophy className="size-2.5" />
          {h.topPrize.toLocaleString("en-US", {
            currency: "USD",
            maximumFractionDigits: 0,
            style: "currency",
          })}
        </div>
      )}

      {/* Tags */}
      {h.tags.length > 0 && (
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
      )}

      {/* CTA */}
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

// ─── Online-only card ─────────────────────────────────────────────────────────

function OnlineOnlyCard({
  hackathon,
}: {
  hackathon: {
    id: string;
    slug: string;
    title: string;
    startDate: Date;
    endDate: Date;
    participantCount: number;
    tags: string[];
    status: string;
    location: string;
  };
}) {
  const startDate = new Date(hackathon.startDate);

  return (
    <Link href={`/hackathon/${hackathon.slug}`} className="block group">
      <article className="glass bg-card/50 border border-border/40 p-4 hover:border-brand-purple/40 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] border border-brand-purple/30 px-1.5 py-0.5 text-brand-purple">
            ONLINE
          </span>
          <span className="text-[9px] text-muted-foreground uppercase">
            {hackathon.status}
          </span>
        </div>
        <h3 className="text-sm font-medium text-foreground group-hover:text-brand-green transition-colors line-clamp-2 mb-2">
          {hackathon.title}
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>
            {startDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span>{hackathon.participantCount} participants</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[8px] border border-brand-purple/30 px-1 py-0.5 text-brand-purple"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
