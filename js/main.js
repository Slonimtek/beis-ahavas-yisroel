// Beis Ahavas Yisroel — site behavior: mobile nav + live zmanim from Hebcal.

(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dallas, TX (geonameid confirmed against Hebcal's own lookup).
  var GEONAME_ID = 4684888;
  var thisWeekEl = document.getElementById('thisWeek');

  function fmtTime(iso, tzid) {
    try {
      return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tzid });
    } catch (e) {
      return iso;
    }
  }

  function renderThisWeek(data) {
    var items = data.items || [];
    var candles = items.find(function (i) { return i.category === 'candles'; });
    var havdalah = items.find(function (i) { return i.category === 'havdalah'; });
    var parsha = items.find(function (i) { return i.category === 'parashat'; });
    var hebdate = items.find(function (i) { return i.category === 'hebdate'; });
    // Always render in the shul's own timezone, not the visitor's device timezone.
    var tzid = (data.location && data.location.tzid) || 'America/Chicago';

    var html = '';
    if (parsha) {
      // Hebcal returns Sephardi spelling ("Parashat"); the shul's voice is
      // Ashkenazi/Nusach Sefard ("Parshas") to match Shabbos/Shacharis/Kiddush.
      var parshaTitle = parsha.title.replace(/^Parashat\s+/, 'Parshas ');
      html += '<p class="tw-parsha">' + parshaTitle + '</p>';
    }
    if (hebdate) {
      html += '<p class="tw-hebdate">' + hebdate.hebrew + '</p>';
    }
    html += '<div class="tw-grid">';
    if (candles) {
      html += '<div class="tw-item"><div class="tw-label">Candle Lighting</div><div class="tw-value">' + fmtTime(candles.date, tzid) + '</div></div>';
    }
    if (havdalah) {
      html += '<div class="tw-item"><div class="tw-label">Havdalah</div><div class="tw-value">' + fmtTime(havdalah.date, tzid) + '</div></div>';
    }
    html += '<div class="tw-item"><div class="tw-label">Location</div><div class="tw-value">' + (data.location ? data.location.title : 'Dallas, TX') + '</div></div>';
    html += '</div>';

    thisWeekEl.innerHTML = html;

    // Fill the Shabbos schedule with this week's approximate clock times.
    // shkiah (sunset) = candle lighting + 18 min (Hebcal is queried with b=18).
    if (candles) {
      var shkiah = new Date(new Date(candles.date).getTime() + 18 * 60000);
      var addMin = function (base, m) { return new Date(base.getTime() + m * 60000); };
      var round5 = function (d) { var ms = 5 * 60000; return new Date(Math.round(d.getTime() / ms) * ms); };
      var setZman = function (id, when) {
        var el = document.getElementById(id);
        if (el) el.textContent = '≈ ' + fmtTime(when.toISOString(), tzid) + ' this Shabbos';
      };
      setZman('zman-erev', round5(addMin(shkiah, -60)));
      setZman('zman-mincha', addMin(shkiah, -35));
      setZman('zman-maariv', addMin(shkiah, 60));
    }
  }

  function renderFallback() {
    thisWeekEl.innerHTML =
      '<p class="loading-text">Couldn&rsquo;t load this week&rsquo;s times automatically. ' +
      '<a href="https://www.hebcal.com/shabbat?geonameid=' + GEONAME_ID + '" target="_blank" rel="noopener" style="color:var(--gold-light)">See this week&rsquo;s Shabbos times on Hebcal &rarr;</a></p>';
  }

  if (thisWeekEl) {
    var url = 'https://www.hebcal.com/shabbat?cfg=json&geonameid=' + GEONAME_ID + '&M=on&b=18';
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Hebcal request failed');
        return res.json();
      })
      .then(renderThisWeek)
      .catch(renderFallback);
  }

  // Photo gallery lightbox.
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lb = document.getElementById('lightbox');
  if (items.length && lb) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var current = 0;

    function show(i) {
      current = (i + items.length) % items.length;
      var btn = items[current];
      lbImg.src = btn.getAttribute('data-full');
      lbImg.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
      lbCap.textContent = btn.getAttribute('data-cap') || '';
    }
    function open(i) {
      show(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.getElementById('lbClose').focus();
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.src = '';
      if (items[current]) items[current].focus();
    }

    items.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
    document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  // High Holidays registration form -> emailed to info@ via FormSubmit (free, no backend).
  var regForm = document.getElementById('regForm');
  if (regForm) {
    var regStatus = document.getElementById('regStatus');
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var honey = regForm.querySelector('[name="_honey"]');
      if (honey && honey.value) return; // bot trap
      var btn = regForm.querySelector('button[type="submit"]');
      var fd = new FormData(regForm);
      var payload = {};
      fd.forEach(function (v, k) { if (k !== 'services' && k !== '_honey') payload[k] = v; });
      payload.services = fd.getAll('services').join(', ') || '(none selected)';
      payload._subject = 'High Holidays seat request — ' + (payload.name || '');

      regStatus.textContent = 'Sending…';
      regStatus.className = 'reg-status sending';
      btn.disabled = true;

      fetch('https://formsubmit.co/ajax/info@beisahavasyisroel.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          regForm.reset();
          regStatus.textContent = 'Thank you! Your request is in. Seats are limited, so we’ll be in touch soon to confirm your reservation.';
          regStatus.className = 'reg-status ok';
          btn.disabled = false;
        })
        .catch(function () {
          regStatus.innerHTML = 'Sorry, something went wrong. Please email <a href="mailto:info@beisahavasyisroel.org">info@beisahavasyisroel.org</a> or call (347)&nbsp;528-0755.';
          regStatus.className = 'reg-status err';
          btn.disabled = false;
        });
    });
  }
})();
