// Renders a bulletin data object into the print-accurate HTML sheet.
// Shared by the public view (bulletin.html) and the editor preview (bulletin-editor.html).
(function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function row(label, time, red, sub) {
    if (!time && !sub) return '';
    return '<div class="bl-row' + (red ? ' red' : '') + '"><span class="l">' + esc(label) +
      '</span><span class="t">' + esc(time) + '</span></div>' +
      (sub ? '<div class="bl-sub">' + esc(sub) + '</div>' : '');
  }
  window.renderBulletin = function (d) {
    d = d || {};
    var t = d.times || {};
    var ann = (d.announcements || []).filter(function (a) { return a && a.trim(); })
      .map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    var titleHe = d.parshaHe ? ' / <span dir="rtl" lang="he">' + esc(d.parshaHe) + '</span>' : '';
    var mev = d.mevorchim
      ? '<h2>SHABBOS MEVORCHIM / <span dir="rtl" lang="he">מברכים</span></h2>' : '';

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
      '<div class="bl-col">',
      '<div class="bl-colhead">DAVENING TIMES</div>',
      '<div class="bl-daysec">Friday</div>',
      row('Earliest Candle Lighting', t.earliestCandle, true),
      row('L’Chaim', t.lchaim, true),
      row('Candle Lighting', t.candle, false),
      row('Mincha / Kabbalas Shabbos / Maariv', t.kabbalas, true),
      '<div class="bl-daysec">Shabbos</div>',
      row('Shacharis: Hodu', t.shacharis, false),
      row('Shochen Ad', t.shochenAd, false),
      row('Learners Service', t.learners, false),
      row('Kiddush', t.kiddush, false),
      row('Mincha', t.mincha, true, 'Followed By Seuda Shlishit'),
      row('Shabbos Ends', t.shabbosEnds, false, 'Say “Baruch Hamavdil” if driving back for Maariv'),
      row('Maariv', t.maariv, true),
      '</div>',
      '<div class="bl-col">',
      '<div class="bl-colhead">ANNOUNCEMENTS</div>',
      '<ul class="bl-ann">' + ann + '</ul>',
      (d.kiddushSponsor ? '<div class="bl-spon"><div class="h">KIDDUSH IS SPONSORED BY:</div><div class="v">' + esc(d.kiddushSponsor) + '</div></div>' : ''),
      (d.seudaSponsor ? '<div class="bl-spon"><div class="h">SEUDA SHLISHIT IS SPONSORED BY:</div><div class="v">' + esc(d.seudaSponsor) + '</div></div>' : ''),
      (d.sponsorContact ? '<div class="bl-sponcontact">For sponsorships, please contact ' + esc(d.sponsorContact) + '</div>' : ''),
      '</div>',
      '</div>',
      '<div class="bl-footer">Have A Wonderful Shabbos! <span dir="rtl" lang="he">שבת שלום</span></div>'
    ].join('');
  };
})();
