# HidroKaltim

Web project built with Next.js (App Router), TypeScript, and Tailwind CSS.

## New Here? Start With This

If this is your first time opening this repository, follow these steps in order:

1. Install Node.js (LTS, recommended v20+).
2. Clone the repository.
3. Install dependencies.
4. Run the development server.
5. Open the app in your browser.

## Quick Start

```bash
# 1) Clone
git clone https://github.com/ExtraYiban/HidroKaltim.git

# 2) Enter folder
cd HidroKaltim

# 3) Install dependencies
npm install

# 4) Start local development server
npm run dev
```

Then open:

http://localhost:3000

## Available Scripts

Run these in the project root:

- `npm run dev`: Start development server.
- `npm run build`: Build production output.
- `npm run start`: Run production server after build.
- `npm run lint`: Run ESLint checks.

## Project Structure (Basic)

- `app/`: App Router pages and layout.
- `public/`: Static files (images, icons, etc).
- `app/page.tsx`: Home page.
- `app/layout.tsx`: Root layout.
- `app/globals.css`: Global styles.

## First Things To Edit

If you want to start coding immediately:

1. Edit `app/page.tsx` for homepage content.
2. Edit `app/globals.css` for global styling.
3. Run `npm run lint` before committing changes.

## Common Beginner Issues

- `npm` not found:
	Install Node.js first, then restart terminal.
- Port 3000 already used:
	Stop the running process or run with another port.
- Dependency install failed:
	Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## Learn More

- Next.js docs: https://nextjs.org/docs
- TypeScript docs: https://www.typescriptlang.org/docs/
- Tailwind CSS docs: https://tailwindcss.com/docs
