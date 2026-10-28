const BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

async function request(path, signal) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("network");
  }
  if (!res.ok) throw new Error(`http-${res.status}`);
  return res.json();
}

export function getCategories(signal) {
  return request("/categories/", signal);
}

export async function getMenuItems({ category, featured } = {}, signal) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (featured) params.set("featured", "true");
  const qs = params.toString();
  const data = await request(`/menu/${qs ? `?${qs}` : ""}`, signal);
  return data.results ?? data; // the API paginates; we want the list
}