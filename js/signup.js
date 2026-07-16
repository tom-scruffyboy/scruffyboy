/* scruffyboy — Klaviyo signup handler.
   Posts to Klaviyo's public client-subscriptions endpoint (no backend needed).
   List is double opt-in: Klaviyo emails a confirmation; the profile only gets
   marketing consent after they click it. */
(function () {
  var COMPANY_ID = 'Wv94NM';           // Klaviyo public API key (safe to expose)
  var LIST_ID = 'Umf2ZE';              // "scruffyboy — pre-launch waitlist"
  var ENDPOINT = 'https://a.klaviyo.com/client/subscriptions?company_id=' + COMPANY_ID;

  function subscribe(email, source) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', revision: '2026-07-15' },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            custom_source: source,
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  properties: { signup_page: location.pathname || '/' }
                }
              }
            }
          },
          relationships: { list: { data: { type: 'list', id: LIST_ID } } }
        }
      })
    });
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // Pause the proof-strip marquee while it's off-screen (perf/battery).
  document.querySelectorAll('.proof .track').forEach(function (track) {
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    }).observe(track);
  });

  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');
    var honeypot = form.querySelector('input[name="nickname"]');
    var msg = form.parentElement.querySelector('.msg');
    var buttonLabel = button.textContent;

    function setMsg(kind, text) {
      if (!msg) return;
      msg.className = 'msg ' + kind;
      msg.textContent = text;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (honeypot && honeypot.value) return; // bot

      var email = (input.value || '').trim();
      if (!validEmail(email)) {
        setMsg('error', 'That email doesn’t look right — give it another go.');
        input.focus();
        return;
      }

      button.disabled = true;
      button.textContent = 'saving your spot…';

      var source = form.getAttribute('data-signup') || 'website';

      // GA4: report the lead, then redirect (timeout fallback so a blocked
      // gtag can never strand the user).
      function goToThanks() {
        if (goToThanks.done) return;
        goToThanks.done = true;
        window.location.href = 'thanks.html';
      }

      subscribe(email, source)
        .then(function (res) {
          if (res.status === 202) {
            if (typeof fbq === 'function') {
              fbq('track', 'Lead', { content_name: source });
            }
            if (typeof gtag === 'function') {
              gtag('event', 'generate_lead', {
                method: source,
                event_callback: goToThanks,
                event_timeout: 700
              });
              setTimeout(goToThanks, 800);
            } else {
              goToThanks();
            }
          } else {
            throw new Error('status ' + res.status);
          }
        })
        .catch(function () {
          button.disabled = false;
          button.textContent = buttonLabel;
          setMsg('error', 'That didn’t go through. Try again — the internet has mud in it too.');
        });
    });
  });
})();
