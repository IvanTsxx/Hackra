"use client";

import {
  Calendar,
  ExternalLink,
  MapPin,
  Trophy,
  Users,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { MapHackathon } from "@/data/hackatons";
import { cn } from "@/shared/lib/utils";
import {
  Map as MapLibreMap,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/ui/map";
import type { MapRef } from "@/ui/map";

import { StatusPill } from "./tag-badge";

interface FeaturedHackathonsMapProps {
  hackathons: MapHackathon[];
  className?: string;
}

// Auto-fit bounds to show all markers
function FitBoundsOnLoad({ hackathons }: { hackathons: MapHackathon[] }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!isLoaded || !map) return;

    const validHackathons = hackathons.filter(
      (h) => Number.isFinite(h.latitude) && Number.isFinite(h.longitude)
    );

    if (validHackathons.length === 0) return;

    if (validHackathons.length === 1) {
      const [first] = validHackathons;
      map.setCenter([Number(first.longitude), Number(first.latitude)]);
      map.setZoom(6);
      return;
    }

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const h of validHackathons) {
      const lng = Number(h.longitude);
      const lat = Number(h.latitude);
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { maxZoom: 8, padding: 60 }
    );
  }, [isLoaded, map, hackathons]);

  return null;
}

// ─── Marker dot ───────────────────────────────────────────────────────────────

function HackathonMarkerDot({
  status,
  onClick,
}: {
  status: string;
  onClick: () => void;
}) {
  const isLive = status === "LIVE";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none"
    >
      {/* Ping animation for LIVE */}
      {isLive && (
        <span className="absolute size-6 animate-ping rounded-full bg-brand-green/30" />
      )}
      {/* Outer glow ring */}
      <span
        className={cn(
          "absolute rounded-full opacity-30",
          isLive ? "size-5 bg-brand-green" : "size-4 bg-amber-400"
        )}
      />
      {/* Core dot */}
      <span
        className={cn(
          "relative rounded-full border-2 border-white shadow-lg shadow-black/40",
          isLive ? "size-4 bg-brand-green" : "size-3.5 bg-amber-400"
        )}
      />
    </button>
  );
}

// ─── Tooltip content ──────────────────────────────────────────────────────────

function HackathonTooltipContent({ h }: { h: MapHackathon }) {
  const startDate = new Date(h.startDate);
  const endDate = new Date(h.endDate);

  return (
    <div className="min-w-[200px] max-w-[260px] space-y-2">
      {/* Status + location */}
      <div className="flex items-center gap-2">
        <StatusPill
          index={0}
          status={h.status as "LIVE" | "UPCOMING" | "ENDED"}
        />
        <span className="flex items-center gap-1 text-[10px] opacity-60">
          <MapPin className="size-2.5" />
          {h.location.split(",")[0]}
        </span>
      </div>

      {/* Title */}
      <p className="text-xs font-medium leading-snug line-clamp-2">{h.title}</p>

      {/* Dates + participants */}
      <div className="flex items-center gap-3 text-[10px] opacity-60">
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
            <span className="opacity-60">/{h.maxParticipants}</span>
          )}
        </span>
      </div>

      {/* Prize */}
      {h.topPrize && (
        <div className="flex items-center gap-1 text-[10px] text-brand-green">
          <Trophy className="size-2.5" />
          {h.topPrize.toLocaleString("en-US", {
            currency: "USD",
            maximumFractionDigits: 0,
            style: "currency",
          })}
        </div>
      )}

      {/* Link */}
      <Link
        href={`/hackathon/${h.slug}`}
        className="flex items-center gap-1 text-[10px] text-brand-green hover:underline font-medium"
      >
        View details
        <ExternalLink className="size-2.5" />
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FeaturedHackathonsMap({
  hackathons,
  className,
}: FeaturedHackathonsMapProps) {
  const mapRef = useRef<MapRef>(null);

  const [viewport, setViewport] = useState({
    bearing: 0,
    center: [0, 20] as [number, number],
    pitch: 0,
    zoom: 1,
  });

  // Only hackathons with valid coordinates
  const pinnedHackathons = useMemo(
    () =>
      hackathons.filter(
        (h): h is MapHackathon & { latitude: number; longitude: number } =>
          Number.isFinite(h.latitude) && Number.isFinite(h.longitude)
      ),
    [hackathons]
  );

  // Online-only hackathons
  const onlineHackathons = useMemo(
    () => hackathons.filter((h) => h.isOnline || h.locationMode === "remote"),
    [hackathons]
  );

  const handleMarkerClick = useCallback((lng: number, lat: number) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      duration: 1200,
      zoom: 6,
    });
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Map */}
      <div className="relative h-[380px] border border-border/40 overflow-hidden">
        <MapLibreMap
          ref={mapRef}
          viewport={viewport}
          onViewportChange={(v) => setViewport(v)}
          className="h-full w-full"
        >
          <FitBoundsOnLoad hackathons={pinnedHackathons} />
          <MapControls position="top-right" showZoom showCompass />

          {/* Individual markers */}
          {pinnedHackathons.map((h) => (
            <MapMarker key={h.id} longitude={h.longitude} latitude={h.latitude}>
              <MarkerContent>
                <HackathonMarkerDot
                  status={h.status}
                  onClick={() => handleMarkerClick(h.longitude, h.latitude)}
                />
              </MarkerContent>

              <MarkerTooltip>
                <HackathonTooltipContent h={h} />
              </MarkerTooltip>
            </MapMarker>
          ))}
        </MapLibreMap>
      </div>

      {/* Online hackathons list below map */}
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

// ─── Online-only card ─────────────────────────────────────────────────────────

function OnlineOnlyCard({ hackathon: h }: { hackathon: MapHackathon }) {
  const startDate = new Date(h.startDate);

  return (
    <Link href={`/hackathon/${h.slug}`} className="block group">
      <article className="glass bg-card/50 border border-border/40 p-3 hover:border-brand-purple/40 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center gap-1 text-[9px] border border-brand-purple/30 px-1.5 py-0.5 text-brand-purple">
            <Wifi size={6} /> ONLINE
          </span>
          <StatusPill
            index={0}
            status={h.status as "LIVE" | "UPCOMING" | "ENDED"}
          />
        </div>
        <p className="text-xs font-medium text-foreground group-hover:text-brand-green transition-colors truncate">
          {h.title}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
          <span className="flex items-center gap-0.5">
            <Calendar size={8} />
            {startDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span className="flex items-center gap-0.5">
            <Users size={8} />
            {h.participantCount}
          </span>
        </div>
      </article>
    </Link>
  );
}
