# Backend Guide Pamungkas (Bahasa Indonesia)

Panduan ini adalah versi final backend untuk aplikasi Next.js hasil migrasi. Kita pakai persona Guru supaya mudah dipahami.

Analogi utama:

- Database Prisma = Gudang dan Pantry bahan masakan.
- Server Actions = Koki yang menerima pesanan.
- Validasi Zod = Quality Control di dapur.
- API eksternal BMKG = Supplier bahan segar harian.

Arsitektur besar backend kita sekarang:

- Autentikasi sederhana tanpa verifikasi email.
- Session berbasis cookie + tabel sessions.
- Integrasi API BMKG dengan cache dan fallback.
- Admin Panel dengan otorisasi role admin.
- Data Table admin yang state-nya dikendalikan lewat URL (mirip Filament Laravel).

## 1) Prisma ORM: Cara Kita Menata Gudang Data

Lokasi utama definisi data ada di file:

- prisma/schema.prisma

Model inti yang dipakai:

- User: data pengguna, role, password hash.
- Session: sesi login aktif.
- PasswordResetToken: token reset password.

Contoh model kunci:

```prisma
enum UserRole {
  user
  admin
}

model User {
  id              Int       @id @default(autoincrement())
  name            String    @db.VarChar(255)
  email           String    @unique @db.VarChar(255)
  role            UserRole  @default(user)
  password        String    @db.VarChar(255)
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  sessions        Session[]

  @@map("users")
}
```

Penjelasan ala dapur:

- Tabel User adalah rak utama bahan pelanggan.
- Role adalah label chef biasa atau head chef admin.
- Password disimpan dalam bentuk hash, bukan teks asli.
- Session adalah tiket masuk dapur yang masih berlaku.

Contoh ambil data dari gudang dengan Prisma:

```ts
const users = await prisma.user.findMany({
  orderBy: { createdAt: "desc" },
  take: 12,
});
```

Contoh hitung stok cepat:

```ts
const totalUsers = await prisma.user.count();
const totalAdmins = await prisma.user.count({ where: { role: "admin" } });
```

## 2) Server Actions: Koki yang Mengolah Form dan Aksi Data

Lokasi utama aksi server:

- app/(auth)/actions.ts
- app/admin/users/actions.ts

### 2.1 Autentikasi Dasar (Tanpa Verifikasi Email)

Flow terbaru kita:

- Register sukses langsung create session lalu redirect ke /.
- Login sukses langsung create session lalu redirect ke /.
- Logout menghapus session lalu redirect ke /.

Contoh register singkat:

```ts
export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors);

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: { ...parsed.data, password: passwordHash, role: UserRole.user },
  });

  await createSession(user.id);
  redirect("/");
}
```

### 2.2 Session Management

Lokasi helper session:

- lib/auth/session.ts

Fungsi penting:

- createSession(userId): membuat record session dan cookie hidrokaltim_session.
- getCurrentUser(): membaca cookie, mencocokkan ke tabel sessions, lalu memuat user.
- requireCurrentUser(): jika belum login, redirect ke /login.
- destroySession(): menghapus session dari DB dan cookie browser.

Contoh gate sederhana:

```ts
const user = await getCurrentUser();
if (!user) redirect("/login");
```

### 2.3 Manajemen User Admin

Lokasi:

- app/admin/users/actions.ts

Fitur admin yang sudah ada:

- updateUserRoleAction: ubah role user atau admin.
- deleteUserAction: hapus user dan sesi terkait.

Pengamanan penting:

- Semua action admin memanggil requireAdminUser terlebih dahulu.
- Admin tidak bisa menurunkan rolenya sendiri menjadi user.
- Admin tidak bisa menghapus akun dirinya sendiri.

Contoh pola otorisasi:

```ts
async function requireAdminUser() {
  const currentUser = await requireCurrentUser();
  if (currentUser.role !== UserRole.admin) redirect("/");
  return currentUser;
}
```

## 3) External API BMKG: Supplier Data Cuaca Live

