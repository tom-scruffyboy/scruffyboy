# scruffyboy site — open update requests

Source: Competitive & Trend Analysis v1.0 (Google Drive, "06 - competitive & trends"), reviewed 16 Jul 2026 against the live page at scruffyboy.vercel.app. Re-generated weekly — check that doc for the latest before starting work, in case this list is stale.

Work through in priority order. Mark items done here (or delete them) as you ship them so this stays a live task list, not an archive.

## Quick wins (do first — low effort, current page)

- [x] **Signup counter** (Jul 16). Shipped as a manually-updated counter under both email forms — a live pull isn't possible from a static site (Klaviyo list counts need a private key; would require a serverless function + secret). To update: edit `SPOTS.TAKEN` at the top of `js/signup.js`. Deliberately hidden until TAKEN ≥ 25 (`SHOW_AT`) — "3 of 500" reads worse than no counter, and the same doc's "honest momentum" rule forbids inventing a number. Currently 0 → hidden.
- [x] **Secondary CTA / social link** (Jul 16). Handle confirmed with Tom: **@scruffyboyclean**. "or follow along on instagram →" under the hero form + an instagram link in every page footer.
- [x] **Real date** (Jul 16). Tom confirmed **autumn 2026** — swapped into the announcement bar, title/meta/OG tags, marquee, and the FAQ answer (HTML + FAQPage structured data).
- [x] **Founder voice line** (Jul 16). Tom's copy, verbatim: "i built this for the dirty dogs who love to play but also love the couch." — added to the Moose section with an orange rule and "— tom, founder" attribution.

## From the 17 Jul deep analysis (full report: `06 - competitive & trends/Deep DTC analysis — 17 Jul 2026.md`)

Proposed from a 16-site DTC teardown + waitlist-conversion research. Tom to confirm priority before shipping anything marked (needs Tom).

- [ ] **Thank-you page share ask** (stage 1 of referral). thanks.html + confirmed.html are dead ends; sharing intent peaks right after signup (Harry's: 77% of signups came via referral, asked post-signup). Add WhatsApp share + copy-link buttons to both pages. Free, static-safe, no tracking needed to start.
- [ ] **Make thanks.html work harder for the confirm click.** Double opt-in typically loses ~20% at the confirmation step — the "check your inbox" message should be the loudest thing on the page. (Whether to drop double opt-in entirely is a Tom decision — deliverability + clean counts vs list-building speed.)
- [ ] **Ingredient / "never in it" transparency section** (needs Tom: formulation facts). The pre-launch review-substitute in pet grooming — Rowan/Dr Lisa/Pride+Groom all lead with it. Even the never-list alone works if the INCI isn't final.
- [ ] **Founder story upgrade** (needs Tom: one photo + a few sentences). Photo of Tom + Moose and a short "why I built this" — founder-forward pages convert 15–28% higher than a bare quote.
- [ ] **Incentive stack — copy only.** "first dibs" currently = founder pricing only. Add early access ("the list shops 48h before anyone"); consider a small founding-member gift later (pet data: gift converts better than discount, 22.5% vs 18%).
- [ ] **"which mess is your dog?" quiz.** The three tiles are already the answers (trail mud / beach salt / whatever that was) → email gate → store answer as Klaviyo profile property for segmented launch flows. Quizzes capture 40–60% vs ~3% for plain forms. Pure static JS.
- [ ] **Referral queue, stage 2** (upgrade of existing referral item below). Note: Vercel serverless functions (`/api/*`) can hold the private Klaviyo key as an env var — this unblocks both the live counter and an in-house referral queue; alternatively Viral Loops/KickoffLabs/LaunchList are turnkey. The "static site can't do it" constraint only applies to the static bundle, not the platform.
- [ ] **Counter framing when it turns on:** "x of 500 founding spots claimed" (cohort/scarcity framing works at small numbers) rather than a bare count. No change needed while hidden.
- [ ] **Exit-intent capture — maybe.** ~4% recovery, Klaviyo forms do it code-free, but it's the most off-brand pattern on the list. One popup max, in voice, or skip it.
- [ ] **WhatsApp opt-in channel — parked.** HK's channel is WhatsApp, not SMS/email, but a business number + tooling is post-launch scale. The share button above is the cheap first step.

## Near-term (once there's traction to show)

- [ ] **Referral mechanic.** "Move up the list" for each friend referred — even a simple unique-link version. This was the single biggest lever in comparable waitlist launches (Robinhood).
- [ ] **Product-in-use video/GIF.** Replace or supplement the static hero photo (photo-shake.jpg) with a short (10-15s) clip of a product actually being used, once test units exist to film.
- [ ] **Honest momentum signal.** Real follower or signup count pulled from Instagram or the Klaviyo list — don't fabricate a number.

## Post-launch (once Shopify goes live with real products)

- [ ] Sticky add-to-cart + one-thumb mobile checkout flow.
- [ ] Review density surfaced prominently on product pages once reviews exist (not buried below the fold).
- [ ] Swipe-friendly product image galleries on mobile.

## Known separate issues (not from this doc, but still open)

- [ ] Confirm scruffyboy.com is purchased and DNS points at this Vercel project before removing scruffyboy.vercel.app references anywhere.
- [ ] "The hydrant" product name — confirm with Tom whether it survives now that the device design is basic/simplified, before it appears anywhere customer-facing.
