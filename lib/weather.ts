import "server-only";

const BMKG_ENDPOINT = "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=64.72.03.1002";

export type WeatherPoint = {
  localDatetime: string;
  weatherCode: number;
  weatherDesc: string;
  temperature: number;
  humidity: number;
  rainfall: number;
};

export type WeatherSnapshot = {
  location: string;
  points: WeatherPoint[];
};

type BmkgItem = {
  local_datetime?: unknown;
  weather?: unknown;
  weather_desc?: unknown;
  t?: unknown;
  hu?: unknown;
  tp?: unknown;
};

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toString(value: unknown, fallback = "-"): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function fallbackSnapshot(): WeatherSnapshot {
  return {
    location: "Samarinda",
    points: [
      { localDatetime: "2026-04-24 00:00:00", weatherCode: 3, weatherDesc: "Berawan", temperature: 27, humidity: 86, rainfall: 0 },
      { localDatetime: "2026-04-24 03:00:00", weatherCode: 60, weatherDesc: "Hujan Ringan", temperature: 26, humidity: 90, rainfall: 2.4 },
      { localDatetime: "2026-04-24 06:00:00", weatherCode: 61, weatherDesc: "Hujan Ringan", temperature: 26, humidity: 92, rainfall: 3.1 },
      { localDatetime: "2026-04-24 09:00:00", weatherCode: 3, weatherDesc: "Berawan", temperature: 29, humidity: 82, rainfall: 0 },
      { localDatetime: "2026-04-24 12:00:00", weatherCode: 0, weatherDesc: "Cerah", temperature: 31, humidity: 71, rainfall: 0 },
      { localDatetime: "2026-04-24 15:00:00", weatherCode: 60, weatherDesc: "Hujan Ringan", temperature: 29, humidity: 80, rainfall: 1.8 },
      { localDatetime: "2026-04-24 18:00:00", weatherCode: 63, weatherDesc: "Hujan Sedang", temperature: 27, humidity: 88, rainfall: 5.5 },
      { localDatetime: "2026-04-24 21:00:00", weatherCode: 3, weatherDesc: "Berawan", temperature: 26, humidity: 89, rainfall: 0 },
    ],
  };
}

function normalizePayload(payload: unknown): WeatherSnapshot | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as { data?: unknown };
  if (!Array.isArray(root.data) || root.data.length === 0) {
    return null;
  }

  const firstLocation = root.data[0] as { lokasi?: { desa?: unknown; kecamatan?: unknown }; cuaca?: unknown };
  const rawCuaca = Array.isArray(firstLocation.cuaca) ? firstLocation.cuaca : [];
  const points: WeatherPoint[] = rawCuaca
    .flatMap((bucket) => (Array.isArray(bucket) ? bucket : []))
    .map((item) => {
      const row = item as BmkgItem;
      return {
        localDatetime: toString(row.local_datetime, ""),
        weatherCode: toNumber(row.weather),
        weatherDesc: toString(row.weather_desc, "Berawan"),
        temperature: toNumber(row.t),
        humidity: toNumber(row.hu),
        rainfall: Math.max(0, toNumber(row.tp)),
      };
    })
    .filter((item) => item.localDatetime !== "");

  if (points.length === 0) {
    return null;
  }

  const location = toString(firstLocation.lokasi?.desa, toString(firstLocation.lokasi?.kecamatan, "Samarinda"));

  return { location, points };
}

export async function getWeatherSnapshot(): Promise<WeatherSnapshot> {
  try {
    const response = await fetch(BMKG_ENDPOINT, {
      next: { revalidate: 60 * 60 * 3 },
    });

    if (!response.ok) {
      return fallbackSnapshot();
    }

    const payload = (await response.json()) as unknown;
    return normalizePayload(payload) ?? fallbackSnapshot();
  } catch {
    return fallbackSnapshot();
  }
}
