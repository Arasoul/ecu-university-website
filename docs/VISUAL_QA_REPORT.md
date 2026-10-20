# ECU Visual QA Report

_Preview test date: 20 October 2026_

## Test scope

The Next.js runtime was unavailable because `next` is not installed. A clearly labelled static preview was created at [preview/ecu-preview.html](../preview/ecu-preview.html) using the existing ECU design tokens, logo asset, faculty content and responsive styles. The preview is not evidence that the Next.js application builds.

Tested experiences:

- Homepage preview
- Faculty directory preview
- Computers and Information Systems faculty preview

## Browser checks

| Test | Result | Evidence |
|---|---|---|
| Preview renders in browser | Passed | Browser page title identifies static preview |
| Homepage content hierarchy | Passed | Hero, quick access, benefits and faculty cards rendered |
| Faculty directory navigation | Passed | Directory control activated the directory view |
| CIS faculty navigation | Passed | CIS control and faculty-card links activated the representative view |
| Mobile menu interaction | Passed after fix | Menu button toggled the responsive navigation and `aria-expanded` |
| Mobile width around 390px | Passed | No horizontal overflow reported |
| Tablet width around 768px | Passed | No horizontal overflow reported |
| Desktop width around 1440px | Passed | Homepage preview rendered without overflow |
| Arabic persistence and RTL | Passed at preview level | Selecting Arabic, navigating, and refreshing preserved `lang="ar"`, `dir="rtl"` and stored locale |
| Chinese LTR | Passed at preview level | Selecting Chinese set `lang="zh-Hans"`, `dir="ltr"` and produced no overflow |
| Production Next.js build | Blocked | `next` is unavailable |

## Observed issues and fixes

### Fixed: preview mobile menu was inert

- **Affected experience:** Preview header
- **Severity:** Medium
- **HCI principle:** User control and freedom
- **Problem:** The preview-only menu button had no interaction.
- **Fix:** Added a toggle for `.nav-links.is-open` and synchronized `aria-expanded`. View navigation closes the menu.

### Not treated as a production defect: preview console 403

The browser reported a 403 during file-preview loading, but the ECU logo loaded successfully and no missing image was reported. The preview uses external ECU links only as user-activated destinations; those links were not opened as part of the local preview test. This does not establish a production console result.

## Limitations

- These are preview-level results only.
- The Next.js server, hydration, server-rendered metadata, actual App Router navigation, production CSS bundling and production console behavior remain untested.
- The preview demonstrates language direction and persistence, not full approved Arabic or Chinese institutional translations.
- Accessibility conformance is not claimed; browser-level screen-reader and full keyboard audits require the production runtime.
