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
The cover is a path traced 3D scene of a graphite countertop POS (OrderFlow logo on the chin, rounded screen, on a wedge stand of one width: a glossy scooped front landing on a thin plate, matte flanks, a recessed foot) seen square on (`frontal` in scene.json). The home thumbnail (`scene-thumb.json`) adds a silver iPhone in front of it; `phoneCase` gives it an orange silicone case (`pos3d/`, three.js and three-gpu-pathtracer; run `npm i` there once). From this folder: `node pos3d/textures.mjs`, `node pos3d/render.mjs pos3d/scene.json out 768`, then the closer view, which pastes the UI afresh at its scale so it stays sharp: `python3 pos3d/comp.py out out-noui.jpg --no-ui`, `python3 pos3d/zoom.py out ../../public/case/orderflow/cover.jpg 205 0 1480`. Screens and the chin logo are in `pos3d/tex/`; The screens are pasted onto the render by `comp.py`, not rendered, so thin UI lines stay visible. `tex/pos-screen.png` is the real admin on fictional data at the POS screen's ratio: run the mock and admin as for the Orders tabs below, then `node shoot-of-pos.mjs`. The Orders screens are crops of `OrderFlow-Orders-Page-Flows.pdf`; the thumbnail is `cfg-thumb-of.json`. Home thumbnails and Work page cards each sit on their product's colours (`mesh` in `cfg-thumb-*.json` and `cfg-card-*.json`: employee teal, OrderFlow orange, driver sage, Heizen charcoal), so they don't read as one product. Home thumbnails follow one style (inspired by ericsin.com): a flat product colour, one subject, shown large and cropped by the frame. The driver one is three phones in isometric view: `node mock.mjs cfg-mock-driver.json ../../public/case/superfine/thumb.jpg`. OrderFlow's (`thumb-pos.jpg`) is its own render with the phone over the POS screen: `node pos3d/render.mjs pos3d/scene-thumb.json th 768`, `python3 pos3d/comp.py th th.jpg`, `python3 pos3d/thumb-crop.py th th.jpg ../../public/case/orderflow/thumb-pos.jpg`. `thumb.jpg` is kept but unused: the hand from the deck's photo holding an orange iPhone on a smooth orange gradient, with a fresh capture of orderflow-client on screen: `node of-phone.mjs`, then `python3 hand-of.py ../../public/case/orderflow/thumb.jpg`. `cfg-thumb-driver.json` is an older version. The SFK Driver App case cover is two same-size phones close up on a soft sage gradient (route home lower left, the scan sheet higher right, both cropped by the frame): `node still.mjs cfg-cover-driver.json ../../public/case/superfine/cover.jpg`. Thumbnails use lossless stills, not recording frames (those are JPEG at 1.25 to 2x and go soft when enlarged): add `SNAP:name` to a steps file, e.g. `DPR=4 node record.mjs out-hi-of hi-of.json <url> 402 820`, `DPR=3 ... out-hi-driver hi-driver.json` (above 3 the map may not draw), `DPR=2.5 ... out-hi-emp hi-emp.json http://localhost:3100/login 1440 900`.

Heizen Studio Meetings (in More Work, in place of Retina AI): the screens are Sai's Figma file `~/Downloads/Meeting.pdf` (one huge page of 13 flows). `meet-frames.py <scale> <out.png> x y w` renders one frame with Figma's lavender prototype connectors painted out (the connector paths are redrawn as a mask, then inpainted); the frames are 1600 × 1024 (1929 wide with the Meeting List open). Export every frame of a flow into `<dir>/fNN/MM.jpg` at 1.5×, then `python3 meet-flows.py <dir>` builds `out-hs-<flow>/` (each screen held 2.4 s, 0.4 s crossfades) and `cfg-hs-<flow>.json`; `node compose.mjs cfg-hs-<flow>.json hs-<flow>.mp4`, posters with `poster.mjs`, into `public/case/heizen-studio/flows/`. Art (`cfg-card-hs.json`, `cfg-thumb-hs.json`, `cfg-cover-hs.json`) uses `out-hi-hs/meet-dash.png` (`python3 meet-frames.py 2.5 out-hi-hs/meet-dash.png 2741 822 1929`). The older shadcn rebuild is still in `tools/heizen-studio-ui`.

Retina AI (`public/case/retina-ai/`, repo `compass-ui-ux-designs/retina`): serve its `dist` with an SPA fallback on port 5280, then `node shoot-retina.mjs out-retina`. Stills: `cfg-card-retina.json`, `cfg-cover-retina.json`. The case covers the Nutritionist and Article SME only. No intro film.

