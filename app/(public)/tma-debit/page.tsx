import { TmaDebitDataClient, type RiverStationRow } from "@/app/components/data/tma-debit-data-client";

const rows: RiverStationRow[] = [
  { station: "Karang Mumus", datetime: "2026-04-24 06:00", waterLevel: 2.3, debit: 102.2, status: "Waspada" },
  { station: "Karang Mumus", datetime: "2026-04-24 12:00", waterLevel: 2.5, debit: 109.8, status: "Waspada" },
  { station: "Karang Mumus", datetime: "2026-04-24 18:00", waterLevel: 2.8, debit: 120.4, status: "Siaga" },
  { station: "Sungai Mahakam", datetime: "2026-04-24 06:00", waterLevel: 1.6, debit: 88.1, status: "Normal" },
  { station: "Sungai Mahakam", datetime: "2026-04-24 12:00", waterLevel: 1.9, debit: 94.3, status: "Normal" },
  { station: "Sungai Mahakam", datetime: "2026-04-24 18:00", waterLevel: 2.2, debit: 101.9, status: "Waspada" },
  { station: "Loa Janan", datetime: "2026-04-24 06:00", waterLevel: 1.3, debit: 70.5, status: "Normal" },
  { station: "Loa Janan", datetime: "2026-04-24 12:00", waterLevel: 1.7, debit: 79.8, status: "Normal" },
  { station: "Loa Janan", datetime: "2026-04-24 18:00", waterLevel: 2.1, debit: 90.4, status: "Waspada" },
];

export default function TmaDebitPage() {
  return <TmaDebitDataClient rows={rows} />;
}
