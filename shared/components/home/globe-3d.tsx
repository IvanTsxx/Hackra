"use client";

import { Calendar, ExternalLink, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

import type { MapHackathon } from "@/data/hackatons";
import { cn } from "@/shared/lib/utils";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/ui/map";
import type { MapRef } from "@/ui/map";

import { StatusPill } from "../tag-badge";

interface HackathonGlobeProps {
  hackathons: MapHackathon[];
  className?: string;
}

export function HackathonGlobe({ hackathons, className }: HackathonGlobeProps) {
  const mapRef = useRef<MapRef>(null);

  // Only hackathons with valid coordinates
  const pinned = useMemo(
    () =>
      hackathons.filter(
        (h): h is MapHackathon & { latitude: number; longitude: number } =>
          Number.isFinite(h.latitude) && Number.isFinite(h.longitude)
      ),
    [hackathons]
  );

  const handleMarkerClick = useCallback((lng: number, lat: number) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      duration: 1800,
      zoom: 6,
    });
  }, []);

  return (
    <div className={cn("relative h-[380px] overflow-hidden w-full", className)}>
      <Map
        minZoom={1}
        ref={mapRef}
        center={[10, 20]}
        zoom={0.8}
        projection={{ type: "globe" }}
        className="h-full w-full"
      >
        {pinned.map((h) => (
          <MapMarker
            key={h.id}
            longitude={h.longitude}
            latitude={h.latitude}
            occlude={true}
          >
            <MarkerContent>
              <button
                type="button"
                className="relative flex items-center justify-center focus:outline-none"
                onClick={() => handleMarkerClick(h.longitude, h.latitude)}
              >
                {h.status === "LIVE" && (
                  <span className="absolute size-6 animate-ping rounded-full bg-green-500/30" />
                )}
                <span
                  className={cn(
                    "size-4 rounded-full border-2 border-white shadow-lg",
                    h.status === "LIVE" ? "bg-green-400" : "bg-amber-400"
                  )}
                />
              </button>
            </MarkerContent>

            {/* Tooltip on hover */}
            <MarkerTooltip>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-block size-1.5 rounded-full",
                    h.status === "LIVE" ? "bg-green-400" : "bg-amber-400"
                  )}
                />
                <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                  {h.status}
                </span>
                <span className="text-[10px] opacity-60">—</span>
                <span className="text-[10px] font-medium max-w-[160px] truncate">
                  {h.title}
                </span>
              </div>
            </MarkerTooltip>

            {/* Popup on click — uses marker.setPopup() internally */}
            <MarkerPopup closeButton>
              <GlobePopupCard hackathon={h} />
            </MarkerPopup>
          </MapMarker>
        ))}

        <MapControls position="top-right" showZoom />
      </Map>
    </div>
  );
}

// ─── Popup card — same info as explore-map HackathonPopupCard ────────────────

function GlobePopupCard({
  hackathon: h,
}: {
  hackathon: MapHackathon & { latitude: number; longitude: number };
}) {
  const startDate = new Date(h.startDate);
  const endDate = new Date(h.endDate);

  return (
    <div className="min-w-[240px] max-w-[300px] space-y-2 bg-card p-3 ">
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
        <ExternalLink className="size-2.5" />
      </Link>
    </div>
  );
}