OrderFlow Orders tabs (`orders-*.jpg`) are the real admin on fictional data, no login and nothing live: `node mock-of-api.mjs`, then in orderflow-admin-panel `VITE_AUTH_API_URL=http://127.0.0.1:3012/api/v1 DEV_API_TARGET=http://127.0.0.1:3012 npx vite dev --port 3011 --strictPort`, then `DPR=2 node shoot-of-admin.mjs out-of-admin`.

MTB Pay Merchant Motion UI (`public/case/mtb-pay-merchant/flows/`): the app has no recording, so `python3 mtb-flows.py "~/Downloads/Section 1.pdf"` (Sai's Figma section "Merchant Scan Consumer QR to Receive Payment": merchant row in red, customer row in blue) plays both sides like recordings into `out-mtb-receive/` + `cfg-mtb-receive.json` (merchant) and `out-mtb-pay/` + `cfg-mtb-pay.json` (customer), and writes the cover's key states to `hero-mtb/`. Compose both, `poster.mjs ... 1.0`, copy as `receive.*` / `pay.*`. The cover loop tells the same payment from both sides: `node hero-mtb.mjs ../../public/case/mtb-pay-merchant/hero.mp4 1100000` (`hero-mtb.html`; `--stills dir t…` to check). The case no longer shows its intro film. The other merchant flows (Dynamic QR Set Amount, Fund Out to Super Agent with Scan QR, Refund, Bill Payment YESC, Top Up) come from the Merchant.zip boards: `python3 mtb-more-flows.py <dir with the unzipped PDFs> [dyn fund refund bill topup]` writes `out-mtb-<flow>/` + `cfg-mtb-<flow>.json` (frame positions and each flow's taps, typing, scrolls and PIN digits are in the script; Figma connector lines are inpainted by their exact colours), then compose each to `public/case/mtb-pay-merchant/flows/<flow>.mp4` with a `poster.mjs ... 0.6` poster.

MTB Pay Merchant (`public/case/mtb-pay-merchant/`): screens are cropped from the Figma board PDFs in Merchant.zip into `out-mtb/`, with prototype connector dots repainted. Cover: `node still.mjs cfg-cover-mtb.json .../cover.jpg` (uses the `-body` crops, because the mockup draws its own status bar).

Merchant Experience (`public/case/merchant-experience/`): the thumbnail and Work card are a tablet-in-hands photo (`merch-hand/source.png`) with the real Fund Settlement screen on it: `python3 merch-hand.py ../../public/case/merchant-experience/thumb.jpg ../../public/case/merchant-experience/card.jpg ../../public/case/merchant-experience/cover.jpg` (needs `out-portal/fund-done-clean.png`). 1440 wide screens cropped from the Figma board PDFs in Merchant Portal.zip into `out-portal/`, prototype lines repainted (`*-clean.png`). Stills: `cfg-card-portal.json`, `cfg-cover-portal.json`.

Web weight: before deploying new media, run `python3 tools/optimize-images.py` (progressive JPEGs at quality 80, max 2000 px for backgrounds and 1600 px otherwise; skips files it can't shrink by 10%) and re-encode heavy videos with `node shrink-video.mjs in.mp4 out.mp4 1600000` (Chrome's H.264 encoder; about 1.4 Mbps for screen recordings, 1.6 Mbps for intro films). Bump the file's `?v=` in data.js when you replace it. `vercel.json` sends every route to the app (direct links work) and caches media for a week.

OrderFlow feature tabs (`public/case/orderflow/feat/`, the Design Execution tabs: `g-*` guest, `a-*` admin).
Guest: run the client with `NEXT_PUBLIC_MOCK_ORDERS=true ORDERFLOW_MOCK_ACCOUNT=true` (signed-in member screens) and record
`of-g-order.json`, `of-g-loyalty.json` on the table QR url and `of-g-pickup.json` on `/fudo-bakery/menu/pickup` with
`MOCKS=mocks-of-pickup.mjs` (fakes the pickup order in the browser, so nothing reaches staging). `of-g-account.json` needs
`ORDERFLOW_MOCK_ACCOUNT=false` (signed out); it fills the form but never submits. All with `TZ_EMU=Europe/London DPR=2 ... 402 820`
(`TZ_EMU` gives a daytime clock). Admin: `node mock-of-api.mjs` (now also menu, loyalty, reports and metrics data), the admin
as for the Orders tabs, then `TZ_EMU=Europe/London DPR=1.25 node record.mjs out-of-a-<f> of-a-<f>.json http://localhost:3011/<page> 1440 900`
for qr (/orders), manual (/orders), reports (/metrics) and newmenu (/menus); restart the mock before each, since the
mock now keeps what a recording changes (items ready, payments, a manual order, a new menu item with `assets-of/espresso.jpg`). Compose `cfg-of-g-*.json` / `cfg-of-a-*.json`; the
step times in data.js are the `caps` compose prints. Edit Order (`sf-f-edit.json`) swaps the meal of a placed order and saves it. The phone versions are `sf-m-<f>.json` (order, orders, edit, auto, diet; the menu button opens My Orders and Auto-Order): `DPR=2 node record.mjs out-sf-m-<f> sf-m-<f>.json http://localhost:3100/login 402 820`, `node compose.mjs cfg-sf-m-<f>.json sf-m-<f>.mp4`, saved as `flows/m-<f>.mp4`. Web recordings show no step list; phone flows show a longer `desc` beside the phone in place of the steps. Steps can also be `FILL:selector|text` (types instantly), `UPLOAD:selector|file` and `SCROLLIN:selector|px` (scrolls one element, e.g. a modal). `explore.mjs`
runs a steps file with a screenshot after each click, for writing new ones.
Pointer: `record.mjs` logs every click (`taps` in index.json) and `"cursor": true` in a cfg draws it: an arrow that
glides to each click with an orange ring on desk recordings, a fingertip dot on phone ones. `lead` (seconds) on a scene
holds its first frame, for a recording that opens on a still screen.

OrderFlow hero loop (`public/case/orderflow/hero.mp4`, in place of the intro film): a 21 s product film of the real
screens on the product's cream, drawn on a canvas in `hero-of.html` from stills in `hero-of/` (frames picked from the
out-of-g-order, out-of-a-qr and out-of-a-reports recordings). After Print Slips the camera pans down to the cashier and kitchen printers; `node print-of.mjs` renders their slips into `hero-of/` with the admin's own receipt template. `node hero-of.mjs out.mp4 600000` records it (camera moves, focus on each tap, app-style screen changes);
`node hero-of.mjs --stills dir 0 6.2 ...` saves frames to check. Chrome's encoder spends the whole bitrate whatever the
picture, so the bitrate sets the size: 650 kbps is about 1.6 MB for the 16 s loop and keeps the UI text clean. It records a keyframe every 0.5 s in 0.25 s pieces, so the first piece is ~60 KB and the cover starts playing almost at once (with 1 s pieces the first was 333 KB). Keep the devices still: only
what changes should move.

Corporate Meal Order cover loop (`public/case/superfine-employee/hero.mp4`, in place of its intro film): the same kind
of product film as OrderFlow's, web only, about the meal subsidy (allowance in the header, a paid extra, "you pay $1.50",
the cart's company-pays / you-pay split, checkout, confirmed). `hero-sf.html` is hero-of.html with one browser, teal focus
and Superfine's mint and yellow background; its screens in `hero-sf/` are stills of the current app: run it (`cd ~/claude-workspace/superfine-corporate-employee && npx next dev -p 3100`), then `DPR=1.25 node record.mjs out-sf-stills sf-stills.json http://localhost:3100/login 1440 900` and copy the PNGs as JPGs. The Order confirmed icon is redrawn in the film (a lunch bag with a check, `newIcon`), the app is unchanged. Clicks and "looks"
(focused and held, not pressed) are listed in DTAPS. `node hero-sf.mjs out.mp4 650000`.

Corporate Meal Order Final UI Design flows (`public/case/superfine-employee/flows/`, web first): run the app on :3100, then
`DPR=1.25 node record.mjs out-sf-f-<f> sf-f-<f>.json http://localhost:3100/login 1440 900` for order, orders, auto and diet
(each signs in off camera first), and `node compose.mjs cfg-sf-f-<f>.json sf-f-<f>.mp4`; the step times in data.js are
the `caps` compose prints. compose now records a keyframe every 0.5 s in 0.25 s pieces and waits for the last chunk.

More Work thumbnails and covers from `mock-thumb.py` (run in this folder): OrderFlow Landing `python3 mock-thumb.py lp thumb.jpg` and `python3 mock-thumb.py lp cover.jpg 31 -13 654 484 1890` (the laptop stays neutral silver; the base is redrawn as amber crystal, `crystal` in the script). Driver app `python3 mock-thumb.py driver thumb.jpg` and `python3 mock-thumb.py driver cover.jpg 0 65 534 395 1600`, so its case page cover is the same hand-held mockup as its thumbnail.
