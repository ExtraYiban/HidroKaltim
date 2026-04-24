import Image from "next/image";
import Link from "next/link";
import { PUBLIC_NAV_ITEMS } from "@/app/components/navigation/nav-config";

export function DesktopSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/HidroKaltim.png" alt="HidroKaltim" width={40} height={40} className="rounded-full" priority />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600">HidroKaltim</p>
            <p className="text-base font-bold text-slate-900">Monitoring Hidrologi</p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-5">
        {PUBLIC_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-100 hover:bg-cyan-50 hover:text-cyan-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
