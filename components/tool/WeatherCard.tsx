import { CloudSun } from "lucide-react";

type WeatherCardProps = {
  output: unknown;
};

export default function WeatherCard({ output }: WeatherCardProps) {
  const weather = output as {
    city?: string;
    temperature?: number | null;
    description?: string;
  };

  return (
    <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sky-950">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <CloudSun className="h-4 w-4" />
        {weather.city ?? "Weather"}
      </div>
      <div className="mt-2 text-2xl font-semibold">
        {weather.temperature === null || weather.temperature === undefined
          ? "--"
          : `${Math.round(weather.temperature)}°C`}
      </div>
      <p className="text-sm capitalize text-sky-800">
        {weather.description ?? "No weather details available."}
      </p>
    </div>
  );
}
