# scruffyboy — Klaviyo setup & runbook

Everything the pre-launch email machine is made of, what's already done, and the
few steps that must be finished by hand in the Klaviyo UI (the flow-builder API
is read-only, so flows can't be created programmatically).

## Account

| Thing | Value |
|---|---|
| Account / public API key (site ID) | `Wv94NM` |
| Waitlist list | **scruffyboy — pre-launch waitlist** — id `Umf2ZE` |
| Opt-in process | **double opt-in** (deliberate: cleaner list, better deliverability; inbox providers weight engagement heavily) |
| Timezone on account | Asia/Makassar — check this matches you (Klaviyo settings → account) |

## How the site talks to Klaviyo (already live)

`js/signup.js` posts to Klaviyo's public client endpoint — no backend needed:

```
POST https://a.klaviyo.com/client/subscriptions?company_id=Wv94NM
revision: 2026-07-15
```

- Both forms (hero + footer) subscribe to list `Umf2ZE`, with `custom_source`
  set to "hero form" / "footer form" so you can see which converts.
- Honeypot field filters bots; success redirects to `thanks.html`.
- Because the list is double opt-in, Klaviyo sends a **confirmation email**;
  the subscriber only becomes marketing-consented after clicking it.
  (Verified end-to-end: submissions → 202 → confirmation emails delivered.)

## Welcome flow — LIVE ✅

Flow **pre-launch welcome** (`Rwn4mS`) is live as of Jul 16, 2026:
trigger *Added to list Umf2ZE* (no re-entry) → **welcome 1** (immediate, Smart Sending OFF, UTM on)
→ wait 3 days → **welcome 2** (Day 3) → wait 4 days → **welcome 3** (Day 7).
All three emails send as **scruffyboy** (sender email still te@hvngroup.co until the
sending domain exists). UTM tracking on for all three, so clicks attribute in GA4.
Flow URL: https://www.klaviyo.com/flow/Rwn4mS/edit

The original assembly notes below are kept for reference.

## Welcome flow — templates are built, assembly is ~5 min in the UI

Templates (already in the account, on-brand, with unsubscribe links):

| # | Template | ID | Timing | Job |
|---|---|---|---|---|
| 1 | scruffyboy — welcome 1 — you're in | `XsyZSF` | **immediately** on list join | confirm the perk, set expectations, ask a reply ("your dog's worst mess") — replies boost deliverability |
| 2 | scruffyboy — welcome 2 — why we exist | `Yww6mk` | **3 days** after email 1 | brand story, Moose, positioning |
| 3 | scruffyboy — welcome 3 — what's coming | `TpHsUr` | **7 days** after email 1 (4 after email 2) | tease lineup, reinforce founder pricing, forward-to-a-friend ask |

Assemble in Klaviyo (Flows → Create flow → Build your own):

1. Trigger: **Added to list** → *scruffyboy — pre-launch waitlist*.
2. Action 1: Email using template *welcome 1* — no delay before it.
   Suggested subject: `you're in. moose has been told.`
   Preview text: `founder pricing is locked. here's what happens next.`
   **Turn Smart Sending OFF for this email only** (it must always send).
3. Time delay: 3 days → Email using *welcome 2*.
   Subject: `the pet aisle wasn't listening.`
4. Time delay: 4 days → Email using *welcome 3*.
   Subject: `three messes. three fixes.`
5. Set each email's sender name to `scruffyboy` and turn the flow **Live**.

Why 3 emails: welcome flows convert ~18× a broadcast; 3–5 emails immediately →
day 3 → day 7 is the standard cadence, one job per email, never >1/day.

## Manual UI checklist (one-time)

- [ ] **Brand the double opt-in confirmation email** — Lists → the waitlist →
      Settings → Consent / double opt-in. Default copy is generic Klaviyo.
      Suggested subject: `one click and you're in.`
- [ ] **Set the opt-in confirmation redirect** to the site's `confirmed.html`
      (same settings page → "confirmation page" → custom URL) so the
      click-to-confirm lands on-brand instead of Klaviyo's hosted page.
- [x] **Sender name** set to `scruffyboy` on all three flow emails (Jul 16).
      Still to do once the domain exists: add a **dedicated sending domain**
      (e.g. send.scruffyboy.co) in Klaviyo → Settings → Email — this is the
      single biggest deliverability lever — and update sender email from
      te@hvngroup.co.
- [ ] Update the `https://scruffyboy.co` link in template 3 and `canonical`/OG
      URLs in the site when the real domain is live.

## At launch

- Segment idea (Analytics → create segment): *founders* = first 500 members of
  the waitlist by join date — target them with the founder-pricing campaign.
- The launch announcement itself should be a **campaign** to the list, not a
  flow; send it, then retire/keep the welcome flow for post-launch signups.

## Test profiles

`te+scruffytest@hvngroup.co` and `te+scruffysite@hvngroup.co` were used to
verify the pipeline (their confirmation emails are in your inbox — click one to
watch the full journey, then delete/suppress both profiles before reporting on
list size).
