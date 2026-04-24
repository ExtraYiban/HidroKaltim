import { RainfallDataClient, type RainfallRow } from "@/app/components/data/rainfall-data-client";
import { getWeatherSnapshot } from "@/lib/weather";

function resolveRainfallStatus(rainfall: number): RainfallRow["status"] {
  if (rainfall >= 10) return "Tinggi";
  if (rainfall >= 3) return "Sedang";
  if (rainfall > 0) return "Rendah";
  return "Kering";
}

export default async function CurahHujanPage() {
  const weather = await getWeatherSnapshot();
  const rows: RainfallRow[] = weather.points.slice(0, 24).map((point) => ({
    datetime: point.localDatetime,
    weather: point.weatherDesc,
    temperature: point.temperature,
    humidity: point.humidity,
    rainfall: point.rainfall,
    status: resolveRainfallStatus(point.rainfall),
  }));

  return <RainfallDataClient location={weather.location} rows={rows} />;
}
