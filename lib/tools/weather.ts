export async function getWeather(city: string) {
  if (!process.env.OPENWEATHER_API_KEY) {
    return {
      city,
      temperature: null,
      description: "Weather API key is not configured.",
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
  );

  if (!res.ok) {
    return {
      city,
      temperature: null,
      description: "Weather information could not be loaded.",
    };
  }

  const data = await res.json();

  return {
    city: data.name ?? city,
    temperature: data.main?.temp ?? null,
    description: data.weather?.[0]?.description ?? "No description available.",
  };
}
