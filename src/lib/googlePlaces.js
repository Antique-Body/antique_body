// Universal util for Google Places/Geocoding via Next.js proxy

// Search cities (autocomplete)
export async function searchCities(query) {
  if (!query || query.length < 2) return [];
  const url = `/api/google-places-proxy?input=${encodeURIComponent(
    query
  )}&types=(cities)`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.predictions) return [];
  return data.predictions.map((p) => ({
    value: p.description,
    label: p.description,
    place_id: p.place_id,
  }));
}

// Search states/regions (autocomplete)
export async function searchStates(query) {
  if (!query || query.length < 2) return [];
  const url = `/api/google-places-proxy?input=${encodeURIComponent(
    query
  )}&types=(regions)`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.predictions) return [];
  const seen = new Set();
  return data.predictions
    .map((p) => p.structured_formatting.secondary_text)
    .filter((s) => s && !seen.has(s) && seen.add(s))
    .map((s) => ({ value: s, label: s }));
}

// Search countries (autocomplete)
export async function searchCountries(query) {
  if (!query || query.length < 2) return [];
  const url = `/api/google-places-proxy?input=${encodeURIComponent(
    query
  )}&types=(regions)`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.predictions) return [];
  const seen = new Set();
  return data.predictions
    .map((p) => {
      const parts = p.description.split(", ");
      return parts[parts.length - 1];
    })
    .filter((c) => c && !seen.has(c) && seen.add(c))
    .map((c) => ({ value: c, label: c }));
}

// Search gyms (Nearby Search)
export async function searchGyms(query, lat, lon) {
  if (!lat || !lon || !query) return [];
  const url = `/api/google-places-proxy?location=${lat},${lon}&radius=8000&keyword=${encodeURIComponent(
    query
  )}&placeType=gym`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((place) => ({
    value: place.place_id,
    label: place.name,
    address: place.vicinity,
    lat: place.geometry.location.lat,
    lon: place.geometry.location.lng,
    raw: place,
  }));
}

// Geocode place_id (get lat/lon for a place)
export async function geocodePlaceId(placeId) {
  if (!placeId) return null;
  const url = `/api/google-places-proxy?placeId=${encodeURIComponent(placeId)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.result || !data.result.geometry) return null;
  return {
    lat: data.result.geometry.location.lat,
    lon: data.result.geometry.location.lng,
    address: data.result.formatted_address,
    raw: data.result,
  };
}
