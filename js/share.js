/* referral phase 1: the share moment (thanks + confirmed).
   Native share sheet where the browser has one; copy link everywhere;
   wa.me link only when there is no native sheet (mostly desktop).
   If this device signed up, the shared link is their personal ?ref= link
   (set by signup.js) so confirmed friends move them up the queue, and the
   confirmed page shows their real position from /api/position. */
(function () {
  var SHARE_URL = 'https://scruffyboy.com/';
  try {
    var mine = localStorage.getItem('sb_url');
    if (mine && /^https:\/\/scruffyboy\.com\/\?ref=[a-z0-9]{4,20}$/.test(mine)) SHARE_URL = mine;
  } catch (e) { /* private mode */ }
  var SHARE_TEXT = 'my dog is on a waiting list for grooming stuff that actually works after a hike. yours can queue too:';

  var box = document.querySelector('[data-share]');
  if (!box) return;
  var native = box.querySelector('[data-share-native]');
  var copy = box.querySelector('[data-share-copy]');
  var wa = box.querySelector('[data-share-wa]');
  var note = box.querySelector('[data-share-note]');

  function track(method) {
    try {
      if (window.gtag) gtag('event', 'share', { method: method, content_type: 'waitlist', item_id: location.pathname });
    } catch (e) {}
  }

  if (wa) wa.href = 'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL);

  if (navigator.share && native) {
    native.hidden = false;
    if (wa) wa.hidden = true;
    native.addEventListener('click', function () {
      navigator.share({ text: SHARE_TEXT, url: SHARE_URL })
        .then(function () { track('native'); })
        .catch(function () {}); /* closing the sheet is not an error */
    });
  }

  if (wa && !wa.hidden) {
    wa.addEventListener('click', function () { track('whatsapp'); });
  }

  if (copy) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      function done() {
        if (note) {
          note.hidden = false;
          setTimeout(function () { note.hidden = true; }, 2400);
        }
        track('copy');
      }
      function fallback() {
        var t = document.createElement('textarea');
        t.value = SHARE_URL;
        t.setAttribute('readonly', '');
        t.style.position = 'absolute';
        t.style.left = '-9999px';
        document.body.appendChild(t);
        t.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(t);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).then(done, fallback);
      } else {
        fallback();
      }
    });
  }

  // Queue position (confirmed page has [data-position]; renders only when the
  // number is real — positions are assigned on confirm, never invented).
  var posEl = document.querySelector('[data-position]');
  if (posEl) {
    var email = '';
    try { email = localStorage.getItem('sb_email') || ''; } catch (e) {}
    if (email) {
      fetch('/api/position?email=' + encodeURIComponent(email))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.position) return;
          var line = 'you’re number ' + d.position + ' of the first 500.';
          if (d.referrals > 0) {
            line += ' ' + d.referrals + ' confirmed ' + (d.referrals === 1 ? 'referral' : 'referrals') + ' so far.';
          }
          posEl.textContent = line;
          posEl.hidden = false;
        })
        .catch(function () {});
    }
  }
})();
