import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type DashboardUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
};

export default async function AdminDashboardPage() {
  const [totalUsers, totalAdmins, latestUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);
  const latestUserRows = latestUsers as DashboardUser[];

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Ringkasan cepat data pengguna platform.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-2xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{totalUsers}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:rounded-2xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
          <p className="mt-2 text-2xl font-bold text-cyan-700 md:text-3xl">{totalAdmins}</p>
        </article>
        <article className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-1 md:rounded-2xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Regular</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{Math.max(0, totalUsers - totalAdmins)}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              {latestUserRows.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 text-slate-700">{user.role}</td>
                  <td className="px-4 py-3 text-slate-700">{user.createdAt.toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col space-y-3 p-3 md:hidden">
          {latestUserRows.map((user) => (
            <article key={user.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{user.role}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{user.createdAt.toLocaleDateString("id-ID")}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
