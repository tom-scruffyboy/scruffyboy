/* Called by the Klaviyo welcome flow's webhook action, which fires when a
   profile joins the list — and with double opt-in, joining the list means
   they clicked the confirmation email. This is the moment a referral counts
   (fraud rule 1: never on submit) and the moment a queue position is real.

   Does three things, all idempotent:
   1. Assigns the next queue position (Redis INCR; atomic, no double numbers)
      and writes it to the profile as queue_position.
   2. If they were referred: credits the referrer once (Redis guard), bumps
      referral_count on the referrer's profile.
   3. Fires a "Referred Signup Confirmed" event on the REFERRER, which the
      milestone flow triggers on (splits at 3/5/10/25).

   Auth: shared secret header set in the Klaviyo webhook config; requests
   without it are rejected. Secret lives in Vercel env vars. */

const redis = require('../lib/redis');

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max || 200);
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

function setProps(email, properties) {
  return klaviyo('/api/profile-import/', {
    data: { type: 'profile', attributes: { email: email, properties: properties } }
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  }
  if (req.headers['x-scruffyboy-secret'] !== process.env.REFERRAL_WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const b = req.body || {};
  const email = clean(b.email, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(422).json({ ok: false, error: 'invalid email' });
  }

  // 1. Queue position: first confirm claims the next number, re-runs reuse it.
  let position = 0;
  try {
    const existing = await redis.get('queue:pos:' + email);
    if (existing) {
      position = parseInt(existing, 10);
    } else {
      position = await redis.incr('queue:next');
      const claimed = await redis.setnx('queue:pos:' + email, position);
      if (claimed !== 1) position = parseInt(await redis.get('queue:pos:' + email), 10);
      await setProps(email, { queue_position: position });
    }
  } catch (e) {
    console.error('queue position failed', e && e.message);
  }

  // 2 + 3. Credit the referrer, once per confirmed friend.
  let credited = false;
  const refCode = clean(b.referred_by, 20).toLowerCase();
  if (refCode && /^[a-z0-9]{4,20}$/.test(refCode)) {
    try {
      const referrer = await redis.get('ref:code:' + refCode);
      if (referrer && referrer !== email) {
        const firstTime = await redis.setnx('ref:credited:' + email, refCode);
        if (firstTime === 1) {
          const count = await redis.incr('ref:count:' + refCode);
          // Cap counted referrals at 50 (fraud rule 4); past it we stop
          // crediting but keep the raw count in Redis for review.
          if (count <= 50) {
            await setProps(referrer, { referral_count: count });
            await klaviyo('/api/events/', {
              data: {
                type: 'event',
                attributes: {
                  metric: { data: { type: 'metric', attributes: { name: 'Referred Signup Confirmed' } } },
                  profile: { data: { type: 'profile', attributes: { email: referrer } } },
                  properties: { count: count, code: refCode }
                }
              }
            });
          }
          credited = true;
        }
      }
    } catch (e) {
      console.error('referral credit failed', e && e.message);
    }
  }

  return res.status(200).json({ ok: true, position: position, credited: credited });
};
