"use server";

import { reverseGeocode } from "@/shared/lib/geocoding";

// oxlint-disable-next-line require-await
export async function reverseGeocodeAction(
  latitude: number,
  longitude: number
) {
  return reverseGeocode(latitude, longitude);
}
