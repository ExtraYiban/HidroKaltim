export type NavItem = {
  label: string;
  href: string;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Curah Hujan", href: "/curah-hujan" },
  { label: "TMA & Debit", href: "/tma-debit" },
  { label: "Iklim", href: "/iklim" },
  { label: "Kualitas Air", href: "/kualitas-air" },
  { label: "Permohonan Data", href: "/permohonan-data" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

export const MOBILE_PRIMARY_NAV: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Curah Hujan", href: "/curah-hujan" },
  { label: "TMA & Debit", href: "/tma-debit" },
  { label: "Iklim", href: "/iklim" },
];
