import Link from "next/link";
import { AdminMobileNav } from "@/app/components/admin/admin-mobile-nav";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
];

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden min-h-screen md:flex">
        <aside className="w-72 shrink-0 border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600">Admin Panel</p>
            <h1 className="mt-2 text-xl font-bold text-slate-900">HidroKaltim</h1>
          </div>
          <nav className="space-y-2 px-4 py-5">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>

      <div className="md:hidden">
        <AdminMobileNav title="Admin HidroKaltim" items={adminNavItems} />
        <main className="px-4 pb-8 pt-4">{children}</main>
      </div>
    </div>
  );
}
