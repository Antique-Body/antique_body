export async function fetchGeoapifySuggestions(query) {
  const apiKey = "62e47dea71ab4937a281bd284e831445"; // zamijeni sa svojim ključem
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    query
  )}&limit=5&lang=en&apiKey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.features || !Array.isArray(data.features)) {
    return [];
  }
  return data.features.map((feature) => {
    console.log("Geoapify feature:", feature.properties);
    return {
      value: feature.properties.city || feature.properties.name,
      label: feature.properties.formatted,
      city: feature.properties.city || feature.properties.name,
      state: feature.properties.state,
      country: feature.properties.country,
      country_code: feature.properties.country_code,
      postalCode: feature.properties.postcode,
      raw: feature.properties,
    };
  });
}
