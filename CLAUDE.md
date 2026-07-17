# scruffyboy pre-launch site — project context

Static waitlist site (no build step) for scruffyboy — grooming goods for dirty dogs,
Hong Kong, launching autumn 2026. Live at https://scruffyboy-site.vercel.app.
Deploy = `git push` to main (GitHub `tom-scruffyboy/scruffyboy` → Vercel `scruffyboy-site`).

Full handover, account inventory, and new-device setup: `../07 - handover/HANDOVER.md`
(kept out of this repo on purpose). Deeper runbooks in this folder: `STACK.md` (tooling),
`KLAVIYO.md` (email machine), `UPDATES.md` (living task list — work top-down, mark done in-file).

## Hard rules before touching anything

- **Brand voice gates all copy** (full rules in `brand.html`): Fredoka display text is
  ALWAYS lowercase; body text is Helvetica sentence case; no paws/bones/pet clichés;
  no gradients; no emoji; no exclamation marks doing a joke's work; one dry joke per
  surface; deep orange #E24E17 is hover/pressed ONLY; Moose is a real dog, never a mascot.
- **GitHub identity**: this repo belongs to the `tom-scruffyboy` account. Never create
  or push scruffyboy work under any other account. The remote URL pins the username.
- **Honesty rules from UPDATES.md**: never fabricate momentum numbers. The signup
  counter (`SPOTS` in `js/signup.js`) stays hidden until TAKEN ≥ 25, updated by hand.
- **Don't put private API keys anywhere in this repo** — it's a static site; everything
  in it ships to the browser. The Klaviyo key in `signup.js` is the public site id.

## How things work

- `js/signup.js` is the entire app: Klaviyo client-API subscribe (list `Umf2ZE`,
  double opt-in), honeypot, GA4 `generate_lead` + Meta `Lead` on success, redirect to
  `thanks.html`. Confirmation email/success page are branded in Klaviyo (list-specific
  consent pages). Welcome flow `Rwn4mS` is LIVE: immediate → day 3 → day 7.
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
- Domain scruffyboy.com not purchased yet; on purchase, run the domain-day checklist
  in `STACK.md` (Vercel domain, Search Console, Klaviyo sending domain, hello@ mailbox).
