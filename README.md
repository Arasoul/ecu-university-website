# ECU University Website

## Project overview

This project is a proposed replacement website for the Egyptian Chinese University (ECU). It is an independent development project for review and is not represented as adopted, deployed, or officially approved by ECU.

The implementation preserves verified ECU source information where available and clearly marks content, media, translation, and integration areas that still require ECU approval.

## Technology stack

- Next.js `14.2.25` (declared; unavailable in the current local environment)
- React `18.3.1`
- React DOM `18.3.1`
- Next.js App Router
- JavaScript and CSS
- CommonJS project configuration

No package lockfile is currently present. Generate one only after installing dependencies through an approved npm registry, proxy, CA, or offline package source.

## Current features

- Responsive Next.js App Router structure.
- ECU homepage with red/grey/white visual system.
- Shared two-level header and responsive navigation.
- Accessible Academics disclosure/mega-menu foundation.
- English, Arabic RTL, and Simplified Chinese LTR UI controls.
- Locale persistence using `localStorage` in the shared header.
- Faculty directory with twelve verified faculty records.
- Faculty search and no-match recovery.
- Reusable faculty detail routes.
- Verified programme discovery with search, faculty filtering, result counts, and reset behavior.
- Local About, Admissions, News/Events, Research, and Contact routes.
- Source-backed content and migration documentation.
- Static browser-testable visual preview.
- Responsive design tokens and narrow-screen overflow protections.

## Project structure

```text
app/          Next.js App Router pages and production styles
components/   Shared React UI components
lib/           Faculty, programme, and institutional content data
public/        Local public assets
preview/      Clearly labelled static UI preview
docs/         Content, migration, environment, QA, and design documentation
next.config.js
package.json
```

## Setup

Install dependencies through an approved package source:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production server after a successful build:

```bash
npm run start
```

The current environment cannot execute these Next.js commands because the declared `next` package is not installed. Do not disable TLS verification or use an unapproved package mirror to work around this blocker.

## Static preview

Open [preview/ecu-preview.html](./preview/ecu-preview.html) in a browser for a representative static preview of the homepage, faculty directory, CIS faculty experience, locale direction behavior, mobile navigation, and programme finder.

This preview is not the production Next.js application and passing preview checks does not prove that the Next.js application builds or runs.

## Current limitations

- Next.js dependencies are unavailable in the existing environment.
- No production build has been verified.
- No package lockfile exists yet.
- Some ECU content is incomplete, including current news/events, achievements, continuing education, campus life, and complete programme metadata.
- Campus and faculty media require ECU rights and approval; the local asset inventory is intentionally limited.
- Full approved Arabic and Simplified Chinese institutional translations are incomplete.
- External admissions and other service integrations require ECU confirmation.
- Visual testing has primarily been performed through the clearly labelled static preview.

## Documentation

- [UI/UX progress](./docs/UI_UX_PROGRESS.md)
- [Content gap analysis](./docs/ECU_CONTENT_GAP_ANALYSIS.md)
- [Content migration register](./docs/ECU_CONTENT_MIGRATION.md)
- [Media inventory](./docs/ECU_MEDIA_INVENTORY.md)
- [Legacy URL map](./docs/ECU_URL_REDIRECT_MAP.md)
- [Visual QA report](./docs/VISUAL_QA_REPORT.md)
- [IT environment blocker](./docs/IT_ENVIRONMENT_BLOCKER.md)

## Review and publication notes

This repository is intended to let another developer or AI assistant inspect the current implementation, its verified-content boundaries, visual preview, and known blockers. Secrets, local dependency directories, npm cache data, environment files, logs, build output, and private key formats are excluded by `.gitignore`.
