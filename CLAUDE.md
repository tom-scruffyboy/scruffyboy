# scruffyboy pre-launch site — project context

Static waitlist site (no build step) for scruffyboy — grooming goods for dirty dogs,
Hong Kong, launching autumn 2026. **Live at https://scruffyboy.com** (since 17 Jul 2026;
scruffyboy-site.vercel.app still resolves). Deploy = `git push` to main
(GitHub `tom-scruffyboy/scruffyboy` → Vercel `scruffyboy-site`).

Full handover, account inventory, and new-device setup: `../07 - handover/HANDOVER.md`
(kept out of this repo on purpose). Deeper runbooks in this folder: `STACK.md` (tooling),
`KLAVIYO.md` (email machine), `UPDATES.md` (living task list — work top-down, mark done in-file).

## Session ritual — Notion is the source of truth

The **scruffyboy Ops Hub in Notion** is the single source of truth across all Claude
surfaces (Cowork, Code, Design): https://app.notion.com/p/3a06408d1af681658e4cc68442c8054f

- **START every session** by reading the Ops Hub: the Status snapshot, the Tasks board
  (what's In progress / Blocked / the current priority), and the Connectors Registry
  (what's actually live) — before touching this repo.
- **END every session** by logging what you did to the Notion **Session Log**
  (date · "Claude Code" · 2–5 terse bullets) *and* to `UPDATES.md`. If you changed a
  decision or connector status, update the matching Notion database in the same session.
- Full operating rules: https://app.notion.com/p/3a16408d1af681fdae30c124aaf2c9ba

## Hard rules before touching anything

- **Brand voice gates all copy** (full rules in `brand.html`): Fredoka display text is
  ALWAYS lowercase; body text is Helvetica sentence case; no paws/bones/pet clichés;
  no gradients; no emoji; no exclamation marks doing a joke's work; one dry joke per
  surface; deep orange #E24E17 is hover/pressed ONLY; Moose is a real dog, never a mascot.
- **GitHub identity**: this repo belongs to the `tom-scruffyboy` account. Never create
  or push scruffyboy work under any other account. The remote URL pins the username.
- **Honesty rules from UPDATES.md**: never fabricate momentum numbers. The signup
  counter (`SPOTS` in `js/signup.js`) stays hidden until TAKEN ≥ 25, updated by hand.
- **Voice: no em dashes, no AI-writing tells** in any copy (Tom's standing rule, 24 Jul).
  Titles use "page name | scruffyboy"; label microcopy uses middots.
- **Images ship right-sized**: hub thumbs are `thumb-*` (264w), homepage strip `card-*`
  (560w), department cutouts `kit-*` (400w) — generate a variant rather than reusing a
  full-size hero for a small slot. /assets/* is cached 7d, so replaced images need new
  filenames.
- **Don't put private API keys anywhere in this repo** — it's a static site; everything
  in it ships to the browser. The Klaviyo key in `signup.js` is the public site id.

## How things work

- **v3 site (shipped 20 Jul):** multi-page now — `index.html` (floating product hero,
  scroll-driven "lineup", before/after slider, field notes) plus funnel pages
  `the-kit.html`, `no-bath.html`, `the-mess.html`, `meet-moose.html`. Built in Claude
  Design, shipped via Claude Code. Imagery in `assets/` (moose-*, cut-*, photo-*, act*,
  step-*) is **AI-generated concept art**, an explicit Tom decision (overrides the "Moose
  is a real dog" default for the pre-launch teaser — confirm before assuming for future work).
  EXCEPTIONS (29 Jul): `roster-*.webp` are real applicant photos, and `roster-moose.webp`,
  `moose-jungle.webp`, `moose-kobe-rain.webp`, `moose-kobe-wet.webp` are real photos of
  Moose (apricot goldendoodle) and Kobe — prefer real photos over AI when Tom supplies them.
- `js/hero.js` (v3, defer, every page): hero parallax, lineup scrollytelling, before/after
  slider, IntersectionObserver reveals. All gated behind `prefers-reduced-motion`.
- ⚠️ **The Claude Design handoff bundles a `js/signup.js` PREVIEW SHIM that captures nothing**
  (its own header says do not deploy it — it fakes "you're on the list"). NEVER let it
  overwrite the repo's real handler. When deploying a design handoff, keep the repo's signup.js.
- `js/signup.js` (the REAL one, keep it) is the capture app: Klaviyo client-API subscribe
  (list `Umf2ZE`, double opt-in), honeypot, GA4 `generate_lead` + Meta `Lead` on success,
  redirect to `/thanks`. It also handles the testing-department application form
  (`form[data-application]`) via `api/apply.js` — the site's one serverless function
  (photo → Vercel Blob, consent enforced server-side, profile → Klaviyo via private key;
  secrets live in Vercel env vars only). Welcome flow `Rwn4mS` LIVE: immediate → +1d
  guides → +2d why-we-exist → +4d lineup. ⚠️ Flows send CLONED templates — editing
  library templates does NOT change sends; see KLAVIYO.md "27 Jul" section before
  touching flow emails. Clean URLs site-wide (`cleanUrls` in vercel.json): internal
  links have no .html; /page.html 308s to /page.
- Tags on every public page: GA4 `G-BFMJFCEQC6`, Clarity `xn770a03sp`,
  Meta Pixel `1898777770792309`. `brand.html` is untracked + noindex (internal doc).
- Tokens/design system: `css/site.css` top block, sourced from the Claude Design
  project "scruffyboy design system" (see `.design-sync/config.json`).
- Test signups: use `te+something@hvngroup.co` and DON'T click the confirm email
  (double opt-in keeps unconfirmed signups out of the list — this keeps counts clean).

## Machine quirks

- Local dev servers can't read this Google Drive folder (macOS TCC) — mirror to a
  local temp dir to serve locally, or just push and use Vercel preview deploys.
  `.claude/launch.json` may contain a stale machine-specific mirror path.
- Domain scruffyboy.com is LIVE (bought 17 Jul 2026; **registrar GoDaddy** — the NameBright
  nameservers it arrived with were the previous owner's and are gone). **All DNS is managed
  in Vercel**, not at GoDaddy — add records there. Domain-day items are ALL DONE (verified
  27 Jul): send.scruffyboy.com sending domain active + verified, all emails send as
  scruffyboy <hello@scruffyboy.com>, www → apex 308s, root has Google MX so hello@
  receives. See `STACK.md` + `KLAVIYO.md`.
