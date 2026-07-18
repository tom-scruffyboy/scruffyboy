/* scruffyboy — post-signup share buttons (thanks + confirmed pages).
   Static, no tracking. WhatsApp first (HK's default channel) + copy-link
   fallback. Sharing intent peaks right after signup, so we ask here. */
(function () {
  var SHARE_URL = 'https://scruffyboy.com';
  var SHARE_TEXT = 'i just grabbed founder pricing on scruffyboy — grooming goods for dirty dogs, launching autumn 2026. first 500 only:';

  document.querySelectorAll('[data-share-whatsapp]').forEach(function (el) {
    el.setAttribute('href', 'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  document.querySelectorAll('[data-share-copy]').forEach(function (btn) {
    var label = btn.textContent;
    var revert;

    function done() {
      btn.textContent = 'link copied';
      clearTimeout(revert);
      revert = setTimeout(function () { btn.textContent = label; }, 2000);
    }

    function fallback() {
      var t = document.createElement('textarea');
      t.value = SHARE_URL;
      t.setAttribute('readonly', '');
      t.style.position = 'absolute';
      t.style.left = '-9999px';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* no-op */ }
      document.body.removeChild(t);
    }

    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).then(done, fallback);
      } else {
        fallback();
      }
    });
  });
})();
