export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");
  const types = searchParams.get("types");
  const location = searchParams.get("location");
  const radius = searchParams.get("radius");
  const keyword = searchParams.get("keyword");
  const placeType = searchParams.get("placeType");
  const placeId = searchParams.get("placeId");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  let url = "";

  if (input && types) {
    // Autocomplete (city, state, country)
    url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=${encodeURIComponent(types)}&key=${apiKey}`;
  } else if (location && radius && (keyword || placeType)) {
    // Nearby search for gyms
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(
      location
    )}&radius=${encodeURIComponent(radius)}&key=${apiKey}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (placeType) url += `&type=${encodeURIComponent(placeType)}`;
  } else if (placeId) {
    // Place details (for geocoding)
    url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&key=${apiKey}`;
  } else {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 }
    );
  }

  try {
    const googleRes = await fetch(url);
    const text = await googleRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON from Google", raw: text }),
        { status: 500 }
      );
    }
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch from Google Places API",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
