export function getCurrentTime() {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    iso: now.toISOString(),
    timestamp: now.getTime(),
  };
}
