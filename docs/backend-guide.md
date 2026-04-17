# Backend Guide Pamungkas (Bahasa Indonesia)

Panduan ini adalah modul pembelajaran utama backend untuk aplikasi Next.js hasil migrasi.

Kita pakai persona Guru agar mudah dicerna:

- Prisma ORM = Gudang/Pantry bahan.
- Server Actions = Koki yang memasak pesanan.
- Zod Validation = Quality Control dapur.
- API BMKG = Supplier bahan segar harian.

## Tujuan Pembelajaran

Setelah membaca panduan ini, kamu akan paham:

- Cara mendefinisikan model data dengan Prisma.
- Cara Server Actions menangani autentikasi dan manajemen user admin.
- Cara mengambil dan memproses data cuaca live dari BMKG.
- Cara panel admin mengelola search, sort, pagination berbasis URL seperti Filament.

## 1) Prisma ORM: Menata Gudang Data

Lokasi utama schema:

- prisma/schema.prisma

Model inti yang dipakai saat ini:

- User
- Session
- PasswordResetToken

Contoh potongan model:

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

model Session {
  id           String   @id @db.VarChar(255)
  userId       Int?     @map("user_id")
  ipAddress    String?  @map("ip_address") @db.VarChar(45)
  userAgent    String?  @map("user_agent")
  payload      String   @db.LongText
  lastActivity Int      @map("last_activity")
  user         User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([lastActivity])
  @@map("sessions")
}
```

Penjelasan ala dapur:

- `User` adalah rak bahan utama pengguna.
- `role` adalah label akses user biasa atau admin.
- `Session` adalah tiket masuk dapur (siapa sedang login).
- `PasswordResetToken` adalah kupon reset password sementara.

Contoh ambil data dari "gudang":

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

## 2) Server Actions: Koki yang Mengolah Pesanan Form

Lokasi penting:

- app/(auth)/actions.ts
- app/admin/users/actions.ts

### 2.1 Alur Autentikasi (Sudah Disederhanakan)

Autentikasi terbaru tanpa verifikasi email.

Alurnya:

1. Register valid -> simpan user + hash password -> buat session -> redirect `/`.
2. Login valid -> cek kredensial -> buat session -> redirect `/`.
3. Logout -> hapus session -> redirect `/`.

Contoh ringkas register action:

```ts
export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: passwordHash,
      role: UserRole.user,
    },
  });

  await createSession(user.id);
  redirect("/");
}
```

### 2.2 Session Management

Lokasi helper:

- lib/auth/session.ts

Fungsi inti:

- `createSession(userId)`: buat record session + cookie `hidrokaltim_session`.
- `getCurrentUser()`: baca cookie, cari session, muat user.
- `requireCurrentUser()`: paksa login, jika tidak ada redirect ke `/login`.
- `destroySession()`: hapus session dari DB + cookie.

Contoh gate login:

```ts
const user = await getCurrentUser();
if (!user) {
  redirect("/login");
}
```

### 2.3 Manajemen User Admin (Role & Delete)

Lokasi:

- app/admin/users/actions.ts

Action penting:

- `updateUserRoleAction(formData)`
- `deleteUserAction(formData)`

Pengamanan yang diterapkan:

- Wajib lolos `requireAdminUser()`.
- Admin tidak boleh menurunkan role dirinya sendiri.
- Admin tidak boleh menghapus akun dirinya sendiri.

Contoh otorisasi admin:

```ts
async function requireAdminUser() {
  const currentUser = await requireCurrentUser();
  if (currentUser.role !== UserRole.admin) {
    redirect("/");
  }
  return currentUser;
}
```

## 3) External APIs: BMKG Live di lib/weather.ts

Lokasi utama:

- lib/weather.ts

Peran modul ini:

- Ambil data prakiraan cuaca dari BMKG.
- Normalisasi payload mentah agar aman dipakai UI.
- Terapkan cache server 3 jam.
- Sediakan fallback stale cache saat BMKG gagal.

Konstanta utama:

- `BMKG_API_URL`
- `SAMARINDA_REGION_CODE`
- `CACHE_DURATION_SECONDS`

Strategi fetch:

- Retry sampai 3 percobaan.
- Timeout 5 detik setiap percobaan.
- Parse defensif untuk mencegah data null/invalid merusak halaman.

Contoh cache dengan `unstable_cache`:

```ts
const getCachedWeather = unstable_cache(
  async () => {
    const data = await fetchWeatherFromBMKG();
    const cachedAt = new Date().toISOString();
    return { data, cachedAt };
  },
  ["bmkg-weather-samarinda"],
  {
    revalidate: 60 * 60 * 3,
    tags: ["weather-bmkg"],
  },
);
```

Output `getWeatherData()`:

- `success: true` dengan data normal.
- `success: true, stale: true` saat memakai fallback cache.
- `success: false` saat gagal total.

## 4) URL-based State ala Laravel Filament

Lokasi implementasi:

- app/admin/users/page.tsx
- app/admin/users/actions.ts

Konsep intinya:

- State tabel dibawa oleh URL query params, bukan client state lokal.
- Server membaca URL, lalu eksekusi query Prisma sesuai parameter.

Parameter yang dipakai:

- `query` -> pencarian nama/email.
- `sort` -> kolom urut (`name`, `email`, `createdAt`).
- `dir` -> arah urut (`asc`, `desc`).
- `page` -> halaman saat ini.
- `toast` -> kode notifikasi sukses.

Contoh URL:

```txt
/admin/users?query=zidane&sort=createdAt&dir=desc&page=2
```

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

Artinya setelah update role atau delete user, admin kembali ke state tabel yang sama (filter/sort/page tetap), lalu melihat feedback sukses.

## 5) Checklist Mental Model Backend

Saat belajar atau onboarding, baca berurutan:

1. `prisma/schema.prisma` -> pahami struktur gudang data.
2. `lib/auth/session.ts` -> pahami tiket login/session.
3. `app/(auth)/actions.ts` -> pahami alur koki autentikasi.
4. `lib/weather.ts` -> pahami supplier BMKG + cache.
5. `app/admin/users/page.tsx` + `app/admin/users/actions.ts` -> pahami URL state + aksi admin.

Dengan pola ini, backend terasa seperti dapur profesional: alur kerja jelas, bahan rapi, dan hasil selalu konsisten.
