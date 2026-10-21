# Multilingual RTL/LTR

The application supports English (`/en`), Arabic (`/ar`) and Simplified Chinese (`/zh`) route prefixes through `middleware.js`. The middleware rewrites the prefixed route to the existing App Router page, persists the locale in an `ecu-locale` cookie, and the shared header applies the correct `lang` and `dir` values.

Interface translations are maintained in `lib/translations.js`. The homepage and shared navigation have translated interface copy. Verified institutional records remain English because the source dataset does not contain approved Arabic or Simplified Chinese editorial translations. Do not present machine or provisional translations as ECU-approved content.

Arabic uses RTL layout. Chinese uses `zh-Hans` and LTR layout. CSS uses logical properties and includes Arabic/CJK font fallbacks. Language-aware date and number formatting should be added when dated localized records are approved.

Current translation coverage is intentionally partial:

| Surface | English | Arabic UI | Chinese UI | Institutional content |
|---|---:|---:|---:|---:|
| Shared navigation and locale control | Complete | Complete | Complete | N/A |
| Homepage interface labels | Complete | Complete | Complete | English source records |
| Search, programmes, admissions, services | Complete | Provisional shell only | Provisional shell only | English source records |
| Faculty, news, research and contact records | Complete | Not approved | Not approved | English source records |
