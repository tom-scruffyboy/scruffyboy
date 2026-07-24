# scruffyboy site — open update requests

Source: Competitive & Trend Analysis v1.0 (Google Drive, "06 - competitive & trends"), reviewed 16 Jul 2026 against the live page at scruffyboy.vercel.app. Re-generated weekly — check that doc for the latest before starting work, in case this list is stale.

Work through in priority order. Mark items done here (or delete them) as you ship them so this stays a live task list, not an archive.

## Quick wins (do first — low effort, current page)

- [x] **Signup counter** (Jul 16). Shipped as a manually-updated counter under both email forms — a live pull isn't possible from a static site (Klaviyo list counts need a private key; would require a serverless function + secret). To update: edit `SPOTS.TAKEN` at the top of `js/signup.js`. Deliberately hidden until TAKEN ≥ 25 (`SHOW_AT`) — "3 of 500" reads worse than no counter, and the same doc's "honest momentum" rule forbids inventing a number. Currently 0 → hidden.
- [x] **Secondary CTA / social link** (Jul 16). Handle confirmed with Tom: **@scruffyboyclean**. "or follow along on instagram →" under the hero form + an instagram link in every page footer.
- [x] **Real date** (Jul 16). Tom confirmed **autumn 2026** — swapped into the announcement bar, title/meta/OG tags, marquee, and the FAQ answer (HTML + FAQPage structured data).
- [x] **Founder voice line** (Jul 16). Tom's copy, verbatim: "i built this for the dirty dogs who love to play but also love the couch." — added to the Moose section with an orange rule and "— tom, founder" attribution.

## v3 redesign shipped (20 Jul)

Claude Design v3 handoff deployed live (commit a040402): floating product hero, scroll-driven
6-product "lineup", before/after drag slider, field-notes strip, 4 new funnel pages
(the-kit / no-bath / the-mess / meet-moose), new `js/hero.js`. All imagery is AI-generated
concept art (Tom's approved call). Verified live: all pages 200, analytics intact, signup
posts to Klaviyo (curl-confirmed HTTP 202 — the browser's ad-blocker faked a failure), mobile OK.
Kept the real Klaviyo signup.js — the bundle's was a no-op preview shim.

Open follow-ups from the deploy:
- [x] ~~Funnel pages nav-orphans + not in sitemap.~~ **Indexing sorted (24 Jul, commit edafee1).**
  Tom's call: index all 4. Flipped noindex→index on the-kit/no-bath/the-mess/meet-moose, added
  each to sitemap.xml (now 6 URLs, fresh lastmod). Added canonical + OG/Twitter cards to all 4.
  Search Console: meet-moose + the-mess **request-indexed** (priority crawl queue); no-bath +
  the-kit rely on the registered sitemap for discovery (GSC UI too flaky to force the last two —
  request them manually in ~30s each if you want to accelerate). NOTE: pages are still only
  reachable in-site via anchor nav (#range/#moose) — no header link TO the standalone pages.
  If you want in-site navigation to them, that's a separate small change.
- [ ] **9 unused PNGs shipped** (~13MB: act2-*, photo-*-01, moose-mud-floor) — referenced by nothing. Prune if not needed.
- [x] ~~title/meta length~~ **fixed 24 Jul**: index title 68→42ch, meta description 214→149ch;
  funnel-page descriptions trimmed to ~130-145ch; added PostalAddress (HK) to Organization JSON-LD.
- [ ] **Still open (perf SEO, not yet done):** images→WebP/AVIF (the v3 PNGs are large — moose-*/act* are 2-2.8MB each), and deferring the analytics stack (253KB) to first-interaction/idle. These are the remaining items from the 20 Jul SEO audit.
- [ ] Analytics: GA4/Clarity/Meta verified present on all 9 pages — no gaps, no change needed.
- [ ] Test pending-profiles from verification (te+v3curltest@, te+v3deploytest@) — unconfirmed, harmless; delete from Klaviyo if tidying.

## From the 20 Jul SEO audit (full report: `06 - competitive & trends/SEO audit — 20 Jul 2026.md`)

Site is technically clean — these are real but mostly small. The big one is #1.

- [x] ~~**Remove the dead Stape tag.**~~ **WITHDRAWN 20 Jul — this was wrong, do NOT delete it.**
  The "503 on every page load" was measured through a Chrome profile with an ad-blocker
  extension. Re-tested from a clean browser: `ap.stape.info/events/…` returns **200**. It's a
  healthy Meta CAPI (server-side) gateway wired into the pixel config in Meta Events Manager,
  not the repo. Deleting it would have broken server-side ads measurement. Same root cause as
  the earlier GA4 "503" false alarm — see HANDOVER §3.
- [ ] **Cut the analytics tax.** Third-party scripts are **253KB of the 423KB page**; full load 5.07s (the site itself is fine — TTFB 713ms). Meta Pixel alone is 103KB, heavier than the hero photo; Clarity makes 4 requests and its tag took 3.1s even on a clean connection. Defer analytics to first-interaction/idle. *(Weight + timings were measured in a clean, extension-free browser, so these numbers stand — unlike the 503s above.)*
- [ ] **Trim title + meta description.** Title is 66 chars (truncates ~60); description 164 (truncates ~155).
- [ ] **Images → WebP/AVIF.** Hero 169KB, boot 159KB, raw JPEG, no `srcset`. ~50–70% saving on the LCP image.
- [ ] **Organization schema:** add `PostalAddress` (HK); swap `logo` from favicon.svg to a 512px PNG (Google's logo guidance favours raster).
- [ ] Mobile nits: Privacy link is 14×38px; marquee text is 11px. Bump both.
- [ ] **Note: FAQPage schema is now inert.** Google retired FAQ rich results (docs removed 15 Jun 2026). Harmless to keep — just don't count it as a win.
- [ ] **Bing Webmaster Tools** — one-click import from GSC, covers Bing + Yahoo HK (~6%; Yahoo HK is Bing-powered).
- [ ] **Skip permanently:** Google Business Profile (ineligible — online-only), hreflang, HowTo schema, LocalBusiness schema, Baidu, HK directory listings.

**The strategic finding:** the site is 2 indexable pages / ~757 words. It cannot rank for
anything but the brand name. The uncontested wedge is the **post-adventure cleanup cluster**
— HK publishers own "where to take your dog" and have entirely ceded "what to do with the
filthy dog afterwards." Purest whitespace: `how to dry a dog in humid weather` (no content
exists anywhere). Sleepers: the non-gazetted beaches rule and the 20kg leash law — the two
most-cited HK dog facts with no definitive page. Write symptom-led, not category-led.
**Caveat: content now is a 2027–28 asset, not an autumn-2026 one** — the referral mechanic
is what pays out at launch.

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
- [ ] **Social cards are live and public** (Jul 20). 28 PNGs pushed to `assets/social/` — they ship with the site, so the whole 30-day calendar is fetchable at `scruffyboy.com/assets/social/*.png` and sits in public git history. Tom okayed this knowingly. If the drip order ever matters, the fix is `.vercelignore` (keeps them off the domain, still public on GitHub) or moving them out of the repo entirely — deleting later won't unpublish. Still to do: attach them to the 120 draft rows in the Content Calendar DB and schedule to Postiz.
