# Case-study videos

Records the real Superfine driver prototype and composes the MP4s in
`public/case/superfine/`. Uses Chrome and the puppeteer-core already installed in
`~/claude-workspace/superfine` (no ffmpeg needed: frames come from Chrome's
screencast, and Chrome's MediaRecorder encodes the H.264 MP4).

1. Start the apps: the driver prototype (`cd ~/claude-workspace/sfk-driver-app && pnpm dev`,
   expected on http://localhost:5173) and the corporate employee app
   (`cd ~/claude-workspace/superfine-corporate-employee && npx next dev -p 3100`, from
   github.com/smyothu42-creator/superfine.corporate.employee).
2. Record a session (frames + chapter captions go to `out-*/`, git-ignored):
   - Driver flow, iPhone 18 Pro size (402 × 820 app + 54 pt status bar = 402 × 874): `node record.mjs out-driver driver.json http://localhost:5173/ 402 820`
   - Employee flow, phone size: `node record.mjs out-employee employee.json http://localhost:3100/login`
   - Dispatch + phone, desktop: `DPR=1.5 node record.mjs out-dispatch dispatch.json http://localhost:5173/ 1440 900`
   Steps in the JSON: `"REC"` starts recording, `"#text"` starts a caption,
   `"Button text"` clicks it, `"~Label"` drags a slide-to-confirm, `"@ms"` waits,
   `"!px"` scrolls, `"$css selector"` clicks that element, `"TYPE:selector|text"` types, `"CSS:..."` injects a style.
3. Compose: `node compose.mjs cfg-route.json sf-route.mp4` (also `cfg-employee.json`,
   `cfg-intro.json` for the personal intro reel; `cfg-dispatch.json` is no longer on the page).
   `"theme": "site"` with `"bgImage": "bg-calm.jpg"` matches the portfolio's dark backdrop. Scenes are `phone`, `desk` (with
   optional camera `crops`) and `card` (photo, handwritten line, text lines).
4. Check: `node verify.mjs sf-route.mp4 sheet.png 8` makes a contact sheet;
   `node poster.mjs sf-route.mp4 ../../public/case/superfine/sf-route.jpg 2.5` makes the poster.
5. Copy the MP4s into `public/case/superfine/`.


Corporate employee case (`public/case/superfine-employee/`): run the app
(`cd ~/claude-workspace/superfine-corporate-employee && npx next dev -p 3100`), then
`DPR=1.25 node record.mjs out-employee-web employee-web.json http://localhost:3100/login 1440 900`
(web, primary) and `node record.mjs out-employee employee.json http://localhost:3100/login 402 820`
(phone, secondary). Compose `cfg-emp-web-raw.json`, `cfg-emp-mobile-raw.json`, `cfg-intro-emp.json`;
cover with `node still.mjs cfg-cover-emp.json cover-emp.jpg`.

Motion-graphics intro films (`film.src.html` → `film.html`, run `python3 -c "..."` build step below,
then `node film.mjs film-driver.json film-driver.mp4` / `film-employee.json`). Scene kinds: `hello`,
`title` (*word* = accent), `stats` (numbers count up), `demo` (real recording in a phone or browser,
camera push to `focus` [x, y] fractions of the app screen, spotlight, `callout`), `outro`.
Build: `python3 -c "s=open('film.src.html').read().replace('/*PAINTERS*/',open('_painters.js').read()); open('film.html','w').write(s)"`

OrderFlow, the two Superfine cases and MTB Pay Merchant have an intro film. MTB has no recording; its film is a day at one shop counter instead of a feature tour (scene `day`: the time, one line and a day bar on the left, the real screens on a phone; `scan`, `wait`, `paid`, `receipt` tell a single sale and are kept as an option). `python3 mtb-film.py` makes `out-mtb-film/` (the QR card, and the screens for demo scenes); film `film-mtb.json`, song `python3 song.py mtb <seconds> out.wav`. The recorder drops the last ~3 s of a film, so give the outro room, and cut the song to the video's real length. Each has its own look (`theme` in the film json) and its own song, a separate track played by `Reel` through its `audio` prop. The Superfine songs are original, written in `song.py`: `python3 song.py employee <seconds> out.wav` (or `driver`), then `afconvert out.wav -f m4af -d aac -b 160000 <intro>.m4a`. Re-cut them whenever a film's length changes.

MTB Pay Merchant has no recordings; its thumbnail and Work card are OrderFlow's hand mockup with a red iPhone and the real home screen, on sweeps of red light (`aurora()`): `node mtb-phone.mjs`, then `python3 hand-of.py ../../public/case/mtb-pay-merchant/thumb.jpg mtb`. It needs `out-mtb/home-body.png`.

Heizen Supply Chain (`public/case/heizen-supply-chain/`, the Heizen Discovery Tool): run
`cd ~/claude-workspace/heizen-supply-chain-app && npx next dev -p 3300` (no backend), then
`DPR=1.25 node record.mjs out-hz hz-journey.json http://localhost:3300/build 1440 900`.
Compose `cfg-hz-web-raw.json`; film `film-hz.json` (its `theme` object = the product's Brand
palette, so the film matches the product, not the portfolio); stills `cfg-*-hz.json`.
Steps can also be `"KEY:Escape"` (press a key).

OrderFlow (`public/case/orderflow/`, guest app + admin in one case): the intro re-cuts the Pilot Launch film
(square, audio dropped; copy it to `of-launch.mp4`) in the product's own cream, orange and near-black:
`node film-of.mjs film-of.json film-of.mp4` (`film-of.html`, scene kinds `text`, `clip`, `full`, `stats`).
The film is silent; its song is `public/case/orderflow/intro.m4a` (the launch film's audio, cut to the intro's 38.7s with a 2.5s fade out), played by `Reel` through its `audio` prop. `film-of-admin.json` makes the admin clip. Guest recording: run the client with orders mocked
(`cd ~/claude-workspace/orderflow-client && NEXT_PUBLIC_MOCK_ORDERS=true ORDERFLOW_MOCK_ACCOUNT=true npx next dev -p 3002`), then
`DPR=2 node record.mjs out-of-guest of-guest.json "<table QR url>" 402 820` and compose `cfg-of-guest-raw.json`.
The cover is a path traced 3D scene of a graphite countertop POS (OrderFlow logo on the chin, rounded screen, on a wedge stand of one width: a glossy scooped front landing on a thin plate, matte flanks, a recessed foot) seen square on (`frontal` in scene.json). The home thumbnail (`scene-thumb.json`) adds a silver iPhone in front of it; `phoneCase` gives it an orange silicone case (`pos3d/`, three.js and three-gpu-pathtracer; run `npm i` there once). From this folder: `node pos3d/textures.mjs`, `node pos3d/render.mjs pos3d/scene.json out 768`, then the closer view, which pastes the UI afresh at its scale so it stays sharp: `python3 pos3d/comp.py out out-noui.jpg --no-ui`, `python3 pos3d/zoom.py out ../../public/case/orderflow/cover.jpg 205 0 1480`. Screens and the chin logo are in `pos3d/tex/`; The screens are pasted onto the render by `comp.py`, not rendered, so thin UI lines stay visible. `tex/pos-screen.png` is the real admin on fictional data at the POS screen's ratio: run the mock and admin as for the Orders tabs below, then `node shoot-of-pos.mjs`. The Orders screens are crops of `OrderFlow-Orders-Page-Flows.pdf`; the thumbnail is `cfg-thumb-of.json`. Home thumbnails and Work page cards each sit on their product's colours (`mesh` in `cfg-thumb-*.json` and `cfg-card-*.json`: employee teal, OrderFlow orange, driver sage, Heizen charcoal), so they don't read as one product. Home thumbnails follow one style (inspired by ericsin.com): a flat product colour, one subject, shown large and cropped by the frame. The driver one is three phones in isometric view: `node mock.mjs cfg-mock-driver.json ../../public/case/superfine/thumb.jpg`. OrderFlow's (`thumb-pos.jpg`) is its own render with the phone over the POS screen: `node pos3d/render.mjs pos3d/scene-thumb.json th 768`, `python3 pos3d/comp.py th th.jpg`, `python3 pos3d/thumb-crop.py th th.jpg ../../public/case/orderflow/thumb-pos.jpg`. `thumb.jpg` is kept but unused: the hand from the deck's photo holding an orange iPhone on a smooth orange gradient, with a fresh capture of orderflow-client on screen: `node of-phone.mjs`, then `python3 hand-of.py ../../public/case/orderflow/thumb.jpg`. `cfg-thumb-driver.json` is an older version. Thumbnails use lossless stills, not recording frames (those are JPEG at 1.25 to 2x and go soft when enlarged): add `SNAP:name` to a steps file, e.g. `DPR=4 node record.mjs out-hi-of hi-of.json <url> 402 820`, `DPR=3 ... out-hi-driver hi-driver.json` (above 3 the map may not draw), `DPR=2.5 ... out-hi-emp hi-emp.json http://localhost:3100/login 1440 900`.

Heizen Studio: the After screens are a shadcn/ui app in `tools/heizen-studio-ui` (`./node_modules/.bin/vite --port 5190 --strictPort`, then `node shoot-hz.mjs out-hi-hs`). `before-*.png` there are the real platform screenshots. Art: `cfg-card-hs.json`, `cfg-thumb-hs.json`, `cfg-cover-hs.json`.

Retina AI (`public/case/retina-ai/`, repo `compass-ui-ux-designs/retina`): serve its `dist` with an SPA fallback on port 5280, then `node shoot-retina.mjs out-retina`. Stills: `cfg-card-retina.json`, `cfg-cover-retina.json`. The case covers the Nutritionist and Article SME only. No intro film.

OrderFlow Orders tabs (`orders-*.jpg`) are the real admin on fictional data, no login and nothing live: `node mock-of-api.mjs`, then in orderflow-admin-panel `VITE_AUTH_API_URL=http://127.0.0.1:3012/api/v1 DEV_API_TARGET=http://127.0.0.1:3012 npx vite dev --port 3011 --strictPort`, then `DPR=2 node shoot-of-admin.mjs out-of-admin`.

MTB Pay Merchant (`public/case/mtb-pay-merchant/`): screens are cropped from the Figma board PDFs in Merchant.zip into `out-mtb/`, with prototype connector dots repainted. Cover: `node still.mjs cfg-cover-mtb.json .../cover.jpg` (uses the `-body` crops, because the mockup draws its own status bar).

Merchant Experience (`public/case/merchant-experience/`): the thumbnail and Work card are a tablet-in-hands photo (`merch-hand/source.png`) with the real Fund Settlement screen on it: `python3 merch-hand.py ../../public/case/merchant-experience/thumb.jpg ../../public/case/merchant-experience/card.jpg ../../public/case/merchant-experience/cover.jpg` (needs `out-portal/fund-done-clean.png`). 1440 wide screens cropped from the Figma board PDFs in Merchant Portal.zip into `out-portal/`, prototype lines repainted (`*-clean.png`). Stills: `cfg-card-portal.json`, `cfg-cover-portal.json`.

Web weight: before deploying new media, run `python3 tools/optimize-images.py` (progressive JPEGs at quality 80, max 2000 px for backgrounds and 1600 px otherwise; skips files it can't shrink by 10%) and re-encode heavy videos with `node shrink-video.mjs in.mp4 out.mp4 1600000` (Chrome's H.264 encoder; about 1.4 Mbps for screen recordings, 1.6 Mbps for intro films). Bump the file's `?v=` in data.js when you replace it. `vercel.json` sends every route to the app (direct links work) and caches media for a week.
