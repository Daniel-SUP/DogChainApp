import { BREST_LOCATIONS } from '../data/mockData.js';

/**
 * Reverse geocoding via Nominatim: (lat, lon) -> Text address
 */
export async function reverseGeocode(lat, lon) {
  // Check if near any predefined location first
  for (const loc of BREST_LOCATIONS) {
    if (Array.isArray(loc.coords)) {
      const dLat = Math.abs(loc.coords[0] - lat);
      const dLng = Math.abs(loc.coords[1] - lon);
      if (dLat < 0.0015 && dLng < 0.0015) {
        return loc.name;
      }
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ru`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'ru',
      },
    });

    if (!res.ok) throw new Error('Nominatim reverse error');

    const data = await res.json();
    const addr = data.address || {};

    const street = addr.road || addr.pedestrian || addr.street || addr.neighbourhood;
    const house = addr.house_number;
    const district = addr.suburb || addr.city_district;

    if (street && house) {
      return `${street}, ${house}`;
    }
    if (street) {
      return street;
    }
    if (data.name) {
      return data.name;
    }
    if (district) {
      return `Брест, ${district}`;
    }

    if (data.display_name) {
      // Shorten display name to first 2 parts
      const parts = data.display_name.split(',');
      return parts.slice(0, 2).join(',').trim();
    }

    return `Брест [${lat.toFixed(4)}, ${lon.toFixed(4)}]`;
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return `Брест [${lat.toFixed(4)}, ${lon.toFixed(4)}]`;
  }
}

/**
 * Forward geocoding: Text address -> [lat, lon]
 */
export async function forwardGeocode(query) {
  if (!query || typeof query !== 'string') return null;

  // 1. Fast lookup in predefined Brest locations
  const lowerQuery = query.toLowerCase();
  for (const loc of BREST_LOCATIONS) {
    if (
      lowerQuery.includes(loc.name.toLowerCase()) ||
      lowerQuery.includes(loc.address.toLowerCase()) ||
      loc.address.toLowerCase().includes(lowerQuery)
    ) {
      return loc.coords;
    }
  }

  // Known street coordinates shortcuts in Brest
  if (lowerQuery.includes('советск')) return [52.0975, 23.6877];
  if (lowerQuery.includes('московск')) return [52.1009, 23.7431];
  if (lowerQuery.includes('машер')) return [52.0886, 23.7042];
  if (lowerQuery.includes('гогол')) return [52.0912, 23.6991];
  if (lowerQuery.includes('ленин')) return [52.0945, 23.6789];
  if (lowerQuery.includes('варшавск')) return [52.0768, 23.7082];
  if (lowerQuery.includes('крепост')) return [52.0833, 23.6552];

  // 2. Fetch from Nominatim API
  try {
    const cleanQuery = query.includes('Брест') ? query : `${query}, Брест, Беларусь`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cleanQuery
    )}&countrycodes=by&limit=1&accept-language=ru`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'ru',
      },
    });

    if (!res.ok) throw new Error('Nominatim search error');

    const list = await res.json();
    if (list && list.length > 0) {
      return [parseFloat(list[0].lat), parseFloat(list[0].lon)];
    }
  } catch (err) {
    console.warn('Forward geocoding error:', err);
  }

  return null;
}
