# Accessibility

Milestone 3 interaction requirements:

- The admissions certificate selector uses `role="tablist"`, roving `tabIndex`, `aria-selected`, `aria-controls`, and Arrow-key movement.
- Native links, buttons, inputs, selects and disclosure elements are used for search, filtering, comparison, FAQs and checklist actions.
- Checklist progress is stored only in the visitor’s browser and never uploaded.
- The layout includes visible focus styling, skip-link support, responsive reflow, and reduced-motion handling.
- Search result counts use a live region.

Remaining manual verification: screen-reader announcements, contrast sampling at every responsive state, and end-to-end keyboard traversal in a production browser still require a dependency-enabled preview.
