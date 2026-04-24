import { KualitasAirDataClient, type WaterQualityRow } from "@/app/components/data/kualitas-air-data-client";

const rows: WaterQualityRow[] = [
  { station: "Mahakam Hulu", datetime: "2026-04-24 08:00", ph: 7.2, do: 6.4, quality: "Baik" },
  { station: "Mahakam Tengah", datetime: "2026-04-24 08:00", ph: 6.9, do: 5.7, quality: "Sedang" },
  { station: "Mahakam Hilir", datetime: "2026-04-24 08:00", ph: 6.5, do: 4.9, quality: "Buruk" },
  { station: "Karang Mumus", datetime: "2026-04-24 08:00", ph: 7.1, do: 5.8, quality: "Sedang" },
  { station: "Sungai Pinang", datetime: "2026-04-24 08:00", ph: 7.4, do: 6.2, quality: "Baik" },
];

export default function KualitasAirPage() {
  return <KualitasAirDataClient rows={rows} />;
}
