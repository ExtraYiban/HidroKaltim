"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { MOBILE_PRIMARY_NAV, PUBLIC_NAV_ITEMS } from "@/app/components/navigation/nav-config";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function MobileNavigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const title = useMemo(() => {
    return PUBLIC_NAV_ITEMS.find((item) => isActivePath(pathname, item.href))?.label ?? "HidroKaltim";
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/HidroKaltim.png" alt="HidroKaltim" width={32} height={32} className="rounded-full" />
            <span className="text-sm font-bold text-slate-900">{title}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Menu
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/55" onClick={() => setMenuOpen(false)} aria-label="Tutup menu" />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigasi</p>
            <nav className="space-y-2">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white md:hidden">
        <ul className="grid grid-cols-4">
          {MOBILE_PRIMARY_NAV.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold ${
                    active ? "text-cyan-700" : "text-slate-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-6 rounded-full transition ${
                      active ? "bg-cyan-600" : "bg-transparent"
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
