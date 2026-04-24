"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/app/components/data/apex-chart";

export type ClimateRow = {
  datetime: string;
  temperature: number;
  humidity: number;
  condition: string;
  comfort: "Nyaman" | "Lembap" | "Panas";
};

type IklimDataClientProps = {
  rows: ClimateRow[];
};

function comfortBadgeClass(comfort: ClimateRow["comfort"]) {
  if (comfort === "Panas") return "bg-red-100 text-red-700";
  if (comfort === "Lembap") return "bg-blue-100 text-blue-700";
  return "bg-emerald-100 text-emerald-700";
}

export function IklimDataClient({ rows }: IklimDataClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Semua" | ClimateRow["comfort"]>("Semua");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        row.condition.toLowerCase().includes(query.toLowerCase()) ||
        row.datetime.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "Semua" ? true : row.comfort === filter;
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, filter]);

  const categories = filteredRows.map((row) => row.datetime.slice(11, 16));
  const chartSeries = [
    { name: "Suhu (°C)", data: filteredRows.map((row) => row.temperature) },
    { name: "Kelembaban (%)", data: filteredRows.map((row) => row.humidity) },
  ];

  const desktopChartOptions: ApexOptions = {
    chart: { toolbar: { show: true } },
    legend: { show: true, position: "top" },
    xaxis: { categories },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    yaxis: [{ title: { text: "Suhu (°C)" } }, { opposite: true, title: { text: "Kelembaban (%)" } }],
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Iklim</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 md:text-3xl">Data Iklim Samarinda</h1>

        <div className="mt-4 hidden items-center gap-3 md:flex md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari kondisi atau waktu..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as "Semua" | ClimateRow["comfort"])}
            className="w-56 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
          >
            <option value="Semua">Semua Kondisi</option>
            <option value="Nyaman">Nyaman</option>
            <option value="Lembap">Lembap</option>
            <option value="Panas">Panas</option>
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
                onChange={(event) => setFilter(event.target.value as "Semua" | ClimateRow["comfort"])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="Semua">Semua Kondisi</option>
                <option value="Nyaman">Nyaman</option>
                <option value="Lembap">Lembap</option>
                <option value="Panas">Panas</option>
              </select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-base font-bold text-slate-900 md:text-xl">Grafik Suhu & Kelembaban</h2>
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Waktu</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Kondisi</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Suhu</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Kelembaban</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Kenyamanan</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.datetime} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{row.datetime}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.condition}</td>
                  <td className="px-4 py-3 text-slate-700">{row.temperature}°C</td>
                  <td className="px-4 py-3 text-slate-700">{row.humidity}%</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${comfortBadgeClass(row.comfort)}`}>{row.comfort}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col space-y-3 p-3 md:hidden">
          {filteredRows.map((row) => (
            <article key={row.datetime} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{row.condition}</p>
                  <p className="text-xs text-slate-500">{row.datetime}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${comfortBadgeClass(row.comfort)}`}>{row.comfort}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Suhu / RH</span>
                <span className="font-semibold text-slate-900">{row.temperature}°C • {row.humidity}%</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
