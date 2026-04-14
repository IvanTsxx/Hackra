// oxlint-disable require-await
"use server";

import {
  geocodeLocation,
  geocodeSuggest,
  reverseGeocode,
} from "@/shared/lib/geocoding";

// oxlint-disable-next-line require-await
export async function reverseGeocodeAction(
  latitude: number,
  longitude: number
) {
  return reverseGeocode(latitude, longitude);
}

export async function geocodeAction(location: string) {
  return geocodeLocation(location);
}

export async function geocodeSuggestAction(query: string) {
  return geocodeSuggest(query);
}