Lokasi integrasi utama:

- lib/weather.ts

Peran file ini:

- Mengambil data prakiraan BMKG dari endpoint publik.
- Menormalisasi payload agar bentuknya konsisten.
- Menerapkan cache server agar hemat request.
- Memberi fallback saat BMKG gagal sementara.

Konstanta utama:

- BMKG_API_URL: endpoint resmi BMKG.
- SAMARINDA_REGION_CODE: kode wilayah target.
- CACHE_DURATION_SECONDS: masa cache 3 jam.

Strategi pengambilan data:

- Retry sampai 3 kali.
- Timeout 5 detik per percobaan.
- Parsing defensif agar data invalid tidak merusak UI.

Contoh inti fetch + cache:

```ts
const getCachedWeather = unstable_cache(
  async () => {
    const data = await fetchWeatherFromBMKG();
    const cachedAt = new Date().toISOString();
    return { data, cachedAt };
  },
  ["bmkg-weather-samarinda"],
  { revalidate: 60 * 60 * 3, tags: ["weather-bmkg"] },
);
```

Nilai balik getWeatherData:

- success true dengan data normal.
- atau success true + stale true jika pakai fallback cache.
- atau success false jika benar-benar gagal total.

## 4) URL-based State ala Filament: Search, Sort, Pagination di Server

Lokasi implementasi:

- app/admin/users/page.tsx
- app/admin/users/actions.ts

Konsep utamanya:

- State tabel tidak disimpan di browser state lokal.
- State dibawa lewat URL query string.
- Server membaca query, lalu menjalankan query Prisma yang sesuai.

Parameter URL yang dipakai:

- query: kata pencarian nama atau email.
- sort: kolom sorting (name, email, createdAt).
- dir: arah sorting (asc, desc).
- page: nomor halaman.
- toast: kode notifikasi sukses.

Contoh URL:

```txt
/admin/users?query=rafi&sort=createdAt&dir=desc&page=2
```

Kenapa pola ini kuat:

- Link bisa dibagikan dan menghasilkan tampilan tabel yang sama.
- SEO dan SSR lebih rapi dibanding state murni client.
- Sangat mirip pengalaman Laravel Filament.

Contoh query server-side:

```ts
const users = await prisma.user.findMany({
  where,
  skip,
  take: PAGE_SIZE,
  orderBy: { [sortableColumns[sort]]: dir },
});
```

Contoh menjaga state setelah action:

```ts
redirect(`${returnTo}${returnTo.includes("?") ? "&" : "?"}toast=role_updated`);
```

Artinya setelah admin update role atau delete user, user tetap kembali ke halaman, filter, sort, dan page yang sama, plus dapat feedback sukses.

## 5) Ringkasan Mental Model Backend

Jika kamu mengajar junior, pakai urutan ini:

1. Lihat schema.prisma dulu, pahami rak data di gudang.
2. Lihat Server Actions, pahami koki menerima pesanan form.
3. Lihat session.ts, pahami tiket masuk dapur.
4. Lihat lib/weather.ts, pahami supplier eksternal + cache.
5. Lihat admin/users/page.tsx, pahami state tabel dari URL.

