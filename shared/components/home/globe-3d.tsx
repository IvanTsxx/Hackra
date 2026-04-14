"use client";

import { Calendar, ExternalLink, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import type { MapHackathon } from "@/data/hackatons";
import { cn } from "@/shared/lib/utils";
import type { MapRef } from "@/ui/map";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapPopup,
} from "@/ui/map";

interface HackathonGlobeProps {
  hackathons: MapHackathon[];
  className?: string;
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 rounded-full",
        status === "LIVE" ? "bg-green-400" : "bg-amber-400"
      )}
    />
  );
}

export function HackathonGlobe({ hackathons, className }: HackathonGlobeProps) {
  const mapRef = useRef<MapRef>(null);

  // Only hackathons with coordinates
  const pinned = hackathons.filter(
    (h): h is MapHackathon & { latitude: number; longitude: number } =>
      Number.isFinite(h.latitude) && Number.isFinite(h.longitude)
  );

  return (
    <div className={cn("relative h-[380px] overflow-hidden w-full", className)}>
      {/* Globe map */}

      <Map
        ref={mapRef}
        center={[10, 20]}
        zoom={0.8}
        projection={{ type: "globe" }}
        className="h-full w-full"
      >
        {pinned.map((h) => (
          <MapMarker key={h.id} longitude={h.longitude} latitude={h.latitude}>
            <MarkerContent>
              <button
                type="button"
                className="relative flex items-center justify-center focus:outline-none"
                onClick={() => {
                  mapRef.current?.flyTo({
                    center: [h.longitude, h.latitude],
                    duration: 1800,
                    zoom: 6,
                  });
                }}
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

            <MarkerTooltip>
              <div className="min-w-[180px] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <StatusDot status={h.status} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                    {h.status}
                  </span>
                </div>

                <p className="text-xs font-medium leading-snug line-clamp-2">
                  {h.title}
                </p>

                <div className="flex items-center gap-3 text-[10px] opacity-60">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-2.5" />
                    {new Date(h.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-2.5" />
                    {h.participantCount}
                  </span>
                  {h.topPrize && (
                    <span className="flex items-center gap-1 text-green-400">
                      <Trophy className="size-2.5" />
                      {h.topPrize.toLocaleString("en-US", {
                        currency: "USD",
                        maximumFractionDigits: 0,
                        style: "currency",
                      })}
                    </span>
                  )}
                </div>

                <Link
                  href={`/hackathon/${h.slug}`}
                  className="flex items-center gap-1 text-[10px] text-green-400 hover:underline"
                >
                  View details
                  <ExternalLink className="size-2.5" />
                </Link>
              </div>
            </MarkerTooltip>
            <MapPopup latitude={h.latitude} longitude={h.longitude}>
              <div className="min-w-[180px] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <StatusDot status={h.status} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                    {h.status}
                  </span>
                </div>

                <p className="text-xs font-medium leading-snug line-clamp-2">
                  {h.title}
                </p>

                <div className="flex items-center gap-3 text-[10px] opacity-60">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-2.5" />
                    {new Date(h.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-2.5" />
                    {h.participantCount}
                  </span>
                  {h.topPrize && (
                    <span className="flex items-center gap-1 text-green-400">
                      <Trophy className="size-2.5" />
                      {h.topPrize.toLocaleString("en-US", {
                        currency: "USD",
                        maximumFractionDigits: 0,
                        style: "currency",
                      })}
                    </span>
                  )}
                </div>

                <Link
                  href={`/hackathon/${h.slug}`}
                  className="flex items-center gap-1 text-[10px] text-green-400 hover:underline"
                >
                  View details
                  <ExternalLink className="size-2.5" />
                </Link>
              </div>
            </MapPopup>
          </MapMarker>
        ))}

        <MapControls position="top-right" showZoom />
      </Map>
    </div>
  );
}
