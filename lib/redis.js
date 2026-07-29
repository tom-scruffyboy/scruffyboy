/* Thin Upstash Redis REST client for the referral program.
   No SDK: the api/ functions are the only consumers and need four commands.
   Env vars come from the Vercel/Upstash marketplace integration (either
   naming scheme, depending on when the store was linked). */

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function cmd() {
  const args = Array.prototype.slice.call(arguments);
  const res = await fetch(URL_, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(args)
  });
  if (!res.ok) {
    const t = await res.text().catch(function () { return ''; });
    throw new Error('redis ' + res.status + ' ' + t.slice(0, 200));
  }
  const out = await res.json();
  if (out && typeof out === 'object' && 'error' in out) throw new Error('redis: ' + out.error);
  return out.result;
}

module.exports = {
  get: function (k) { return cmd('GET', k); },
  set: function (k, v) { return cmd('SET', k, String(v)); },
  setnx: function (k, v) { return cmd('SETNX', k, String(v)); },
  incr: function (k) { return cmd('INCR', k); },
  incrEx: function (k, seconds) {
    // counter with a TTL set only on first increment (rate limiting)
    return cmd('INCR', k).then(function (n) {
      if (n === 1) return cmd('EXPIRE', k, String(seconds)).then(function () { return n; });
      return n;
    });
  }
};