Dengan pola ini, backend tidak terasa abstrak lagi. Semua terasa seperti dapur profesional yang rapi: bahan jelas, alur kerja jelas, dan hasil masakan konsisten.
```

How this flow maps mentally:

1. Chef receives input.
2. Chef asks Bouncer (Zod).
3. Chef checks Pantry (Prisma) for token/password/user.
4. Chef updates safe auth state and redirects.

---

## Where to Look in This Next.js Project

Main files for these lessons:

- Prisma models: prisma/schema.prisma
- Zod schemas: lib/validation/auth-profile.ts
- Server Actions: app/(auth)/actions.ts
- Session utilities: lib/auth/session.ts
- Auth pages/forms: app/(auth)/*

Tip for new developers:

When debugging, always follow this order:

1. Form fields in page/form component.
2. Server Action receiving FormData.
3. Zod validation output.
4. Prisma query/mutation.
5. Redirect/result message.

---

## Feature Lesson 4: Email Verification Throttling (Laravel throttle:6,1 Equivalent)

### The Concept

Imagine a doorbell at your house.
If someone presses it 30 times in 10 seconds, you need a limiter.

That is what throttling does: it limits how often a user can request an action.

Target behavior from Laravel route middleware `throttle:6,1`:

- Maximum 6 requests
- In 1 minute window

### The Database (Prisma)

We reused this model:

```prisma
model EmailVerificationToken {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  token     String   @unique @db.VarChar(255)
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("email_verification_tokens")
}
```

Why this is enough for throttling:

- Every resend creates one token row.
- `createdAt` tells us when requests happened.
- We can count how many rows were created in the last 60 seconds.

### The Bouncer (Zod)

For throttling itself, no new input fields were introduced, so we did not need a new Zod schema.

Important idea:

- Zod protects input shape.
- Throttling protects system behavior (request frequency).
- Both are safety layers, but for different risks.

### The Chef (Server Actions)

Code used in `sendVerificationEmailAction`:

```ts
const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
const recentRequestsCount = await prisma.emailVerificationToken.count({
  where: {
    userId: currentUser.id,
    createdAt: {
      gte: oneMinuteAgo,
    },
  },
});

if (recentRequestsCount >= 6) {
  return {
    success: false,
    message: "Terlalu banyak permintaan verifikasi. Coba lagi dalam 1 menit.",
  };
}
```

Step-by-step:

1. Chef calculates the time boundary (now minus 1 minute).
2. Chef asks Pantry how many resend tokens this user created since that boundary.
3. If count is 6 or more, Chef refuses request and returns friendly error message.
4. If still under limit, Chef proceeds to create a new verification token.

This is the practical equivalent of Laravel `throttle:6,1` for this flow.

---

## Feature Lesson 5: Dashboard Weather Integration (Replacing WeatherController)

### The Concept

In Laravel, `WeatherController` was the person responsible for:

1. Calling BMKG API.
2. Caching results for 3 hours.
3. Returning normalized weather data.
4. Providing fallback stale data when API fails.

In Next.js App Router, we moved this logic to server-side utility functions and Server Components:

- `lib/weather.ts` is the Chef logic for BMKG integration.
- `app/dashboard/page.tsx` is the Waiter that asks Chef for prepared data.

### The Database (Prisma)

For this specific weather slice, we do not store BMKG weather in Prisma tables.

Pantry note:

- Prisma remains the Pantry for user/auth domain.
- Weather data is external (BMKG), so we cache server-side via Next cache instead of DB persistence.

### The Bouncer (Zod)

This weather read flow does not receive raw user form data, so no new Zod schema is required here.

Safety still exists in another way:

- We normalize BMKG payload shape in code (only fields needed by frontend).
- This acts like structural filtering before data reaches UI.

### The Chef (Server-Side Data Functions)

Core code is in `lib/weather.ts`:

```ts
const getCachedWeather = unstable_cache(
  async () => {
    const data = await fetchWeatherFromBMKG();
    const cachedAt = new Date().toISOString();
    fallbackCache = { data, cachedAt };
    return { data, cachedAt };
  },
  ["bmkg-weather-samarinda"],
  { revalidate: 60 * 60 * 3, tags: ["weather-bmkg"] },
);
```

How Chef works step-by-step:

1. Chef calls BMKG API with retry + timeout.
2. Chef normalizes payload into compact format used by widgets.
3. Chef stores response in Next cache for 3 hours.
4. Chef keeps fallback in-memory cache for stale mode when API is unavailable.

Equivalent to Laravel behaviors:

- `index()` -> `getWeatherData()` in `lib/weather.ts`, consumed directly by `app/dashboard/page.tsx`.
- `refresh()` -> `refreshWeatherAction()` in `app/dashboard/actions.ts` that triggers `revalidateTag("weather-bmkg")`.

Result:

- No API route required.
- Server Component directly receives prepared weather data from Chef.
