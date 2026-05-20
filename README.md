# SIM EMS UI

Next.js application for the SIM EMS monitoring interface.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in the browser.

## Application Structure

The codebase is organized by responsibility:

```text
src/
	app/                     # Next.js app router entry points and shared app-level styles
		layout.tsx
		page.tsx               # Root route, delegates to a feature module
		pv/
			page.tsx             # PV route, delegates to the PV feature module
	components/              # Shared cross-feature UI components
	config/                  # App configuration
	modules/                 # Feature-owned code
		pv-monitoring/
			index.ts             # Feature entry point
			components/
				PVMonitoringPage.tsx
				MonitoringSidebar.tsx
	store/                   # State containers
	types/                   # Shared types
```

## Structure Rules

- Keep `src/app` thin. Route files should compose feature modules instead of owning complex UI.
- Put feature-specific UI, state, and helpers inside `src/modules/<feature>`.
- Keep `src/components` for reusable components shared by multiple features.
- Export each feature from a single module entry file when possible.

## Available Scripts

- `npm run dev` starts the development server.
- `npm run build` builds the production app.
- `npm run start` runs the production server.
- `npm run lint` runs ESLint.
- `npm run test` runs Jest.
