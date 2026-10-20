# ECU Website Runtime Blocker

_Checked: 20 October 2026_

## Status

The project cannot currently run its declared Next.js application. The dependency is declared in `package.json`, but there is no project-local `node_modules/next` installation and no lockfile.

## Observed environment

- Node.js: `v24.16.0`
- npm: `11.13.0`
- Next.js: `14.2.25` declared
- React: `18.3.1` declared
- Registry: `https://registry.npmjs.org/`
- `strict-ssl`: `true`
- HTTPS proxy: not configured
- Project npm cache: `C:\Users\HI\AppData\Local\npm-cache`
- Local Next.js binary: not found

## Observed errors

`npm.cmd run build` stops before compilation:

```text
> website@1.0.0 build
> next build

'next' is not recognized as an internal or external command,
operable program or batch file.
```

Earlier installation diagnostics recorded:

- TLS certificate validation failure: `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
- Registry request failure: `403 Forbidden - GET https://registry.npmjs.org/next`
- npm cache permission failure: `EPERM` while unlinking a cache item

## Required ECU IT remediation

ECU IT should provide one of these authorized paths:

1. An approved internal npm registry or package proxy that permits `next@14.2.25`, `react@18.3.1`, and `react-dom@18.3.1`.
2. The organization’s trusted CA certificate chain, installed through the approved operating-system/Node trust process.
3. An authorized offline dependency bundle containing the declared packages and a generated lockfile.
4. An approved proxy configuration and permission to access the required registry endpoints.

TLS verification must remain enabled. Do not use `npm config set strict-ssl false`, untrusted mirrors, or committed credentials.

## Verification commands after remediation

Run from `D:\ahmed\Website`:

```powershell
npm.cmd config get registry
npm.cmd config get strict-ssl
npm.cmd ping
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

Expected results:

- The registry is the ECU-approved endpoint.
- `strict-ssl` reports `true`.
- `npm ping` succeeds without certificate or permission errors.
- `npm install` creates `node_modules` and a lockfile.
- `npm run build` completes successfully.
- The development server responds locally for browser QA.

## Phase 9 update

A browser-testable static preview is available at [preview/ecu-preview.html](../preview/ecu-preview.html). It is explicitly labelled as a preview and does not replace Next.js. Preview-level visual and interaction results are recorded in [docs/VISUAL_QA_REPORT.md](./VISUAL_QA_REPORT.md).

## Current consequence

Source-level route, import, data, and navigation checks can run, but production rendering, screenshots, browser interaction, keyboard QA, RTL/LTR runtime checks, console inspection and performance measurement remain unverified until dependencies are restored.
