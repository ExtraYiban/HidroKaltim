"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/app/components/data/apex-chart";

export type RiverStationRow = {
  station: string;
  datetime: string;
  waterLevel: number;
  debit: number;
  status: "Normal" | "Waspada" | "Siaga";
};

type TmaDebitDataClientProps = {
  rows: RiverStationRow[];
};

function statusBadgeClass(status: RiverStationRow["status"]) {
  if (status === "Siaga") return "bg-red-100 text-red-700";
  if (status === "Waspada") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function TmaDebitDataClient({ rows }: TmaDebitDataClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Semua" | RiverStationRow["status"]>("Semua");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        row.station.toLowerCase().includes(query.toLowerCase()) ||
        row.datetime.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "Semua" ? true : row.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, filter]);

  const groupedByStation = useMemo(() => {
    return filteredRows.reduce<Record<string, number[]>>((acc, row) => {
      if (!acc[row.station]) acc[row.station] = [];
      acc[row.station].push(row.waterLevel);
      return acc;
    }, {});
  }, [filteredRows]);

  const categories = filteredRows.map((row) => row.datetime.slice(11, 16));
  const chartSeries = Object.entries(groupedByStation).map(([name, data]) => ({ name, data }));

  const desktopChartOptions: ApexOptions = {
    chart: { toolbar: { show: true } },
    legend: { show: true, position: "top" },
    xaxis: { categories },
    yaxis: { title: { text: "TMA (m)" } },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
  };

  const mobileChartOptions: ApexOptions = {
    chart: { toolbar: { show: false } },
    legend: { show: true, fontSize: "11px" },
    xaxis: { categories, labels: { style: { fontSize: "10px" } } },
    yaxis: { labels: { style: { fontSize: "10px" } } },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">TMA & Debit</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 md:text-3xl">Data Tinggi Muka Air dan Debit Sungai</h1>

        <div className="mt-4 hidden items-center gap-3 md:flex md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari stasiun atau waktu..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as "Semua" | RiverStationRow["status"])}
            className="w-56 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Normal">Normal</option>
            <option value="Waspada">Waspada</option>
            <option value="Siaga">Siaga</option>
          </select>
        </div>

        <div className="mt-4 md:hidden">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari data..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700"
          >
            Filter ⚙️
          </button>
          {mobileFilterOpen ? (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as "Semua" | RiverStationRow["status"])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="Semua">Semua Status</option>
                <option value="Normal">Normal</option>
                <option value="Waspada">Waspada</option>
                <option value="Siaga">Siaga</option>
              </select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-base font-bold text-slate-900 md:text-xl">Grafik Tinggi Muka Air</h2>
        <div className="mt-4 hidden md:block">
          <ApexChart type="line" options={desktopChartOptions} series={chartSeries} height={350} />
        </div>
        <div className="mt-4 overflow-x-auto hide-scrollbar md:hidden">
          <div className="min-w-[640px]">
            <ApexChart type="line" options={mobileChartOptions} series={chartSeries} height={250} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Stasiun</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Waktu</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">TMA</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Debit</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={`${row.station}-${row.datetime}-${index}`} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.station}</td>
                  <td className="px-4 py-3 text-slate-700">{row.datetime}</td>
                  <td className="px-4 py-3 text-slate-700">{row.waterLevel.toFixed(2)} m</td>
                  <td className="px-4 py-3 text-slate-700">{row.debit.toFixed(2)} m³/s</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col space-y-3 p-3 md:hidden">
          {filteredRows.map((row, index) => (
            <article key={`${row.station}-${row.datetime}-${index}`} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{row.station}</p>
                  <p className="text-xs text-slate-500">{row.datetime}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>{row.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">TMA / Debit</span>
                <span className="font-semibold text-slate-900">{row.waterLevel.toFixed(2)} m • {row.debit.toFixed(1)} m³/s</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
