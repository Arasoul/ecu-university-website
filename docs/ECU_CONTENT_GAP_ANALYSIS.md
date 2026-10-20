# ECU Content Gap Analysis

_Review date: 20 October 2026_

## Scope and source policy

This audit covers the source currently available in the workspace and the public ECU pages referenced by the implementation. It does not treat placeholder copy, an empty state, or an unverified third-party claim as institutional content. Academic claims should be refreshed against the university before publication.

The primary source used by the existing implementation is the [official ECU website](https://ecu.edu.eg/). Faculty and admissions links in the code are retained as source references. No downloaded ECU content export, CMS feed, approved campus photography, or editorial translation package is present in `public/` or the project data files.

## Feature audit

| Area | Status | Existing implementation | Available verified information | Gap and priority |
|---|---|---|---|---|
| Homepage | Implemented, needs improvement | `app/page.js`, `app/globals.css`, `app/home.css` | University name, faculty selection, admissions/research source links, two campus addresses | News, events, achievements, partnerships and campus-life content are absent. P0: approve a complete homepage content model. Red/grey/white system now applied. |
| Global navigation/footer | Partially implemented | Homepage header/footer | Faculty, admissions, research and official-site links | Faculty routes do not share the homepage header; several quick links point to the ECU homepage rather than a matching local route. P0: establish shared navigation and explicit external-link labels. |
| Faculties | Partially implemented | `lib/faculties.js`, `/faculties`, reusable cards | 12 directory entries and source URLs; four homepage-featured entries | Only three faculty groups currently have published programme data in the local model. P0: reconcile every entry against the current official directory and obtain approved summaries. |
| Faculty details | Implemented shell | `app/faculties/[slug]/page.js` | Verified summaries/programmes where present | Departments, staff, facilities, research, achievements, events and contact details are intentionally pending. P0: add only administrator-approved records. |
| Academic programmes | Partially implemented | `components/ProgrammeList.js`, `app/programmes.css` | Engineering, Economics and CIS study areas currently recorded | No programme detail route, degree level, requirements, duration, fees or academic-year metadata. P0: provide a dated programme catalogue. |
| Admissions | Local page plus authorized application integration | `/admissions`, official admissions destination | Requirements topic summary and official application source | Deadlines, documents, scholarships and international guidance are not fully locally represented. P0: approve admissions content and application links. |
| Continuing education | Missing | Quick link only | No local source record | Need programme names, eligibility, dates, fees and registration destination. P1; do not publish until supplied. |
| Achievements | Missing | No route or data model | No approved records in workspace | Need award title, recipient, date, category, source and image permissions. P1. |
| News/events | Route implemented, content pending | `/news-events`, source-linked empty state | Official news destination, but no approved local feed or dated records | Need CMS/feed access, publication dates, event status, registration links and expired-event handling. P0. |
| Research/innovation | Route implemented, content partial | `/research`, source-backed objectives | Official research-plan objectives | Need centers, projects, publications, contacts and dates verified by ECU. P1. |
| About ECU | Route implemented, content partial | `/about`, source/status panels | University name, public profile language and source links | Need approved identity, mission, vision, history, leadership, facilities and partnerships. P0. |
| Digital services | Contact route implemented, records pending | `/contact`, verified branches and source link | Two campus addresses and official-site pathway | Need service names, URLs, audience, authentication expectations and support contacts. P1. |
| Search | Missing | No search control or route | None | Needs an approved searchable content source and accessible empty/error states. P1. |
| Multilingual | Partial shared UI | Shared `SiteHeader` and client locale persistence | English controls plus Arabic and Chinese labels; `lang`/`dir` updates | No reviewed full-page Arabic/Chinese editorial content or locale-prefixed metadata. P0: approve translations and locale architecture. |
| Accessibility/responsiveness | Source-level partial | Skip link, focus styles, logical CSS, mobile menu | Static implementation evidence | Browser validation, contrast audit, keyboard traversal and screen-reader checks remain blocked by missing dependencies. P0 before release. |

## Required administrator input

1. Current faculty directory, names, descriptions, departments, contacts and programme catalogue, including academic year and degree level.
2. Admissions requirements for Egyptian, Arab and international applicants, deadlines, tuition, scholarships, documents and official application URLs.
3. Approved English, Arabic and Simplified Chinese editorial content, including the preferred terminology for faculty and programme names.
4. Approved photographs, logos, image licenses, captions, alt text and usage scope.
5. Current news, events, achievements, research, partnerships, student-life and continuing-education records with publication dates and source URLs.
6. Official digital-service links and support ownership for student portal, LMS, library and staff services.
7. Confirmation of campus addresses, contact channels, social accounts, emergency information and privacy/legal copy.

## HCI findings and priorities

| Finding | Principle | Severity | Action |
|---|---|---|---|
| Users can reach faculty detail pages but lose the site-wide navigation context | Consistency and standards | High | Add a shared header/footer to directory and detail routes. |
| Quick links labelled Scholarships, Student services and Continuing education currently resolve to generic ECU pages | Match with the real world; error prevention | High | Replace with verified destination URLs or a clearly labelled “Official ECU website” link. |
| Language selection changes homepage labels but not the complete information architecture or content | Match with the real world | High | Add reviewed locale content and preserve language across navigation. |
| Unpublished faculty areas are presented as a long list of repeated states | Aesthetic/minimalist design; recognition | Medium | Keep one concise verification state and add optional sections only when data exists. |
| Faculty cards and programme cards have no imagery, metadata dates or filtering | Recognition rather than recall | Medium | Add approved metadata and discovery filters after content approval. |

## Completion rule

“Verified” means confirmed against a current authoritative ECU source or an administrator-approved content record. Until then, the implementation should show a source link or an explicit unavailable state rather than infer or invent institutional information.

## Phase 8 stabilization notes

- Runtime recovery remains blocked; exact IT requirements are recorded in [docs/IT_ENVIRONMENT_BLOCKER.md](./IT_ENVIRONMENT_BLOCKER.md).
- Public route coverage now includes About, Admissions, News/Events, Research, Contact/Services, Faculties and faculty details.
- No visual QA report is created because no browser rendering was performed.
