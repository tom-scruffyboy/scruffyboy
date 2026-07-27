/* scruffyboy — Klaviyo signup handler.
   Posts to Klaviyo's public client-subscriptions endpoint (no backend needed).
   List is double opt-in: Klaviyo emails a confirmation; the profile only gets
   marketing consent after they click it. */
(function () {
  var COMPANY_ID = 'Wv94NM';           // Klaviyo public API key (safe to expose)
  var LIST_ID = 'Umf2ZE';              // "scruffyboy — pre-launch waitlist"
  var ENDPOINT = 'https://a.klaviyo.com/client/subscriptions?company_id=' + COMPANY_ID;

  // Signup counter. Klaviyo's list count isn't readable with a public key, so
  // TAKEN is updated by hand from the list dashboard. The counter only renders
  // once TAKEN reaches SHOW_AT — a low number reads worse than no number.
  var SPOTS = { TAKEN: 0, TOTAL: 500, SHOW_AT: 25 };

  if (SPOTS.TAKEN >= SPOTS.SHOW_AT) {
    document.querySelectorAll('.spots').forEach(function (el) {
      el.textContent = (SPOTS.TOTAL - SPOTS.TAKEN) + ' of ' + SPOTS.TOTAL + ' founder spots left';
      el.hidden = false;
    });
  }

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
        setMsg('error', 'That email doesn’t look right. Give it another go.');
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
              // Advanced Matching: re-init with the email (the pixel normalises +
              // SHA-256 hashes it client-side before sending) so Lead + future
              // events attribute to a real person → better audiences/lookalikes.
              fbq('init', '1898777770792309', { em: email.toLowerCase() });
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
          setMsg('error', 'That didn’t go through. Try again, the internet has mud in it too.');
        });
    });
  });
})();

/* Lightweight engagement events for GA4 (and Meta) — CTA clicks + outbound social.
   Delegated, defensive, non-blocking: never interferes with navigation. */
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a, button') : null;
    if (!a) return;
    var href = (a.getAttribute && a.getAttribute('href')) || '';

    // primary CTA ("get first dibs" buttons / #signup links)
    var isCTA = (a.classList && a.classList.contains('btn-primary')) || href === '#signup';
    if (isCTA && typeof gtag === 'function') {
      gtag('event', 'cta_click', { location: location.pathname });
    }

    // outbound link (socials, opt-out tools, etc.)
    if (/^https?:\/\//.test(href) && a.hostname && a.hostname !== location.hostname) {
      if (typeof gtag === 'function') {
        gtag('event', 'click', { link_domain: a.hostname, link_url: href, outbound: true });
      }
    }
  }, true);
})();

/* Testing-department application form (form[data-application]).
   Same public Klaviyo endpoint as the signup forms — applicants join the
   waitlist list with the dog's details stored as profile properties, so the
   applications are readable per-profile in Klaviyo and the double-opt-in +
   welcome flow still apply. Consent is required client-side and recorded as
   a property; server-side enforcement (and real photo upload) needs a small
   backend — tracked in UPDATES.md. */
(function () {
  var COMPANY_ID = 'Wv94NM';
  var LIST_ID = 'Umf2ZE';
  var ENDPOINT = 'https://a.klaviyo.com/client/subscriptions?company_id=' + COMPANY_ID;

  document.querySelectorAll('form[data-application]').forEach(function (form) {
    var button = form.querySelector('button[type="submit"]');
    var msg = form.querySelector('.msg');
    var buttonLabel = button ? button.textContent : '';

    function setMsg(kind, text) {
      if (!msg) return;
      msg.className = 'msg ' + kind;
      msg.textContent = text;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('.hp');
      if (hp && hp.value) return; // bot

      if (!form.checkValidity()) {
        setMsg('error', 'a few fields still need filling in.');
        var bad = form.querySelector(':invalid');
        if (bad) bad.focus();
        return;
      }

      var f = new FormData(form);
      var email = String(f.get('email') || '').trim().toLowerCase();
      var source = form.getAttribute('data-application') || 'testing department';

      if (button) { button.disabled = true; button.textContent = 'submitting…'; }

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', revision: '2026-07-15' },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              custom_source: source + ' application',
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email: email,
                    first_name: String(f.get('human_name') || '').trim(),
                    properties: {
                      application: 'testing department',
                      dog_name: String(f.get('dog_name') || '').trim(),
                      dog_city: String(f.get('city') || '').trim(),
                      dog_coat: String(f.get('coat') || ''),
                      dog_instagram: String(f.get('instagram') || '').trim(),
                      dog_mess: String(f.get('mess') || '').trim(),
                      photo_link: String(f.get('photo_link') || '').trim(),
                      image_rights_consent: f.get('consent') === 'yes' ? 'yes' : 'no',
                      consent_recorded_at: new Date().toISOString(),
                      applied_page: location.pathname || '/'
                    }
                  }
                }
              }
            },
            relationships: { list: { data: { type: 'list', id: LIST_ID } } }
          }
        })
      })
        .then(function (res) {
          if (res.status !== 202) throw new Error('status ' + res.status);
          if (typeof fbq === 'function') {
            fbq('init', '1898777770792309', { em: email });
            fbq('track', 'SubmitApplication', { content_name: source });
          }
          if (typeof gtag === 'function') {
            gtag('event', 'application_submit', { method: source, location: location.pathname });
          }
          setMsg('ok', 'application received. check your inbox to confirm your email. moose will not be reading it personally.');
          form.reset();
          if (button) { button.disabled = false; button.textContent = buttonLabel; }
        })
        .catch(function () {
          if (button) { button.disabled = false; button.textContent = buttonLabel; }
          setMsg('error', 'that didn’t go through. try again, the internet has mud in it too.');
        });
    });
  });
})();
