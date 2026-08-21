// Renders a bulletin data object into the print-accurate HTML sheet.
// Shared by the public view (bulletin.html) and the editor preview (bulletin-editor.html).
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); } // multi-line -> <br>

  function timeRow(r) {
    if (!r || (!r.time && !r.sub && !r.label)) return '';
    return '<div class="bl-row' + (r.red ? ' red' : '') + '"><span class="l">' + esc(r.label) +
      '</span><span class="t">' + esc(r.time) + '</span></div>' +
      (r.sub ? '<div class="bl-sub">' + esc(r.sub) + '</div>' : '');
  }
  function renderRows(rows) {
    return (rows || []).map(function (r) {
      if (r.type === 'section') return '<div class="bl-daysec">' + esc(r.label) + '</div>';
      return timeRow(r);
    }).join('');
  }

  // Back-compat: turn an old fixed { times:{...} } object into a rows array.
  function rowsFromTimes(t) {
    t = t || {};
    var out = [{ type: 'section', label: 'Friday' }];
    if (t.earliestCandle) out.push({ type: 'time', label: 'Earliest Candle Lighting', time: t.earliestCandle, red: true });
    if (t.lchaim) out.push({ type: 'time', label: 'L’Chaim', time: t.lchaim, red: true });
    if (t.candle) out.push({ type: 'time', label: 'Candle Lighting', time: t.candle });
    if (t.kabbalas) out.push({ type: 'time', label: 'Mincha / Kabbalas Shabbos / Maariv', time: t.kabbalas, red: true });
    out.push({ type: 'section', label: 'Shabbos' });
    if (t.shacharis) out.push({ type: 'time', label: 'Shacharis: Hodu', time: t.shacharis });
    if (t.shochenAd) out.push({ type: 'time', label: 'Shochen Ad', time: t.shochenAd });
    if (t.learners) out.push({ type: 'time', label: 'Learners Service', time: t.learners });
    if (t.kiddush) out.push({ type: 'time', label: 'Kiddush', time: t.kiddush });
    if (t.mincha) out.push({ type: 'time', label: 'Mincha', time: t.mincha, red: true, sub: 'Followed By Sholosh Seudos' });
    if (t.shabbosEnds) out.push({ type: 'time', label: 'Shabbos Ends', time: t.shabbosEnds, sub: 'Say “Baruch Hamavdil” if driving back for Maariv' });
    if (t.maariv) out.push({ type: 'time', label: 'Maariv', time: t.maariv, red: true });
    return out;
  }

  window.renderBulletin = function (d) {
    d = d || {};
    var rows = (d.rows && d.rows.length) ? d.rows : rowsFromTimes(d.times);
    var ann = (d.announcements || []).filter(function (a) { return a && a.trim(); })
      .map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    var titleHe = d.parshaHe ? ' / <span dir="rtl" lang="he">' + esc(d.parshaHe) + '</span>' : '';
    var mev = d.mevorchim ? '<h2>SHABBOS MEVORCHIM / <span dir="rtl" lang="he">מברכים</span></h2>' : '';

    var right = '<div class="bl-colhead">ANNOUNCEMENTS</div><ul class="bl-ann">' + ann + '</ul>';
    if (d.mazelTov && d.mazelTov.trim())
      right += '<div class="bl-spon"><div class="h">MAZEL TOV:</div><div class="v">' + ml(d.mazelTov) + '</div></div>';
    if (d.kiddushSponsor && d.kiddushSponsor.trim())
      right += '<div class="bl-spon"><div class="h">KIDDUSH IS SPONSORED BY:</div><div class="v">' + ml(d.kiddushSponsor) + '</div></div>';
    if (d.seudaSponsor && d.seudaSponsor.trim())
      right += '<div class="bl-spon"><div class="h">SHOLOSH SEUDOS IS SPONSORED BY:</div><div class="v">' + ml(d.seudaSponsor) + '</div></div>';
    if (d.sponsorContact && d.sponsorContact.trim())
      right += '<div class="bl-sponcontact">For sponsorships, please contact ' + esc(d.sponsorContact) + '</div>';

    return [
      '<div class="bl-header">',
      '<img class="bl-emblem" src="images/logo.svg" alt="">',
      '<div class="bl-shulname-he"><span dir="rtl" lang="he">בית אהבת ישראל</span></div>',
      '<div class="bl-shulname-en">Beis Ahavas Yisroel</div>',
      '<div class="bl-address">6031 Prestoncrest Lane &middot; Dallas, TX 75230<br>',
      'beisahavasyisroel.org &middot; info@beisahavasyisroel.org &middot; (347) 528-0755</div>',
      '</div>',
      '<div class="bl-title"><h2>SHABBOS PARSHAS ' + esc(d.parshaEn || '') + titleHe + '</h2>' + mev + '</div>',
      '<div class="bl-main">',
      '<div class="bl-col"><div class="bl-colhead">DAVENING TIMES</div>' + renderRows(rows) + '</div>',
      '<div class="bl-col">' + right + '</div>',
      '</div>',
      '<div class="bl-footer">Have A Wonderful Shabbos! <span dir="rtl" lang="he">שבת שלום</span></div>'
    ].join('');
  };
})();
