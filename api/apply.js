/* Testing-department application endpoint.
   Why a backend exists at all (the only one on this static site):
   1. Store the applicant's photo (a static site can't accept uploads).
   2. Enforce the image-rights consent checkbox server-side.
   3. Create the Klaviyo profile immediately with a private key, so an
      application is never lost when the applicant skips the double-opt-in
      confirm email. The client still fires the normal list subscribe so
      confirmed applicants join the waitlist + welcome flow.
   Secrets live in Vercel env vars (KLAVIYO_PRIVATE_KEY, BLOB_READ_WRITE_TOKEN),
   never in this repo. */
const { put } = require('@vercel/blob');

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max || 500);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  }

  const b = req.body || {};

  // Honeypot: pretend success so bots learn nothing.
  if (b.nickname) return res.status(200).json({ ok: true });

  // Consent is the image-rights permission; without it nothing is stored.
  if (b.consent !== 'yes') {
    return res.status(422).json({ ok: false, error: 'consent required' });
  }

  const email = clean(b.email, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(422).json({ ok: false, error: 'invalid email' });
  }

  // Photo (optional): base64 JPEG/PNG/WebP, downscaled client-side.
  let photoUrl = '';
  if (b.photo_b64) {
    const ext = TYPES[b.photo_type];
    if (!ext) return res.status(422).json({ ok: false, error: 'unsupported image type' });
    let buf;
    try {
      buf = Buffer.from(String(b.photo_b64), 'base64');
    } catch (e) {
      return res.status(422).json({ ok: false, error: 'bad image data' });
    }
    if (!buf.length || buf.length > MAX_PHOTO_BYTES) {
      return res.status(422).json({ ok: false, error: 'image too large' });
    }
    const slug = (clean(b.dog_name, 40).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'dog');
    const blob = await put('applications/' + Date.now() + '-' + slug + '.' + ext, buf, {
      access: 'public',
      contentType: b.photo_type
    });
    photoUrl = blob.url;
  }

  // Klaviyo profile import (create-or-update) with the application data, so
  // the application is captured regardless of double-opt-in confirmation.
  const kres = await fetch('https://a.klaviyo.com/api/profile-import/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      revision: '2024-10-15',
      Authorization: 'Klaviyo-API-Key ' + process.env.KLAVIYO_PRIVATE_KEY
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email: email,
          first_name: clean(b.human_name, 100),
          properties: {
            application: 'testing department',
            dog_name: clean(b.dog_name, 100),
            dog_city: clean(b.city, 100),
            dog_coat: clean(b.coat, 100),
            dog_instagram: clean(b.instagram, 100),
            dog_mess: clean(b.mess, 2000),
            photo_url: photoUrl,
            image_rights_consent: 'yes',
            consent_recorded_at: new Date().toISOString(),
            applied_page: clean(b.page, 200) || '/testing-department.html'
          }
        }
      }
    })
  });

  if (!kres.ok) {
    const detail = await kres.text().catch(function () { return ''; });
    console.error('klaviyo import failed', kres.status, detail.slice(0, 500));
    return res.status(502).json({ ok: false, error: 'profile store failed' });
  }

  return res.status(200).json({ ok: true, photo_url: photoUrl });
};
