/* Waitlist subscribe with referral codes (referral program phase 1).
   Replaces the old client-direct Klaviyo subscribe so every signup gets:
   - a stable referral code + link (profile properties, reused on re-signup)
   - referred_by recorded when they arrived via someone's ?ref= link
   The list stays double opt-in: the server-side subscribe below still
   triggers Klaviyo's confirmation email, and referrals only COUNT when the
   friend confirms (see api/confirm-referral.js, called by the welcome flow).
   Secrets live in Vercel env vars, never here. */

const redis = require('../lib/redis');

const LIST_ID = 'Umf2ZE';
const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789'; // no 0/O/1/l/i lookalikes

// The usual throwaway-email suspects (referral fraud rule 2). Not exhaustive;
// the double-opt-in confirm is the real gate.
const DISPOSABLE = [
  'mailinator.com', 'guerrillamail.com', 'sharklasers.com', '10minutemail.com',
  'yopmail.com', 'temp-mail.org', 'tempmail.com', 'throwawaymail.com',
  'getnada.com', 'dispostable.com', 'maildrop.cc', 'trashmail.com'
];

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max || 200);
}

function makeCode() {
  let c = '';
  for (let i = 0; i < 7; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return c;
}

async function klaviyo(path, body) {
  const res = await fetch('https://a.klaviyo.com' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      revision: '2024-10-15',
      Authorization: 'Klaviyo-API-Key ' + process.env.KLAVIYO_PRIVATE_KEY
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const detail = await res.text().catch(function () { return ''; });
    throw new Error('klaviyo ' + path + ' ' + res.status + ' ' + detail.slice(0, 300));
  }
  return res;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  }

  const b = req.body || {};

  // Honeypot: pretend success so bots learn nothing.
  if (b.nickname) return res.status(200).json({ ok: true });

  const email = clean(b.email, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(422).json({ ok: false, error: 'invalid email' });
  }
  const domain = email.split('@')[1];
  if (DISPOSABLE.indexOf(domain) !== -1) {
    return res.status(422).json({ ok: false, error: 'invalid email' });
  }

  // Per-IP rate limit: 20 signups/hour is generous for humans.
  try {
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const hits = await redis.incrEx('rl:sub:' + ip, 3600);
    if (hits > 20) return res.status(429).json({ ok: false, error: 'slow down' });
  } catch (e) {
    console.error('rate limit skipped', e && e.message); // Redis down never blocks signups
  }

  // Stable referral code per email (reused if they sign up twice).
  let code = '';
  try {
    code = (await redis.get('ref:email:' + email)) || '';
    if (!code) {
      for (let i = 0; i < 5 && !code; i++) {
        const candidate = makeCode();
        const fresh = await redis.setnx('ref:code:' + candidate, email);
        if (fresh === 1) code = candidate;
      }
      if (code) await redis.set('ref:email:' + email, code);
    }
  } catch (e) {
    console.error('code generation failed', e && e.message); // signup still proceeds
  }

  // Validate the incoming ref: must exist, and self-referral doesn't count.
  let referredBy = '';
  const rawRef = clean(b.ref, 20).toLowerCase();
  if (rawRef && /^[a-z0-9]{4,20}$/.test(rawRef)) {
    try {
      const owner = await redis.get('ref:code:' + rawRef);
      if (owner && owner !== email) referredBy = rawRef;
    } catch (e) {
      console.error('ref lookup failed', e && e.message);
    }
  }

  const referralUrl = code ? 'https://scruffyboy.com/?ref=' + code : '';
  const properties = { signup_page: clean(b.page, 200) || '/' };
  if (code) {
    properties.referral_code = code;
    properties.referral_url = referralUrl;
  }
  if (referredBy) properties.referred_by = referredBy;

  try {
    // 1. Profile import: code + referred_by survive even an unclicked confirm.
    await klaviyo('/api/profile-import/', {
      data: { type: 'profile', attributes: { email: email, properties: properties } }
    });

    // 2. List subscribe: double opt-in confirmation email + welcome flow.
    await klaviyo('/api/profile-subscription-bulk-create-jobs/', {
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          custom_source: clean(b.source, 100) || 'website',
          profiles: {
            data: [{
              type: 'profile',
              attributes: {
                email: email,
                subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } }
              }
            }]
          }
        },
        relationships: { list: { data: { type: 'list', id: LIST_ID } } }
      }
    });
  } catch (e) {
    console.error('subscribe failed', e && e.message);
    return res.status(502).json({ ok: false, error: 'subscribe failed' });
  }

  return res.status(200).json({ ok: true, referral_code: code, referral_url: referralUrl });
};
