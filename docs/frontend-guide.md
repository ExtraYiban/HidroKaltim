# Frontend Guide Pamungkas (Bahasa Indonesia)

Panduan ini adalah buku belajar utama frontend untuk aplikasi Next.js hasil migrasi.

Persona Guru yang kita pakai:

- Server Component = Pelayan restoran yang menyiapkan meja.
- Client Component = Dekorator interaktif yang membuat meja hidup.
- Tailwind CSS = Tim tata ruang yang mengatur tampilan.

Tujuan utama frontend kita sekarang:

- Routing App Router rapi dan konsisten dengan URL bisnis.
- Pemisahan tegas bagian server dan interaktif browser.
- Admin Panel bergaya Filament, termasuk toast interaktif.
- Visualisasi cuaca dan ML forecasting yang jelas untuk user.

## 1) Next.js App Router: Struktur Folder Menjadi URL

Di Next.js App Router, file dan folder adalah peta rute.

Aturan dasar:

- app/page.tsx menjadi /.
- app/admin/page.tsx menjadi /admin.
- app/admin/users/page.tsx menjadi /admin/users.
- app/(auth)/login/page.tsx menjadi /login.

Catatan:

- Folder dengan tanda kurung, seperti (auth), adalah route group dan tidak muncul di URL.

Contoh rute publik yang sudah aktif:

- /
- /curah-hujan
- /tma-debit
- /iklim
- /kualitas-air
- /permohonan-data
- /tentang-kami

## 2) Pengganti Inertia: Navigasi dengan Link dari Next

Saat migrasi dari Laravel Inertia ke Next.js, komponen navigasi penting adalah Link.

Kenapa Link:

- Navigasi lebih halus tanpa full page reload.
- Konsisten dengan App Router.

Contoh:

```tsx
import Link from "next/link";

<Link href="/curah-hujan">Curah Hujan</Link>
```

Implementasi nyata ada di komponen header:

- Header menampilkan link menu publik.
- Header menampilkan tombol Login/Register jika belum login.
- Header menampilkan Profile, Admin Panel (khusus admin), dan Logout jika sudah login.

## 3) Server vs Client Components: Siapa Melayani, Siapa Menghias

### 3.1 Server Components (Pelayan)

Tugas utama:

- Mengambil data dari backend sebelum render.
- Menentukan akses halaman (misalnya layout admin cek role).
- Menyusun kerangka halaman besar: Header, konten, Footer.

Contoh server page:

- app/page.tsx: ambil BMKG, normalisasi data, pass ke komponen UI.
- app/curah-hujan/page.tsx: ambil data awal chart BMKG.
- app/admin/layout.tsx: cek login dan role admin, selain itu redirect ke /.
- app/admin/page.tsx: statistik total user/admin.

Contoh sederhana server fetch:

```tsx
export default async function HomePage() {
  const weather = await getWeatherData();
  return <Body loading={!weather.success} forecasts={forecasts} weatherData={rawWeatherData} />;
}
```

### 3.2 Client Components (Dekorator Interaktif)

Tugas utama:

- Menangani state interaktif browser.
- Merender peta, chart, filter, toast, dan form feedback.

Contoh client component di proyek ini:

- app/components/CurahHujanCharts.tsx
- app/components/ToasterProvider.tsx
- app/admin/users/users-toast.tsx
- Komponen profile forms di app/profile/partials

Penanda wajib untuk komponen interaktif:

```tsx
"use client";
```

Jika komponen butuh event klik, state, efek browser, atau library yang hanya jalan di client, maka harus client component.

## 4) UI Admin Panel: Filament-style dari Nol dengan Tailwind

### 4.1 Layout Admin

Lokasi:

- app/admin/layout.tsx

Fitur layout:

- Sidebar kiri untuk menu Dashboard dan Users.
- Topbar untuk context admin + tombol kembali ke situs + logout.
- Gate keamanan role admin di level layout.

Konsep keamanan di UI layer:

```tsx
const user = await getCurrentUser();
if (!user || user.role !== "admin") {
  redirect("/");
}
```

### 4.2 Tabel Users ala Filament

Lokasi:

- app/admin/users/page.tsx

Ciri Filament-like yang kita pakai:

- Kartu putih, border abu, tipografi bersih.
- Search toolbar.
- Header kolom sortable.
- Pagination footer.
- Action inline: ubah role dan delete.

### 4.3 Notifikasi Toast Interaktif

Library:

- sonner

Lokasi:

- app/components/ToasterProvider.tsx
- app/admin/users/users-toast.tsx

Cara kerja:

- Server action redirect kembali dengan parameter toast, misalnya toast=role_updated.
- Komponen users-toast membaca parameter itu, lalu memanggil toast.success.

Contoh pola:

```ts
redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}toast=role_updated`);
```

## 5) Visualisasi Machine Learning: Random Forest dan SVR

Lokasi utama chart:

- app/components/CurahHujanCharts.tsx

Stack chart:

- react-apexcharts + apexcharts

### 5.1 Struktur Visualisasi Time-series

Untuk chart Random Forest dan SVR, kita sudah implementasi format perbandingan:

- Dua series per chart:
  - Data Aktual
  - Prediksi
- Sumbu X berbasis waktu bulanan.
- Sumbu Y memakai Curah Hujan (mm).
- Garis Data Aktual dibuat solid biru.
- Garis Prediksi dibuat merah putus-putus agar mudah dibandingkan.

Contoh series:

```ts
const forestChartSeries = [
  { name: "Data Aktual", data: actualSeries },
  { name: "Prediksi", data: predictedSeries },
];
```

### 5.2 Tooltip Perbandingan

Kita aktifkan tooltip shared agar saat hover satu titik waktu, nilai aktual dan prediksi muncul bersamaan.

Contoh opsi:

```ts
tooltip: {
  shared: true,
  intersect: false,
  y: {
    formatter: (value) => `${Number(value).toFixed(2)} mm`,
  },
}
```

Hasilnya, pengguna bisa membaca gap model vs data real secara cepat.

## 6) Pola Belajar Cepat untuk Tim Frontend

Urutan membaca fitur baru:

1. Buka route page server dulu, lihat data dari mana.
2. Cek komponen client, lihat bagian interaktif apa saja.
3. Cek style Tailwind, pastikan konsisten design system.
4. Cek server action jika ada form/action.
5. Cek query URL jika ada tabel admin.

Dengan pola ini, kamu bisa memahami migrasi Laravel Inertia ke Next.js App Router secara sistematis, bukan trial and error.

## 7) Ringkasan Inti Frontend Saat Ini

- Routing sudah native App Router.
- Link sudah native Next, bukan Inertia.
- Public pages sudah memakai Header dan Footer konsisten.
- Admin panel sudah bergaya Filament dengan search, sort, pagination, dan toast.
- Curah hujan sudah memiliki chart interaktif BMKG + visualisasi ML aktual vs prediksi.

Panduan ini adalah fondasi untuk onboarding developer baru agar langsung paham cara kerja antarmuka aplikasi end-to-end.
