import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Titik Monitoring", value: "24", tone: "text-cyan-700" },
  { label: "Pos Hujan Aktif", value: "18", tone: "text-blue-700" },
  { label: "Status Siaga", value: "03", tone: "text-amber-700" },
  { label: "Update Terakhir", value: "10:15", tone: "text-emerald-700" },
];

export default function HomePage() {
  return (
    <div className="space-y-4 md:space-y-8">
      <section className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="grid min-h-[340px] grid-cols-12">
          <div className="col-span-7 flex flex-col justify-between p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600">HidroKaltim Dashboard</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900">
                Pusat Monitoring Hidrologi Kalimantan Timur yang Cepat, Akurat, dan Siap Tanggap.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Pantau curah hujan, tinggi muka air, dan kondisi wilayah secara terintegrasi. Dashboard ini dirancang untuk membantu tim operasional mengambil keputusan lebih cepat dengan visualisasi data yang jelas.
              </p>
            </div>

            <div className="mt-8 flex flex-row gap-3">
              <Link
                href="/curah-hujan"
                className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Lihat Curah Hujan
              </Link>
              <Link
                href="/tma-debit"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Buka TMA & Debit
              </Link>
            </div>
          </div>

          <div className="col-span-5 bg-linear-to-br from-cyan-50 to-blue-50 p-8">
            <div className="flex h-full items-center justify-center rounded-2xl border border-cyan-100 bg-white/75">
              <Image src="/HidroKaltim.png" alt="Ilustrasi HidroKaltim" width={180} height={180} className="rounded-full" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Dashboard</p>
          <h1 className="mt-2 text-xl font-bold text-slate-900">Halo, Selamat Datang 👋</h1>

          <div className="mt-4 flex flex-col space-y-3">
            <Link
              href="/curah-hujan"
              className="w-full rounded-xl bg-cyan-600 py-3 text-center text-sm font-semibold text-white"
            >
              Lihat Curah Hujan
            </Link>
            <Link
              href="/tma-debit"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700"
            >
              Buka TMA & Debit
            </Link>
          </div>
        </div>
      </section>

      <section className="hidden md:grid md:grid-cols-4 md:gap-5">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.tone}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-3 md:hidden">
        {stats.map((item) => (
          <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className={`mt-1 text-xl font-bold ${item.tone}`}>{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
