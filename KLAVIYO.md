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

- [x] **Double opt-in confirmation email branded** (Jul 16): subject
      `one click and you're in.`, heading matches, button is an orange
      (#FF6B35) pill reading `yes, save my spot`. Verified via a live test
      signup — the delivered email carries all of it. Pages are list-specific
      (Consent pages → customized for this list), account defaults untouched.
- [x] **Post-confirmation page branded** (Jul 16): Klaviyo's new consent-pages
      editor has no custom-URL redirect, so the hosted success page itself was
      branded instead — cream card on near-black, heading `you're in.
      officially.`, Moose copy. Same outcome as redirecting to confirmed.html
      (which stays on the site, unused by this path).
- [x] **Sender name** set to `scruffyboy` on all three flow emails (Jul 16).
      Still to do once the domain exists: add a **dedicated sending domain**
      (e.g. send.scruffyboy.com) in Klaviyo → Settings → Email — this is the
      single biggest deliverability lever — and update sender email from
      te@hvngroup.co.
- [ ] Update the `https://scruffyboy.com` link in template 3 and `canonical`/OG
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

## v4 additions (27 Jul)

- **Welcome 1 (`XsyZSF`) replaced** with the designed branded HTML email from the v4
  handoff (dark header, hero, product cutout, perk block, IG CTA, `{{ organization.* }}`
  + `{% unsubscribe_link %}` footer). Reply-ask paragraph kept (deliverability). De-dashed.
- **New template `UCif7F` — "the mess report" monthly shell.** Duplicate per send, edit
  the `EDIT PER SEND` comments (preheader, issue no., month, headline, intro, story
  blocks, Moose verdict). Story block is a repeatable `<tr>`; keep the verdict block in
  every send.
- **Testing-department application form** posts to the same client-subscriptions
  endpoint, list `Umf2ZE`, `custom_source` "testing department application". Dog fields
  arrive as profile properties (`dog_name`, `dog_city`, `dog_coat`, `dog_instagram`,
  `dog_mess`, `photo_link`, `image_rights_consent`, `consent_recorded_at`,
  `applied_page`). Applicants get the standard double-opt-in + welcome flow. To review
  applications: filter profiles where `application` = "testing department".
- Events: applications fire GA4 `application_submit` + Meta `SubmitApplication`
  (newsletter signups keep `generate_lead` / `Lead`) so the funnels stay separable.

## Retrieving testing-department applications (for social posts)

Applications are Klaviyo profiles created instantly at submit time (private-key
import via `api/apply.js` — they exist even if the applicant never clicks the
double-opt-in confirm). Each carries: `dog_name`, `dog_city`, `dog_coat`,
`dog_instagram`, `dog_mess`, `photo_url` (public Vercel Blob link, consented for
publication), `image_rights_consent` + `consent_recorded_at`.

- **In Klaviyo:** Audience → Profiles → filter where `application` equals
  "testing department".
- **Via Claude:** ask any session to pull testing-department applications — the
  Klaviyo MCP filters profiles and returns the fields + photo links ready for a
  post draft.
- **Photos only:** Vercel dashboard → Storage → `scruffyboy-applications` →
  applications/ folder.
- Consent is enforced server-side (no consent = 422, nothing stored). The
  credited handle for posts is `dog_instagram`.

## 27 Jul — sending domain + flow audit (IMPORTANT corrections to the notes above)

**The "sender email still te@hvngroup.co" note above is STALE.** Audit findings:
- **send.scruffyboy.com is ACTIVE and verified** (Settings → Domains; NS-delegated to
  ns1-4.klaviyo.com, all records green — set up on domain day, the STACK.md
  "remaining" note was stale too). Emails send via the dedicated domain.
- **Every flow email already sends as scruffyboy <hello@scruffyboy.com>**, reply-to
  the same. No personal-email touchpoints exist in the flow. hello@ receives via
  Google MX on scruffyboy.com, so replies work.

**CRITICAL operational lesson — flows send CLONED templates, not library templates.**
The flow's four emails use clones: welcome 1 `TQHu4b`, welcome 1.5 (guides) `RtaL6C`,
welcome 2 `WJ4rX3`, welcome 3 `Wdd9Mr`. Editing the standalone library templates
(`XsyZSF`/`Yww6mk`/`TpHsUr`/`U8PGnZ`, kept as masters) does NOT change what sends.
To edit a live flow email: flow editor → the email → Edit email (Ace code editor).
Three traps: (1) the editor stores em dashes as `&mdash;` entities while the API
returns them decoded — match both when patching; (2) always confirm the green
"changes saved" toast, a Save click can silently miss; (3) after HTML edits, open
Edit plain text → Auto-Generate so the text version re-syncs (it had a stale
override carrying old content).

**Bug found & fixed 27 Jul:** welcome 3's CTA button pointed to scruffyboy.co (wrong
domain) from 16–27 Jul in the LIVE flow (the standalone-template fix on 24 Jul never
reached the clone). Sent to 2 recipients in that window, 0 clicks. Now
https://scruffyboy.com/#signup. All four flow emails also de-dashed, clean-URL'd,
welcome 1 regained the deliberate reply-ask, welcome 2 gained "the receipts" guide
links.

**Flow structure now:** welcome 1 (immediate) → 1d → welcome 1.5 the guides → 2d →
welcome 2 why-we-exist (+receipts) → 4d → welcome 3 lineup. Another surface added
welcome 1.5 on 27 Jul ~03:50; coordinate via the Notion Session Log before editing.

**Double-opt-in confirmation note:** Klaviyo suppresses repeat confirmation emails to
the same inbox (+variants) during testing — te+ test addresses stop receiving them
after a couple of sends. Not a production issue (real applicants = unique inboxes).
Verified working 27 Jul: two branded confirmations delivered, then suppression kicked in.

## 28 Jul — internal application alerts + key rotation

**Real-time alerts for testing-department applications are LIVE.**
- api/apply.js fires event **"Testing Department Application"** (metric `SubHVB`) per
  application, after the profile import. Fire-and-forget: an event failure is logged
  but never fails the submit.
- Flow **"application alerts (internal)" (`WyGh3t`)**, LIVE: metric trigger with
  Allow re-entry → Internal alert email → te@hvngroup.co. Subject
  `new tester application: {{ event.dog_name }} ({{ event.city }})`; body lists
  dog/human/city/coat/instagram/mess/photo via `{{ event.* }}`.
- **Gotcha: internal alerts don't deliver until the recipient clicks Klaviyo's
  one-time "Notification Recipient Confirmation" email** (from hello@, subject of that
  name). Confirmed for te@hvngroup.co on 28 Jul. Alerts fired before confirmation are
  dropped, not queued. If a new recipient is ever added, they must confirm too.
- **Key rotation:** the original private key (Profiles-only) couldn't write events —
  events silently failed. Replaced by **"scruffyboy site backend v2 profiles events"**
  (Profiles + Events, full access); Vercel `KLAVIYO_PRIVATE_KEY` updated + redeployed;
  v1 key deleted from Klaviyo 28 Jul. Rotate in Klaviyo settings → API keys, then
  update the Vercel env var and redeploy.
- Verified end-to-end 28 Jul: my test + two real applications (Missy/NZ, Stella/
  Calgary) all delivered as inbox alerts within ~1 min of submission.
