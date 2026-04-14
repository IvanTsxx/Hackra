"use server";

import { reverseGeocode } from "@/shared/lib/geocoding";

export function reverseGeocodeAction(latitude: number, longitude: number) {
  return reverseGeocode(latitude, longitude);
}
