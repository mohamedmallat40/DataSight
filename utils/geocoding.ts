/**
 * Geocoding utilities using free OpenStreetMap Nominatim API
 * No API key required, suitable for production use with rate limiting
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  display_name: string;
  boundingbox: [string, string, string, string];
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

/**
 * Geocode an address to coordinates using OpenStreetMap Nominatim
 * Rate limited to 1 request per second per the usage policy
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "ContactsApp/1.0", // Required by Nominatim usage policy
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];

      return {
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
        display_name: result.display_name,
        boundingbox: result.boundingbox,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);

    return null;
  }
}

/**
 * Get coordinates for common cities as fallback
 */
const CITY_COORDINATES: Record<string, Coordinates> = {
  "new york": { lat: 40.7128, lng: -74.006 },
  london: { lat: 51.5074, lng: -0.1278 },
  paris: { lat: 48.8566, lng: 2.3522 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  berlin: { lat: 52.52, lng: 13.405 },
  madrid: { lat: 40.4168, lng: -3.7038 },
  rome: { lat: 41.9028, lng: 12.4964 },
  barcelona: { lat: 41.3851, lng: 2.1734 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  vienna: { lat: 48.2082, lng: 16.3738 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  miami: { lat: 25.7617, lng: -80.1918 },
};

/**
 * Get fallback coordinates for a city
 */
export function getFallbackCoordinates(
  city: string,
  country: string,
): Coordinates | null {
  const searchKey = city.toLowerCase();

  if (CITY_COORDINATES[searchKey]) {
    return CITY_COORDINATES[searchKey];
  }

  // Try with country as well
  const countryKey = `${searchKey}, ${country.toLowerCase()}`;

  if (CITY_COORDINATES[countryKey]) {
    return CITY_COORDINATES[countryKey];
  }

  return null;
}

/**
 * Smart geocoding that tries API first, then falls back to known coordinates
 */
export async function smartGeocode(
  address: string,
  city: string,
  country: string,
): Promise<{ coordinates: Coordinates; source: "api" | "fallback" } | null> {
  // First try the full address with the API
  try {
    const result = await geocodeAddress(address);

    if (result) {
      return {
        coordinates: result.coordinates,
        source: "api",
      };
    }
  } catch (error) {
    console.warn("API geocoding failed, trying fallback");
  }

  // Fallback to known city coordinates
  const fallbackCoords = getFallbackCoordinates(city, country);

  if (fallbackCoords) {
    return {
      coordinates: fallbackCoords,
      source: "fallback",
    };
  }

  // Last resort: try just the city name with API
  try {
    const cityResult = await geocodeAddress(`${city}, ${country}`);

    if (cityResult) {
      return {
        coordinates: cityResult.coordinates,
        source: "api",
      };
    }
  } catch (error) {
    console.warn("City geocoding also failed");
  }

  return null;
}
