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
- [ ] **Contact email** — currently `info@beisahavasyisroel.org (testing data)` (placeholder domain) in `index.html`. Replace with your real address, or register that domain.
- [ ] **Phone number** — `214-555-0182 (testing data)` appears 3× in `index.html` (Shabbos Meals, Community Meal, Contact). Replace with the real number.
- [ ] **Weekly tefillah schedule** — the times table in the Schedule section is a placeholder; replace with your actual Shacharis/Mincha/Maariv times.
- [ ] **Vision & Mission** — placeholder text; swap in your real statement once it's ready.
- [ ] **Photos** — drop images into `images/` and add them to the Photos section once you have them (after your first Shabbos).
- [ ] **Donate** — currently a "coming soon" placeholder per your request. When you've set up a giving option (PayPal, Zelle, Donorbox, etc.), replace the placeholder card in the Donate section with a real link or instructions.

## How the "Schedule & לוח" widget works

The candle-lighting/havdalah/parsha box is pulled live from the free
[Hebcal API](https://www.hebcal.com/home/197/candle-lighting-times-geo)
for Dallas, TX (geonameid `4684888`), always shown in Dallas' own time zone
regardless of the visitor's device. See `js/main.js`. No API key or backend
needed — if you ever move the shul, just update `GEONAME_ID`.
