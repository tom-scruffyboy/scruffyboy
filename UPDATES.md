# scruffyboy site — open update requests

Source: Competitive & Trend Analysis v1.0 (Google Drive, "06 - competitive & trends"), reviewed 16 Jul 2026 against the live page at scruffyboy.vercel.app. Re-generated weekly — check that doc for the latest before starting work, in case this list is stale.

Work through in priority order. Mark items done here (or delete them) as you ship them so this stays a live task list, not an archive.

## Quick wins (do first — low effort, current page)

- [x] **Signup counter** (Jul 16). Shipped as a manually-updated counter under both email forms — a live pull isn't possible from a static site (Klaviyo list counts need a private key; would require a serverless function + secret). To update: edit `SPOTS.TAKEN` at the top of `js/signup.js`. Deliberately hidden until TAKEN ≥ 25 (`SHOW_AT`) — "3 of 500" reads worse than no counter, and the same doc's "honest momentum" rule forbids inventing a number. Currently 0 → hidden.
- [x] **Secondary CTA / social link** (Jul 16). Handle confirmed with Tom: **@scruffyboyclean**. "or follow along on instagram →" under the hero form + an instagram link in every page footer.
- [x] **Real date** (Jul 16). Tom confirmed **autumn 2026** — swapped into the announcement bar, title/meta/OG tags, marquee, and the FAQ answer (HTML + FAQPage structured data).
- [x] **Founder voice line** (Jul 16). Tom's copy, verbatim: "i built this for the dirty dogs who love to play but also love the couch." — added to the Moose section with an orange rule and "— tom, founder" attribution.

## 24 Jul — ecommerce / ads / search optimisation batch (shipped)

Seven of eight quick-win items shipped and live. Commits: 50956ba (perf+ads), 978b48a (content+policy).
- [x] **Images → WebP.** 29 PNGs converted, assets **49MB → 2.5MB (−95%)**. og/twitter images use JPG (WebP breaks LinkedIn/iMessage previews); on-page = WebP. Source PNGs removed from deploy (originals in the handoff zip). Preconnects added for GTM/Facebook, dns-prefetch for Clarity/Klaviyo. (Analytics scripts are already `async`/non-blocking — did NOT aggressively defer them; risk of undercounting > the gain now images are fixed.)
- [x] **Ads-ready tracking.** Meta Advanced Matching (hashed email on signup Lead), ViewContent on the 4 funnel pages, GA4 `cta_click` + outbound-click events. Real Klaviyo signup.js otherwise intact.
- [x] **Raster favicon set** (Fredoka mark): favicon-32 / apple-touch-icon-180 / icon-192 / icon-512; manifest + Organization-schema logo now raster.
- [x] **Internal linking.** Every footer links all funnel pages + guides + policies (were nav-orphans).
- [x] **Guides section (the discovery play) — now 5 articles + imagery.** guides.html hub + FIVE on-brand BlogPosting articles targeting the audit's whitespace, all indexed, internally cross-linked, with product CTAs, and each with an on-brand hero image (WebP from the approved v3 Moose library; og-images JPG for LinkedIn/iMessage):
  1. `clean-a-dog-without-a-bath.html` (~935w) — waterless method → no-bath
  2. `drying-a-dog-in-humid-weather.html` (~1040w) — ZERO competing content anywhere
  3. `dog-still-smells-after-a-bath.html` (~790w) — problem-aware → funk fix
  4. `clean-dog-paws-after-the-beach.html` (~850w) — HK post-adventure wedge
  5. `hiking-hong-kong-with-your-dog.html` (~780w) — HK adventure → the-mess
  Sitemap now **12 URLs**. Drying guide request-indexed in GSC; the rest discovered via the registered sitemap.
  **Pipeline queued for next batches:** which HK beaches allow dogs (the non-gazetted rule); how to get mud off a dog fast; sand & salt out of the coat; the between-grooms routine. (Higgsfield available for bespoke net-new imagery if the reused v3 library gets stale.)
