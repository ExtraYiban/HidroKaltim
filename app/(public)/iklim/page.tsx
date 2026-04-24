import { IklimDataClient, type ClimateRow } from "@/app/components/data/iklim-data-client";
import { getWeatherSnapshot } from "@/lib/weather";

function resolveComfort(temperature: number, humidity: number): ClimateRow["comfort"] {
  if (temperature >= 31) return "Panas";
  if (humidity >= 88) return "Lembap";
  return "Nyaman";
}

export default async function IklimPage() {
  const weather = await getWeatherSnapshot();
  const rows: ClimateRow[] = weather.points.slice(0, 24).map((point) => ({
    datetime: point.localDatetime,
    temperature: point.temperature,
    humidity: point.humidity,
    condition: point.weatherDesc,
    comfort: resolveComfort(point.temperature, point.humidity),
  }));

  return <IklimDataClient rows={rows} />;
}
