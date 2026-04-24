"use client";

import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/app/components/data/apex-chart";

export type RainfallRow = {
  datetime: string;
  weather: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  status: "Tinggi" | "Sedang" | "Rendah" | "Kering";
};

type RainfallDataClientProps = {
  location: string;
  rows: RainfallRow[];
};

function statusBadgeClass(status: RainfallRow["status"]) {
  if (status === "Tinggi") return "bg-red-100 text-red-700";
  if (status === "Sedang") return "bg-amber-100 text-amber-700";
  if (status === "Rendah") return "bg-cyan-100 text-cyan-700";
  return "bg-slate-100 text-slate-600";
}

export function RainfallDataClient({ location, rows }: RainfallDataClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Semua" | RainfallRow["status"]>("Semua");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        row.weather.toLowerCase().includes(query.toLowerCase()) ||
        row.datetime.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "Semua" ? true : row.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [rows, query, filter]);

  const chartCategories = filteredRows.map((row) => row.datetime.slice(11, 16));
  const chartSeries = [
    {
      name: "Curah Hujan (mm)",
      data: filteredRows.map((row) => Number(row.rainfall.toFixed(2))),
    },
  ];

  const desktopChartOptions: ApexOptions = {
    chart: { toolbar: { show: true } },
    legend: { show: true },
    xaxis: { categories: chartCategories },
    yaxis: { title: { text: "mm" } },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    colors: ["#06b6d4"],
  };

  const mobileChartOptions: ApexOptions = {
    chart: { toolbar: { show: false } },
    legend: { show: true, fontSize: "11px" },
    xaxis: {
      categories: chartCategories,
      labels: { style: { fontSize: "10px" } },
    },
    yaxis: {
      labels: { style: { fontSize: "10px" } },
    },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    colors: ["#06b6d4"],
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Curah Hujan</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 md:text-3xl">Data Curah Hujan - {location}</h1>

        <div className="mt-4 hidden items-center gap-3 md:flex md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari kondisi atau waktu..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as "Semua" | RainfallRow["status"])}
            className="w-56 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
            <option value="Kering">Kering</option>
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
                onChange={(event) => setFilter(event.target.value as "Semua" | RainfallRow["status"])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="Semua">Semua Status</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
                <option value="Kering">Kering</option>
              </select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-base font-bold text-slate-900 md:text-xl">Grafik Intensitas Hujan</h2>

        <div className="mt-4 hidden md:block">
          <ApexChart type="bar" options={desktopChartOptions} series={chartSeries} height={350} />
        </div>

        <div className="mt-4 md:hidden overflow-x-auto hide-scrollbar">
          <div className="min-w-[640px]">
            <ApexChart type="bar" options={mobileChartOptions} series={chartSeries} height={250} />
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
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Curah Hujan</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.datetime} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{row.datetime}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.weather}</td>
                  <td className="px-4 py-3 text-slate-700">{row.temperature}°C</td>
                  <td className="px-4 py-3 text-slate-700">{row.humidity}%</td>
                  <td className="px-4 py-3 text-slate-700">{row.rainfall.toFixed(2)} mm</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>{row.status}</span>
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
                  <p className="text-sm font-bold text-slate-900">{row.weather}</p>
                  <p className="text-xs text-slate-500">{row.datetime}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>{row.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Curah Hujan</span>
                <span className="font-semibold text-slate-900">{row.rainfall.toFixed(2)} mm</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