- [x] **Shipping + returns pages.** On-brand, honest, **noindex until Tom signs off the terms** — return window (assumed 30d) + who pays return postage (assumed customer on change-of-mind, us on faults) flagged in HTML comments. Required by Google Merchant Center at launch.
- [ ] **Account-level ads/Merchant prep — NEEDS TOM (I can't do these):**
  - **Google Merchant Center** — I'm not allowed to create accounts. Tom creates it + claims scruffyboy.com. Site is already MC-ready (policy pages, HTTPS, structured data). Can't list products until they're live anyway.
  - [x] **Meta domain verification — DONE 24 Jul.** scruffyboy.com added to the Scruffyboy business portfolio (id 2012079115936384) → Brand safety → Domains, verified via meta-tag (`facebook-domain-verification` in index.html head, committed). Shows "Verified". Optional next step when ads start: configure Aggregated Event Measurement (the 8 prioritised conversion events) on the domain + connect it to the pixel/ad account.
  - **Consent Mode v2 / banner** — held: only needed before EU/UK ad spend (STACK.md deliberately skipped a banner for HK launch scope). Decide when ads target EU/UK.
  - **Bing Webmaster Tools** — one-click GSC import (covers Bing + Yahoo HK ~6%); needs Tom's Microsoft login.

## 24 Jul (later) — guides globalised + two industry guides (shipped, commit 6b8ecaf)

Tom's steer: **"we are selling globally"** — stop making the content Hong Kong-focused.
Plus the new content direction: talk about **what's wrong with mainstream pet cleaning products**.
- [x] **De-localised all existing guides.** Dropped HK-specific framing (Dragon's Back / Shek O / "built and tested in Hong Kong" / "· Hong Kong" captions) for universal coast/trail/mountain language. Brand *origin* ("est. hong kong" in the footer) deliberately kept — that's identity, not content targeting.
- [x] **Replaced the HK hiking guide with a global one.** `hiking-hong-kong-with-your-dog.html` → `hiking-with-your-dog.html` (universal heat/water/wildlife/leash advice + the cleanup order). Old URL **308-redirects** to the new one via `vercel.json` (first redirect rule in the repo) so nothing 404s or loses link equity.
- [x] **New guide — `what-to-look-for-in-dog-shampoo.html`** (~780w). Label/ingredient education: pH-for-dogs, surfactants (SLS vs glucosides), fragrance/dye, unregulated "natural/organic/vet-approved" claims. Accurate + fair, no brand names, no health scares. Funnels to the range and the aisle POV.
- [x] **New guide — `the-pet-grooming-aisle.html`** (~800w). Category point-of-view: the aisle is built around the full bath + baby-talk branding + one-size formulas, and ignores the between-grooms reality. Explicitly fair ("to be fair… good honest products exist"), critiques *focus* not safety. This is the brand-manifesto piece.
- [x] Hub now lists **7 guides** (was 5); CollectionPage JSON-LD + all cards updated. Sitemap **12 → 14 URLs**. Both new guides have hero imagery (act-box flatlay / moose-mud-car) + the orange signup CTA block, which was also back-filled into all five earlier guides this session.
- Validated: all JSON-LD parses, every internal link/image resolves, live 200s confirmed + redirect confirmed.
- **Pipeline still queued:** how to get mud off a dog fast; sand & salt out of the coat; the between-grooms routine; which beaches/parks allow dogs (now framed globally, not HK-only).

## 24 Jul (later still) — voice de-slop + two more guides (shipped)

Tom's steer: the guides should not read as AI-written. New standing rule saved to memory:
plain human voice, **no em dashes**, no AI-slop tells (no "here's the thing", no forced
rule-of-three, no "not X but Y", no "to be fair" filler). Emojis were already banned by brand.
- [x] **De-slopped all 8 existing guides + the hub.** Per-sentence rewrites (not find/replace) to strip every em dash and the AI tells. Facts, links, analytics, JSON-LD and structure preserved. Verified: 0 em dashes, JSON parses, no broken links on all 9 pages. (Ran as 7 parallel sub-agents, one per guide, then independently checked.)
- [x] **Stripped footer em dashes site-wide** (all 20 pages): tagline now uses a comma, the est. line a middot. This was Tom's call to make the no-em-dash rule brand-wide for the footer template.
- [x] **New guide — `how-often-should-you-bathe-your-dog.html`.** Probably the highest-demand query in the cluster; reinforces the whole "bathe less, clean between more" thesis. Clean voice from the start.
- [x] **New guide — `how-to-get-mud-off-a-dog.html`.** High-intent, product-adjacent (let it dry, brush, spot-clean, keep a kit in the car). Clean voice.
- Hub now lists **9 guides**; sitemap **15 → 16 URLs**. Both new guides have hero imagery + CTA.
- [ ] **FOLLOW-UP for Tom's call:** `index.html` and the 4 funnel pages (the-kit / no-bath / the-mess / meet-moose) still have em dashes + some slop in their **body** copy (footers are fixed). The homepage is the most-seen page, so it matters most for the "don't look AI-written" goal. Not done yet — awaiting go-ahead, since it means rewriting live homepage/landing copy.
- **Guide pipeline still queued:** sand & salt out of the coat; muddy dog in the car / keeping the car clean; the between-grooms routine; which parks/beaches allow dogs (global framing).

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
- [x] ~~images→WebP~~ **DONE 24 Jul** (49MB→2.5MB). Analytics deferral: decided AGAINST (scripts already async/non-blocking; deferral risks undercounting). See 24 Jul batch above.
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
- [x] ~~Trim title + meta~~ **DONE 24 Jul** (title 42ch, desc 149ch).
- [x] ~~Images → WebP~~ **DONE 24 Jul** — all v3 imagery converted (−95%).
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
