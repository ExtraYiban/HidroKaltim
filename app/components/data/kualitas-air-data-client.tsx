"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/app/components/data/apex-chart";

export type WaterQualityRow = {
  station: string;
  datetime: string;
  ph: number;
  do: number;
  quality: "Baik" | "Sedang" | "Buruk";
};

type KualitasAirDataClientProps = {
  rows: WaterQualityRow[];
};

function qualityBadgeClass(quality: WaterQualityRow["quality"]) {
  if (quality === "Buruk") return "bg-red-100 text-red-700";
  if (quality === "Sedang") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function KualitasAirDataClient({ rows }: KualitasAirDataClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Semua" | WaterQualityRow["quality"]>("Semua");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        row.station.toLowerCase().includes(query.toLowerCase()) ||
        row.datetime.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "Semua" ? true : row.quality === filter;
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, filter]);

  const categories = filteredRows.map((row) => row.station);
  const chartSeries = [
    { name: "pH", data: filteredRows.map((row) => row.ph) },
    { name: "DO (mg/L)", data: filteredRows.map((row) => row.do) },
  ];

  const desktopChartOptions: ApexOptions = {
    chart: { toolbar: { show: true } },
    legend: { show: true, position: "top" },
    xaxis: { categories },
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Kualitas Air</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 md:text-3xl">Monitoring Kualitas Air Sungai</h1>

        <div className="mt-4 hidden items-center gap-3 md:flex md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari stasiun atau waktu..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as "Semua" | WaterQualityRow["quality"])}
            className="w-56 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
          >
            <option value="Semua">Semua Kualitas</option>
            <option value="Baik">Baik</option>
            <option value="Sedang">Sedang</option>
            <option value="Buruk">Buruk</option>
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
                onChange={(event) => setFilter(event.target.value as "Semua" | WaterQualityRow["quality"])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="Semua">Semua Kualitas</option>
                <option value="Baik">Baik</option>
                <option value="Sedang">Sedang</option>
                <option value="Buruk">Buruk</option>
              </select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-base font-bold text-slate-900 md:text-xl">Grafik Parameter pH & DO</h2>
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600">pH</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">DO</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Kualitas</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={`${row.station}-${row.datetime}-${index}`} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.station}</td>
                  <td className="px-4 py-3 text-slate-700">{row.datetime}</td>
                  <td className="px-4 py-3 text-slate-700">{row.ph.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-700">{row.do.toFixed(2)} mg/L</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${qualityBadgeClass(row.quality)}`}>{row.quality}</span>
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
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${qualityBadgeClass(row.quality)}`}>{row.quality}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">pH / DO</span>
                <span className="font-semibold text-slate-900">{row.ph.toFixed(1)} • {row.do.toFixed(1)} mg/L</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
