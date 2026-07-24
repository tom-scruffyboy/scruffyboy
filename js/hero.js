/* scruffyboy — hero parallax, lineup scrollytelling, mess slider, reveals. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero settle-in */
  var fps = Array.prototype.slice.call(document.querySelectorAll('.fp'));
  requestAnimationFrame(function () { document.body.classList.add('hero-ready'); });

  /* pointer parallax (fine pointers only) */
  var stage = document.querySelector('.hero-stage');
  if (stage && !reduced && window.matchMedia('(pointer: fine)').matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(step);
    });
    stage.addEventListener('pointerleave', function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(step);
    });
    function step() {
      raf = null;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      for (var i = 0; i < fps.length; i++) {
        var d = parseFloat(fps[i].getAttribute('data-depth')) || 1;
        fps[i].style.setProperty('--px', (cx * -26 * d).toFixed(2) + 'px');
        fps[i].style.setProperty('--py', (cy * -18 * d).toFixed(2) + 'px');
      }
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(step);
    }
  }

  /* lineup scrollytelling — rAF-driven (scroll events can be swallowed in
     embedded previews), cheap: one getBoundingClientRect per frame. */
  var lineup = document.querySelector('.lineup');
  if (lineup) {
    var slides = lineup.querySelectorAll('.ls');
    var arts = lineup.querySelectorAll('.lineup-art .li');
    var dots = lineup.querySelectorAll('.lineup-dots button');
    var n = slides.length, cur = -1;

    function setActive(i) {
      if (i === cur) return;
      cur = i;
      for (var k = 0; k < n; k++) {
        slides[k].classList.toggle('active', k === i);
        if (arts[k]) arts[k].classList.toggle('active', k === i);
        if (dots[k]) dots[k].classList.toggle('active', k === i);
      }
    }
    (function tick() {
      var rect = lineup.getBoundingClientRect();
      var total = lineup.offsetHeight - window.innerHeight;
      if (total <= 0) { setActive(0); }
      else if (rect.bottom > 0 && rect.top < window.innerHeight) {
        var p = Math.min(1, Math.max(0, -rect.top / total));
        setActive(Math.min(n - 1, Math.floor(p * n)));
      }
      requestAnimationFrame(tick);
    })();

    dots.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var total = lineup.offsetHeight - window.innerHeight;
        var y = lineup.offsetTop + ((i + 0.5) / n) * total;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* mess report: before/after slider */
  var ba = document.querySelector('.ba-stage');
  if (ba) {
    var range = ba.querySelector('.ba-range');
    range.addEventListener('input', function () {
      ba.style.setProperty('--pos', range.value + '%');
    });
  }

  /* scroll reveals */
  if (!reduced && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.sec-head, .faq details, .moose .grid > *, .ba-capwrap, .fn-item, .statement .line, .statement .sig, .range-card, .step, .pain-item, .split .grid > *, .quote .q, .quote .by, .chips');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t, i) {
      t.classList.add('reveal');
      t.style.setProperty('--rd', (i % 3) * 70 + 'ms');
      io.observe(t);
    });
  }
})();
