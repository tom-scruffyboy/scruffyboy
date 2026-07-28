/* referral phase 0: the share moment (thanks + confirmed).
   Native share sheet where the browser has one; copy link everywhere;
   wa.me link only when there is no native sheet (mostly desktop). */
(function () {
  var SHARE_URL = 'https://scruffyboy.com/';
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
})();
