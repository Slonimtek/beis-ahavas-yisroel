# Beis Ahavas Yisroel — בית אהבת ישראל

Static website for Beis Ahavas Yisroel, a Nusach Sefard congregation in Dallas, TX.
Plain HTML/CSS/JS — no build step, no dependencies.

## View it locally

```
cd beis-ahavas-yisroel
python3 -m http.server 8420
```

Then open http://localhost:8420

## Deploy

**Live now:** https://slonimtek.github.io/beis-ahavas-yisroel/ (GitHub Pages,
repo `Slonimtek/beis-ahavas-yisroel`, public, builds from `main`/`/`). To publish
an update: commit, `git push`, Pages rebuilds in ~1 minute.

## Before going live for real — fill these in

- [x] **Exact street address** — 6031 Prestoncrest Ln, Dallas, TX (Contact section + map).
- [x] **Weekly (Shabbos) schedule** — real times in the Schedule section; weekday minyanim noted as not yet scheduled.
- [x] **Vision & Mission** — real statements from the shul are live in the Vision section.
- [ ] **Domain** — `beisahavasyisroel.org` is available (confirmed via whois 2026-08-03), not yet registered. Once registered, point it at the GitHub Pages site (see GitHub's "custom domain" docs) and set up an actual `info@` mailbox (registrars offer free email forwarding, but it's a separate step from buying the domain).
- [ ] **Contact email** — currently `info@beisahavasyisroel.org (testing data)` — the domain matches what's being registered, but the mailbox won't work until it's set up (see above).
- [ ] **Phone number** — `214-555-0182 (testing data)` appears 3× in `index.html` (Shabbos Meals, Community Meal, Contact). Replace with the real number.
- [ ] **Photos** — drop images into `images/` and add them to the Photos section once you have them (after your first Shabbos).
- [ ] **Donate** — currently a "coming soon" placeholder per your request. When you've set up a giving option (PayPal, Zelle, Donorbox, etc.), replace the placeholder card in the Donate section with a real link or instructions.

## How the "Schedule & לוח" widget works

The candle-lighting/havdalah/parsha box is pulled live from the free
[Hebcal API](https://www.hebcal.com/home/197/candle-lighting-times-geo)
for Dallas, TX (geonameid `4684888`), always shown in Dallas' own time zone
regardless of the visitor's device. See `js/main.js`. No API key or backend
needed — if you ever move the shul, just update `GEONAME_ID`.
