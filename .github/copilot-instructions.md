# Copilot Instructions for HidroKaltim

## Build, Test, and Lint Commands

```bash
# Install dependencies
npm install

# Development server (port 3000 by default)
npm run dev

# Production build
npm run build

# Production server (after build)
npm run start

# Linting all files
npm run lint

# Linting a single file
npx eslint app/components/data/rainfall-data-client.tsx
```

**Notes:**
- No test runner configured yet (no `test` script in package.json)
- ESLint uses Next.js strict rules (TypeScript, core-web-vitals)
- Prisma CLI: `npx prisma generate`, `npx prisma migrate dev`, `npx prisma studio`
- Build output: `.next/` directory (production-ready)

## High-Level Architecture

### Two-World UI Architecture
This codebase implements a "Two-World Architecture"—completely separate HTML structures for desktop vs. mobile, NOT responsive shrinking:

- **Desktop** (`hidden md:block` / `hidden md:flex`): Spacious layouts, data tables (`<table>` tags), sidebars, multi-column grids
- **Mobile** (`block md:hidden` / `flex md:hidden`): Full-width single-column, card lists (NO tables), bottom navigation, 2-column grids

Every data-driven component renders TWO entirely different component trees. This prevents mobile bloat and enables native-app-like UX on small screens.

**Breakpoint**: Tailwind `md:` prefix = 768px (tablet/desktop threshold)

### Server-First Approach
- All pages are **Server Components** by default
- `"use client"` used ONLY for interactive features:
  - Client state (search, filters, modals, toast, forms)
  - ApexCharts visualization
  - Browser APIs (Leaflet maps, localStorage, event handlers)
- This minimizes JavaScript to clients and optimizes Core Web Vitals

### Route Groups & Organization
```
app/
├── (public)/          # Public routes → PublicShell (sidebar + mobile nav)
│   ├── layout.tsx     # Route group layout
│   ├── page.tsx       # Dashboard/Hero
│   ├── curah-hujan/   # Rainfall data
│   ├── tma-debit/     # Water level & discharge
│   ├── iklim/         # Climate data
│   ├── kualitas-air/  # Water quality
│   ├── permohonan-data/
│   └── tentang-kami/
│
└── (admin)/           # Admin-only routes → AdminLayout (sidebar + mobile nav)
    └── admin/
        ├── layout.tsx       # Admin layout
        ├── page.tsx         # Admin dashboard
        ├── settings/        # Admin settings
        └── users/
            ├── page.tsx     # User CRUD list
            └── actions.ts   # Server actions
```

Route groups `(public)` and `(admin)` don't affect URLs but enable different layouts.

### Data Fetching & Caching
- **Server Components**: Use `fetch()` directly in `.tsx` files (ISR-compatible)
- **ISR (Incremental Static Regeneration)**: Data pages revalidate every 3 hours (`revalidate: 60 * 60 * 3`)
- **Server Actions**: Form submissions use `"use server"` functions instead of API routes
- **Mock Data**: `lib/weather.ts` provides BMKG weather fallback; real DB integration pending

### Database & ORM
- **Prisma**: v7.7.0, MySQL provider
- **Schema**: `prisma/schema.prisma` defines User, Session, PasswordResetToken models
- **Client**: `lib/prisma.ts` implements singleton pattern (currently mocked)
- **Status**: Schema defined but migrations not yet applied (DATABASE_URL not configured)

### Component Organization

#### Navigation
- `app/components/navigation/nav-config.ts` – Route configuration & menu items
- `app/components/navigation/desktop-sidebar.tsx` – Permanent left sidebar (md:flex)
- `app/components/navigation/mobile-navigation.tsx` – Full-screen hamburger overlay (md:hidden)
- `app/components/layout/public-shell.tsx` – Wraps public pages with navigation

#### Data Pages
Each data page (rainfall, TMA/debit, climate, water quality) has a client component:
- `app/components/data/{name}-data-client.tsx` – Renders desktop table + mobile cards, chart, search/filter
- `app/components/data/apex-chart.tsx` – Reusable ApexChart wrapper (responsive config)

#### Admin
- `app/components/admin/admin-users-manager.tsx` – User CRUD UI (desktop table + mobile cards + FAB)
- `app/components/admin/admin-mobile-nav.tsx` – Mobile hamburger menu overlay

#### Shared UI
- `app/components/ui/page-intro.tsx` – Page header component (title + description)

## Key Conventions

