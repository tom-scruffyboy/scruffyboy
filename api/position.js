/* Queue position lookup for the post-signup pages. Returns only what the
   pages render: position in the queue and confirmed-referral count. Reads
   Redis directly; no Klaviyo call, no secrets in the response. */

const redis = require('../lib/redis');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  }

  const email = String((req.query && req.query.email) || '').trim().toLowerCase().slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(422).json({ ok: false, error: 'invalid email' });
  }

  try {
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const hits = await redis.incrEx('rl:pos:' + ip, 3600);
    if (hits > 120) return res.status(429).json({ ok: false, error: 'slow down' });

    const pos = await redis.get('queue:pos:' + email);
    let referrals = 0;
    const code = await redis.get('ref:email:' + email);
    if (code) referrals = parseInt((await redis.get('ref:count:' + code)) || '0', 10);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      position: pos ? parseInt(pos, 10) : null,
      referrals: referrals
    });
  } catch (e) {
    console.error('position lookup failed', e && e.message);
    return res.status(502).json({ ok: false, error: 'lookup failed' });
  }
};
