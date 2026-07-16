# scruffyboy — stack & tooling roadmap

What's wired up now, what turns on at each phase, and the decisions already made.
Companion to `KLAVIYO.md` (email machine runbook).

## Live now (pre-launch)

| Layer | Choice | Status / IDs |
|---|---|---|
| Site | Static HTML/CSS/JS, design-system tokens | this folder — deploy-ready |
| Email capture | Klaviyo client API, double opt-in | list `Umf2ZE`, key `Wv94NM` — verified |
| Welcome flow | 3 templates built, flow assembled by hand | `KLAVIYO.md` checklist |
| Analytics | GA4 `G-BFMJFCEQC6` on all public pages | `generate_lead` event fires on signup (hero vs footer via `method`) |
| SEO | robots.txt, sitemap.xml, OG/Twitter cards, Organization + WebSite + FAQPage structured data | brand.html and conversion pages are noindex |
| Heatmaps / replays | Microsoft Clarity `xn770a03sp` on all public pages | inputs masked by Clarity's default; disclosed on privacy page |
| Ads measurement | Meta Pixel `1898777770792309` on all public pages | `Lead` standard event fires on signup; disclosed on privacy page |

### GA4 events to configure in the GA UI (one-time)
- Mark **generate_lead** as a *key event* (Admin → Events). It fires on successful signup with `method` = "hero form" / "footer form" — this is your conversion metric and A/B signal.
- `thanks.html` page_view = submitted; `confirmed.html` page_view = double-opt-in completed. The gap between them is your confirmation drop-off rate.

## At domain purchase (do these the same day)

1. Point `scruffyboy.co` at the host; set the **canonical/OG URLs** are already written for it.
2. **Google Search Console**: verify the domain (DNS TXT), submit `sitemap.xml`.
3. **Klaviyo dedicated sending domain** (send.scruffyboy.co) + set sender name to scruffyboy — single biggest deliverability lever. SPF/DKIM/DMARC records come from Klaviyo's wizard.
4. `hello@scruffyboy.co` mailbox (Google Workspace alias is fine) — it's already printed on the site and in emails.

## Hosting — LIVE

- **Repo**: `tom-scruffyboy/scruffyboy` on GitHub (brand account; local remote pinned to that user so the keychain's other credential can't hijack pushes).
- **Vercel**: project `scruffyboy-site` in team `scruffyboy` (Hobby), production = `main`. Live at **https://scruffyboy-site.vercel.app** — every `git push` auto-deploys; branches get preview URLs.
- 404 is served from `404.html` automatically; no build step, no config file.
- When `scruffyboy.co` is bought: Vercel project → Settings → Domains → add it (Vercel gives the DNS records).
- Note: the team also contains an older project named `scruffyboy` (from a v0 session) — unrelated to this site; keep or delete in the Vercel dashboard.

## Shopify (launch phase)

**What exists today**: Basic-plan store `e0scrm-cg.myshopify.com` (HKD, Hong Kong) — zero products, still named "My Store", timezone set to EDT (fix to HKT in Shopify settings).

Recommended path for a small DTC line:
1. **Keep this site as the brand/marketing layer** and build the store as the Shopify online store on the same domain — `scruffyboy.co` stays the landing until launch day, then either (a) the Shopify storefront takes over the apex domain with a custom theme built from the design system (components already exist as `.jsx` in the Claude Design project), or (b) the store lives at `shop.scruffyboy.co` and this site's CTAs switch from email capture to "get the goods" → shop links.
2. Option (b) is lower-risk for launch week (no domain cutover), and the design system's Header/ProductCard/CartDrawer components map 1:1 onto a Shopify theme when you're ready for (a).
3. Product naming per brand: lowercase noun phrases — "dirt & salt rinse", "post-swim wipes", "the hydrant".
4. Klaviyo ↔ Shopify integration (one click in Klaviyo) unlocks abandoned-cart, post-purchase, and back-in-stock flows plus revenue attribution — turn this on before the first order, not after.
5. GA4 ↔ Shopify: add the same `G-BFMJFCEQC6` tag in Shopify's Customer Events / theme settings so sessions stitch across marketing site and store; Shopify emits ecommerce events (view_item, add_to_cart, purchase) natively.

## Worth adding (cheap, high-signal)

- **Meta Conversions API** — the pixel is live (browser-side); when ad spend starts, add the server-side Conversions API via the Klaviyo or hosting integration to recover events lost to ad blockers / iOS. The waitlist also syncs from Klaviyo to Meta as a custom audience for lookalikes. In Meta Events Manager, verify the `Lead` event and mark it as the campaign conversion.
- **Social scheduling** — Postiz is connected; the three Canva social templates in the design project (product drop / statement / story) are the content system.
- **Uptime check** — UptimeRobot free tier on `/` once the domain is live.

## Deliberately NOT added

- Cookie-consent banner: analytics + Meta Pixel with an HK-based audience → the privacy page discloses everything and links opt-outs, which fits launch scope. NOTE: the pixel raises the consent bar — if meaningful EU/UK traffic arrives or you run ads targeting those regions, add a consent banner (with Meta's consent mode) before scaling that spend.
- Tag Manager: one tag today; GTM adds indirection without benefit until there are 3+ tags.
- A/B testing tool: the `method` dimension on `generate_lead` covers hero-vs-footer; real A/B tooling can wait for meaningful traffic.

## Local preview quirk (dev note)

macOS blocks spawned servers from reading this Google Drive folder. `.claude/launch.json` serves a mirror from the session scratchpad — rsync the folder there before previewing. The in-app browser pane corrupts scrolled screenshots of this site; verify visuals in real Chrome.
