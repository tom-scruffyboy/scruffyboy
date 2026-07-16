# design-sync notes — scruffyboy design system

## Nature of this sync (off the converter's rails, deliberately)
- This folder is a **website output folder**, not a design-system code repo. There is no `package.json`, `dist/`, or Storybook — the `/design-sync` converter cannot run here.
- The design system was populated from **`Scruffyboy Brand Guidelines-handoff.zip`**, a Claude Design handoff export that already contains the DS in (near) upload format.
- Because there is no build to grade against, verification was **static** (see below) plus visual review in the Claude Design app after upload, rather than the converter's screenshot-grading loop.
- No `_ds_sync.json` anchor was written (can't compute the converter's hash recipe for this shape). Consequence: a future sync re-verifies everything, which is correct.

## What was uploaded (the reusable DS only)
- `README.md` (from the export's `readme.md`), `SKILL.md`
- `styles.css` + `tokens/{colors,fonts,typography,spacing}.css`
- `ds-loader.js` (compiles the `.jsx` sources to the namespace; falls back to unpkg Babel if the app hasn't compiled `_ds_bundle.js`)
- `components/{brand,core,commerce,navigation}/**` — 14 components, each `.jsx`/`.d.ts`/`.prompt.md`, plus the group `*.card.html` previews (`@dsCard` markers)
- `guidelines/*.card.html` (9 foundation specimen cards)
- `ui_kits/website/{index.html,README.md}` (storefront reference, `@dsCard` + `@startingPoint`)
- `assets/photo-{shake,boot,trail}.jpg` (the only assets referenced by any card)

## Deliberately OMITTED (not part of the reusable DS)
- `assets/*.png` (~8.7MB, unreferenced — only the `.jpg` variants are used by cards)
- `canva/**`, `uploads/**` (marketing outputs / pasted images — no DS card references them)
- `Brand Guidelines.dc.html`, `Logo Directions.dc.html`, `doc-page.js`, `support.js`, `.thumbnail` (the doc-page/`x-dc` prototype runtime — the guidelines are already captured as `guidelines/*.card.html`)
- `CLAUDE.md` (coding-agent file; its content is fully covered by `README.md`)
- Note: `README.md`/`CLAUDE.md` in the export carry provenance references to some omitted files (`Brand Guidelines.dc.html`, `canva/`) — informational only, not broken cards.

## Static verification run before upload (all passed)
- All 14 components export cleanly; every `.card.html` / ui_kit destructure resolves to an export.
- Every `src=` asset referenced by a card exists.
- `styles.css` `@import` targets all resolve.
- Every component `.jsx` has a matching `.d.ts` and `.prompt.md`.

## Cards load React/ReactDOM/Babel from unpkg (external CDN)
- Same as the source Claude Design project, which renders these cards fine. If the app's card sandbox ever blocks external CDNs, a compiled `_ds_bundle.js` would remove the Babel dependency (ds-loader prefers it when present).