### File Naming & Organization
- **Route files**: `app/(groupName)/routePath/page.tsx`
- **Client components**: Suffix `-client.tsx` (e.g., `rainfall-data-client.tsx`)
- **Server components**: No suffix; filename only (e.g., `page.tsx`, `layout.tsx`)
- **Config files**: `-config.ts` (e.g., `nav-config.ts`)
- **Server actions**: `actions.ts` in the route folder
- **Type definitions**: Inline or in separate `.ts` files; no separate types folder yet

### UI & Styling Conventions
- **Framework**: Tailwind CSS 4 (utility-first, no CSS modules)
- **Custom utilities**: `hide-scrollbar` (hides scrollbar while allowing scroll) in `app/globals.css`
- **Two-World utilities**:
  - Desktop: `hidden md:block`, `hidden md:flex`, `grid-cols-4`, `w-72` (sidebars)
  - Mobile: `block md:hidden`, `flex md:hidden`, `w-full`, `grid-cols-2`
- **Component styling**: All className (no external stylesheets)
- **Responsive images**: Use `next/image` with explicit width/height
- **Icons**: Currently using emoji; no icon library
- **Language**: Keep product/UI copy in Indonesian (e.g., "Halo, Selamat Datang", "Tambah User")
- **Code comments**: English

### Two-World Component Pattern
Every data page follows this structure:
```tsx
"use client";
export function DataPageClient() {
  return (
    <>
      {/* Desktop: hidden md:block */}
      <div className="hidden md:block">
        <table>...</table>  {/* HTML table */}
        <ApexChart ... />
      </div>

      {/* Mobile: block md:hidden */}
      <div className="block md:hidden">
        {/* Card list, no table */}
        <div className="space-y-3">
          {items.map(item => (
            <div className="rounded-xl ring-1 ring-slate-100 p-4">
              {/* Card content */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

### Server Component vs Client Component Pattern

**Server Components** (Default):
```tsx
// app/(public)/curah-hujan/page.tsx
export default function RainfallPage() {
  // Direct data fetching, no state
  const data = await fetch(...);
  return <RainfallDataClient initialData={data} />;
}
```

**Client Components** (Interactive Only):
```tsx
"use client";
// app/components/data/rainfall-data-client.tsx
export function RainfallDataClient({ initialData }) {
  const [search, setSearch] = useState("");
  // State, events, ApexChart rendering
  return (...);
}
```

**Server Actions** (Form Submission):
```tsx
// app/(admin)/admin/users/actions.ts
"use server";
export async function createUserAction(formData: FormData) {
  const name = formData.get("name");
  // Validate, hash, create in DB, revalidate paths
  revalidatePath("/admin/users");
}
```

### TypeScript Conventions
- **Strict mode**: Enabled (tsconfig.json: `"strict": true`)
- **No implicit any**: ESLint enforces `@typescript-eslint/no-explicit-any` rule
- **Import paths**: Use `@/*` alias (e.g., `@/app/components/...`)
- **Exclusions**: `hidrokaltim-example/` and `prisma.config.ts` excluded from type-checking

### Git & Commits
- **Standard**: Conventional Commits (e.g., `feat: add user dashboard`, `fix: correct chart height`)
- **Co-author trailer**: Include `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

## Important Notes

- **Prisma Client Not Generated**: @prisma/client module is mocked in `lib/prisma.ts` because DATABASE_URL not set. This will be auto-generated when DB is configured.
- **No Authentication Enforced**: All routes (including /admin) are currently public. Middleware needed to protect admin routes.
- **Mock Data**: All data pages return mocked/synthetic data. Real BMKG API integration pending.
- **No Tests**: No test runner configured. Jest + Playwright recommended for future.
- **Next.js 16 Breaking Changes**: This version may differ from older Next.js. Check `node_modules/next/dist/docs/` for API updates.

### Data Models
- **User**: id, name, email, password (bcrypt-hashed), role (UserRole enum), createdAt, updatedAt, sessions
- **UserRole**: `"user"` or `"admin"` (enum)
- **Session**: id, userId, ipAddress, userAgent, payload, lastActivity
- **PasswordResetToken**: email, token, createdAt

## Debugging Tips

- **Build fails**: Run `npm run lint` first to catch TypeScript errors
- **"Module not found"**: Check path alias `@/*` is correct in `tsconfig.json`
- **Tailwind classes not working**: Ensure file is included in Tailwind config (all `.tsx` files in `app/` included by default)
- **Prisma errors**: Check `DATABASE_URL` is set; run `npx prisma generate` if @prisma/client missing
- **Chart not rendering**: Verify ApexCharts is installed (`npm ls apexcharts`) and chart config is valid
- **Port 3000 in use**: Run `npm run dev -- -p 3001` to use alternate port
