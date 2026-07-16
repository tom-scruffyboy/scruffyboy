# scruffyboy site — open update requests

Source: Competitive & Trend Analysis v1.0 (Google Drive, "06 - competitive & trends"), reviewed 16 Jul 2026 against the live page at scruffyboy.vercel.app. Re-generated weekly — check that doc for the latest before starting work, in case this list is stale.

Work through in priority order. Mark items done here (or delete them) as you ship them so this stays a live task list, not an archive.

## Quick wins (do first — low effort, current page)

- [x] **Signup counter** (Jul 16). Shipped as a manually-updated counter under both email forms — a live pull isn't possible from a static site (Klaviyo list counts need a private key; would require a serverless function + secret). To update: edit `SPOTS.TAKEN` at the top of `js/signup.js`. Deliberately hidden until TAKEN ≥ 25 (`SHOW_AT`) — "3 of 500" reads worse than no counter, and the same doc's "honest momentum" rule forbids inventing a number. Currently 0 → hidden.
- [x] **Secondary CTA / social link** (Jul 16). Handle confirmed with Tom: **@scruffyboyclean**. "or follow along on instagram →" under the hero form + an instagram link in every page footer.
- [x] **Real date** (Jul 16). Tom confirmed **autumn 2026** — swapped into the announcement bar, title/meta/OG tags, marquee, and the FAQ answer (HTML + FAQPage structured data).
- [x] **Founder voice line** (Jul 16). Tom's copy, verbatim: "i built this for the dirty dogs who love to play but also love the couch." — added to the Moose section with an orange rule and "— tom, founder" attribution.

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
