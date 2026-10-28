const BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, data) {
    super(`http-${status}`);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { signal, method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error("network");
  }

  if (!res.ok) {
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(res.status, data);
  }
  return res.json();
}

const list = (data) => data.results ?? data;

export function getCategories(signal) {
  return request("/categories/", { signal });
}

export async function getMenuItems({ category, featured } = {}, signal) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (featured) params.set("featured", "true");
  const qs = params.toString();
  return list(await request(`/menu/${qs ? `?${qs}` : ""}`, { signal }));
}

export function getBookingInfo(signal) {
  return request("/booking-info/", { signal });
}

export function createReservation(payload) {
  return request("/reservations/", { method: "POST", body: payload });
}

export async function getChefs(signal) {
  return list(await request("/chefs/", { signal }));
}

export async function getGallery({ category } = {}, signal) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  return list(await request(`/gallery/${qs}`, { signal }));
}

export async function getTestimonials(signal) {
  return list(await request("/testimonials/", { signal }));
}

export function sendContact(payload) {
  return request("/contact/", { method: "POST", body: payload });
}

export function subscribeNewsletter(email) {
  return request("/newsletter/", { method: "POST", body: { email } });
}