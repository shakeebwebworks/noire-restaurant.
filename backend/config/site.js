const env = import.meta.env;

// One place for restaurant details. Everything marked "demo" must be
// replaced with the owner's real information.
export const site = {
  name: "NOIRÉ",
  tagline: "Luxury contemporary dining with a cinematic atmosphere.",
  address: "00 Sample Street, Your City (demo address)",
  phone: "+00 000 000 0000 (demo)",
  email: "hello@example.com",
  hours: [
    { days: "Tuesday to Thursday", time: "6:00 PM to 10:30 PM" },
    { days: "Friday and Saturday", time: "6:00 PM to 11:30 PM" },
    { days: "Sunday", time: "1:00 PM to 9:00 PM" },
    { days: "Monday", time: "Closed" },
  ],
  social: [
    { label: "Instagram", url: env.VITE_INSTAGRAM_URL },
    { label: "Facebook", url: env.VITE_FACEBOOK_URL },
  ].filter((s) => s.url),
};