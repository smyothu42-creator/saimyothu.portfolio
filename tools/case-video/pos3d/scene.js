// OrderFlow cover: a countertop POS and a phone, modelled and path traced. Sizes in cm.
import * as THREE from 'three'
import { WebGLPathTracer } from 'three-gpu-pathtracer'

const load = (u) => new Promise((ok, no) => new THREE.TextureLoader().load(u, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; t.generateMipmaps = true; ok(t) }, undefined, no))

function rounded(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0)
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2)
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  return s
}
// A solid slab, centred, front face at z = +d/2, with softened edges.
function slab(w, h, d, r, bevel, mat) {
  const g = new THREE.ExtrudeGeometry(rounded(w - 2 * bevel, h - 2 * bevel, Math.max(r - bevel, 0.01)), { depth: d - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 8, curveSegments: 32 })
  g.translate(0, 0, -(d - 2 * bevel) / 2)
  return new THREE.Mesh(g, mat)
}
// A rounded frame (a slab with a rounded hole), front face at z = 0, for the case's lip.
function frame(w, h, r, wi, hi, ri, d, bevel, mat) {
  const s = rounded(w - 2 * bevel, h - 2 * bevel, r - bevel); s.holes.push(rounded(wi + 2 * bevel, hi + 2 * bevel, ri + bevel))
  const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 8, curveSegments: 48 })
  g.translate(0, 0, -(d - bevel))
  return new THREE.Mesh(g, mat)
}
// A flat panel with UVs filling the rounded shape.
function panel(w, h, r, mat) {
  const g = new THREE.ShapeGeometry(rounded(w, h, r), 32), p = g.attributes.position, uv = g.attributes.uv
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5)
  return new THREE.Mesh(g, mat)
}

// The stand: rounded-rectangle rings stacked from top to bottom, all one width, so the side
// profile (a wedge with a scooped front) runs the full width. `rings` is a list of
// { y, f, b, w, r }: height, front and back z, half the width, corner radius. Faces looking
// sideways take `flankMat`, the rest `mat`.
function loft(rings, mat, flankMat) {
  const N = 10, pos = [], M = 4 * (N + 1), top = [], flank = []
  for (const q of rings) {
    const cz = (q.f + q.b) / 2, hd = (q.f - q.b) / 2, r = Math.min(q.r, hd, q.w)
    for (const [sx, sz, a0] of [[1, 1, 0], [-1, 1, 90], [-1, -1, 180], [1, -1, 270]])
      for (let i = 0; i <= N; i++) { const a = THREE.MathUtils.degToRad(a0 + (90 * i) / N); pos.push(sx * (q.w - r) + Math.cos(a) * r, q.y, cz + sz * (hd - r) + Math.sin(a) * r) }
  }
  const quads = []
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < M; j++) {
    const a = i * M + j, b = i * M + (j + 1) % M, c = a + M, d = b + M
    quads.push([a, b, c, b, d, c])
  }
  const all = new THREE.BufferGeometry(); all.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); all.setIndex(quads.flat()); all.computeVertexNormals()
  const n = all.attributes.normal
  for (const q of quads) (Math.abs(n.getX(q[0]) + n.getX(q[1]) + n.getX(q[2]) + n.getX(q[4])) / 4 > 0.8 ? flank : top).push(...q)
  const part = (idx, m) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', all.attributes.position); g.setAttribute('normal', n); g.setIndex(idx); return new THREE.Mesh(g, m) }
  const group = new THREE.Group(); group.add(part(top, mat), part(flank, flankMat))
  return group
}

function studio() {
  // A dark studio with big softboxes, as an HDR panorama.
  const W = 1024, H = 512, d = new Float32Array(W * H * 4)
  const box = (az, el, aw, ah, v, c = [1, 1, 1]) => ({ az, el, aw, ah, v, c })
  const boxes = [
    box(-55, 48, 46, 26, 15, [1, 0.98, 0.95]),   // key: high, camera left
    box(62, 22, 26, 44, 6, [0.82, 0.9, 1]),      // cool strip, right
    box(170, 30, 70, 30, 5, [0.7, 0.8, 1]),      // rim from behind
    box(0, 82, 80, 14, 5),                       // overhead
    box(0, 33, 110, 11, 3.2),                    // low strip: the band of light across the stand's scoop
  ]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const az = (x / W) * 360 - 180, el = 90 - (y / H) * 180
    let r = 0.46, g = 0.47, b = 0.5
    for (const q of boxes) {
      let da = Math.abs(az - q.az); if (da > 180) da = 360 - da
      const ex = Math.max(0, Math.min(1, (q.aw / 2 - da) / 6 + 0.5)), ey = Math.max(0, Math.min(1, (q.ah / 2 - Math.abs(el - q.el)) / 6 + 0.5))
      const m = ex * ey * q.v; r += m * q.c[0]; g += m * q.c[1]; b += m * q.c[2]
    }
    const i = ((H - 1 - y) * W + x) * 4; d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 1
  }
  const t = new THREE.DataTexture(d, W, H, THREE.RGBAFormat, THREE.FloatType)
  t.mapping = THREE.EquirectangularReflectionMapping; t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true
  return t
}

window.build = async (o) => {
  const W = o.W, H = o.H
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1); renderer.setSize(W, H); renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = o.exposure ?? 1
  document.body.appendChild(renderer.domElement)
  const scene = new THREE.Scene(); scene.environment = studio(); scene.background = new THREE.Color(0, 0, 0)
  const [posTex, phoneTex, chinTex] = await Promise.all([load('/tex/pos-screen.png'), load('/tex/phone.png'), load('/tex/chin.png')])

  const shell = new THREE.MeshStandardMaterial({ color: '#f1f1f0', roughness: 0.38, metalness: 0 })
  const metal = new THREE.MeshStandardMaterial({ color: '#dcdde0', roughness: 0.36, metalness: 1 })
  const dark = new THREE.MeshStandardMaterial({ color: '#08080a', roughness: 0.25 })
  const glow = (t, k = 1) => new THREE.MeshPhysicalMaterial({ color: '#000', roughness: 0.12, emissive: '#fff', emissiveMap: t, emissiveIntensity: k, clearcoat: 1, clearcoatRoughness: 0.06 })

  // --- POS: a countertop terminal. Graphite metal body, black glass front with a deeper
  // chin for the logo, on a wedge stand with a glossy scooped front, matte flanks and a thin plate.
  const pos = new THREE.Group()
  const graphite = new THREE.MeshStandardMaterial({ color: '#5d5f64', roughness: 0.4, metalness: 0.85 })
  const rubber = new THREE.MeshStandardMaterial({ color: '#0b0b0d', roughness: 0.6 })
  const glass = new THREE.MeshStandardMaterial({ color: '#060608', roughness: 0.1 })
  const SW = 35, SH = SW * o.posRatio, top = 1.5, chin = 3.2, TW = SW + 3, TH = SH + top + chin, TD = 3, standH = o.standH ?? 8
  const tablet = new THREE.Group()
  tablet.add(slab(TW, TH, TD, 3.2, 0.6, graphite))
  const f = TD / 2
  const front = panel(TW - 1.3, TH - 1.3, 2.7, glass); front.position.z = f + 0.004; tablet.add(front)
  const cy = (chin - top) / 2
  const screen = panel(SW, SH, o.screenRadius ?? 1.4, glow(posTex, o.screen ?? 1)); screen.position.set(0, cy, f + 0.012); screen.userData.flat = [SW, SH]; tablet.add(screen)
  const cw = 11
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(cw, cw * 0.2), new THREE.MeshStandardMaterial({ map: chinTex, roughness: 0.1 }))
  logo.position.set(0, -TH / 2 + chin / 2 + 0.2, f + 0.01); tablet.add(logo)
  tablet.rotation.x = -THREE.MathUtils.degToRad(o.tilt ?? 9); tablet.position.set(0, standH + TH / 2, 0); pos.add(tablet)
  // Stand, after the reference product. One width throughout: seen from the side it is a wedge,
  // a straight rear wall leaning forward up to the tablet's back, and a big concave scoop down
  // the front that lands on a flat plate. Glossy scoop and plate, matte flanks, a thin metal
  // line along the bottom, and a recessed foot.
  const lean = THREE.MathUtils.degToRad(o.tilt ?? 9), half = 0.55
  const hw = o.standW ?? 10.6, plateF = o.plateFront ?? 9.6, plateB = o.plateBack ?? -5.4, plateR = o.plateR ?? 2
  const under = 0.5, lip = under + 0.85, edge = 0.3, scoopEnd = o.scoopEnd ?? 5.4, scoopTop = standH + 3, top2 = standH + 9
  const zTop = (TH / 2) * Math.sin(lean) - 1.2 * Math.cos(lean)
  const neck = (y) => zTop + (standH - y) * Math.tan(lean) + half
  const slope = (-1.8 - plateB) / (top2 - under), rear = (y) => plateB + (y - under) * slope
  const rings = []
  for (let i = 0; i <= 8; i++) { const y = top2 - (i / 8) * (top2 - scoopTop); rings.push({ y, f: neck(y), b: rear(y), w: hw, r: 0.4 }) }
  // The scoop is a quarter ellipse: it leaves the neck straight and lands flat on the plate.
  for (let i = 1; i <= 90; i++) {
    const a = (i / 90) * (Math.PI / 2), u = 1 - Math.cos(a), y = scoopTop - Math.sin(a) * (scoopTop - lip)
    rings.push({ y, f: neck(y) + (scoopEnd - neck(y)) * u, b: rear(y), w: hw, r: 0.4 })
  }
  // The flat of the plate, its rounded rim, and its edge down to the underside.
  rings.push({ y: lip, f: plateF - edge, b: rear(lip), w: hw, r: plateR })
  for (let i = 1; i <= 14; i++) { const a = (i / 14) * (Math.PI / 2), o2 = edge * Math.sin(a); rings.push({ y: lip - edge * (1 - Math.cos(a)), f: plateF - edge + o2, b: rear(lip), w: hw, r: plateR }) }
  rings.push({ y: under, f: plateF, b: plateB, w: hw, r: plateR }, { y: under - 0.02, f: 0.2, b: -0.2, w: 0.2, r: 0.1 })
  const gloss = new THREE.MeshStandardMaterial({ color: '#0d0d10', roughness: 0.2 })
  const matte = new THREE.MeshStandardMaterial({ color: '#23242a', roughness: 0.46, metalness: 0.3 })
  pos.add(loft(rings, gloss, matte))
  const plan = (inset, h, y, m, r) => { const q = slab(2 * hw - 2 * inset, plateF - plateB - 2 * inset, h, r, 0.03, m); q.rotation.x = Math.PI / 2; q.position.set(0, y, (plateF + plateB) / 2); pos.add(q) }
  plan(0.06, 0.1, under - 0.05, metal, plateR)
  plan(1.1, under - 0.1, (under - 0.1) / 2, rubber, plateR - 0.8)
  // The seam down each flank, parallel to the rear wall.
  const y0 = lip + 0.2, y1 = top2, L = Math.hypot(y1 - y0, (y1 - y0) * slope)
  for (const sx of [1, -1]) { const seam = new THREE.Mesh(new THREE.BoxGeometry(0.02, L, 0.07), rubber); seam.rotation.x = Math.atan(slope); seam.position.set(sx * (hw + 0.008), (y0 + y1) / 2, rear((y0 + y1) / 2) + 1); pos.add(seam) }
  pos.visible = !o.floorOnly; pos.rotation.y = THREE.MathUtils.degToRad(o.posYaw ?? 14); pos.position.set(...(o.posAt || [-3, 0, 0])); scene.add(pos)

  // --- Phone: bare with a silver frame, or with `phoneCase` in an orange silicone case ---
  const PW = 7.19, PH = PW * 2.087, PD = 0.82
  const phone = new THREE.Group()
  if (o.phoneCase) {
    // A soft-touch silicone case: a little larger than the phone, with a raised lip round the
    // screen, the phone's own black glass showing inside it, moulded button covers and a
    // cut-out for the Action button.
    const orange = new THREE.MeshStandardMaterial({ color: '#e9752b', roughness: 0.62 })
    const caseC = 0.2, caseR = PW * 0.167, casePf = PD / 2
    const caseBody = slab(PW + 2 * caseC, PH + 2 * caseC, PD + 0.18, caseR + caseC, 0.42, orange); caseBody.position.z = -0.09; phone.add(caseBody)
    const caseLip = frame(PW + 2 * caseC, PH + 2 * caseC, caseR + caseC, PW - 0.12, PH - 0.12, caseR - 0.06, 0.2, 0.07, orange); caseLip.position.z = casePf + 0.11; phone.add(caseLip)
    const caseGlass = panel(PW, PH, caseR, new THREE.MeshStandardMaterial({ color: '#050506', roughness: 0.08 })); caseGlass.position.z = casePf + 0.002; phone.add(caseGlass)
    const face = panel(PW - 0.2, PH - 0.2, PW * 0.152, glow(phoneTex, o.screen ?? 1)); face.position.z = casePf + 0.004; face.userData.flat = [PW - 0.2, PH - 0.2]; phone.add(face)
    for (const [y, h] of [[3.0, 1.0], [1.7, 1.0]]) { const b = slab(0.16, h + 0.2, 0.42, 0.08, 0.07, orange); b.position.set(-PW / 2 - caseC - 0.04, y, -0.03); phone.add(b) }
    const caseAction = slab(0.08, 0.62, 0.3, 0.04, 0.02, rubber); caseAction.position.set(-PW / 2 - caseC - 0.005, 4.5, -0.03); phone.add(caseAction)
    const caseSide = slab(0.16, 1.5, 0.42, 0.08, 0.07, orange); caseSide.position.set(PW / 2 + caseC + 0.04, 2.6, -0.03); phone.add(caseSide)
  } else {
    // Bare phone: silver frame.
    phone.add(slab(PW, PH, PD, PW * 0.167, 0.2, new THREE.MeshStandardMaterial({ color: '#dcdde0', roughness: 0.26, metalness: 1 })))
    const face = panel(PW - 0.2, PH - 0.2, PW * 0.152, glow(phoneTex, o.screen ?? 1)); face.position.z = PD / 2 + 0.004; face.userData.flat = [PW - 0.2, PH - 0.2]; phone.add(face)
    for (const [y, h] of [[3.9, 0.9], [2.5, 1.05], [1.2, 1.05]]) { const b = slab(0.12, h, 0.3, 0.05, 0.03, metal); b.position.set(-PW / 2 - 0.02, y, 0); phone.add(b) }
  }
  const face = phone.children.find((c) => c.userData.flat)
  phone.visible = !o.floorOnly && !o.noPhone; phone.rotation.set(-THREE.MathUtils.degToRad(o.phoneTilt ?? 9), THREE.MathUtils.degToRad(o.phoneYaw ?? -12), 0, 'YXZ')
  const ps = o.phoneScale ?? 1; phone.scale.setScalar(ps); phone.position.set(o.phoneAt[0], PH * ps / 2 + 0.05, o.phoneAt[1]); scene.add(phone)

  // --- Counter ---
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: '#050609', roughness: 0.3 })); floor.rotation.x = -Math.PI / 2; scene.add(floor)

  const cam = new THREE.PerspectiveCamera(o.fov ?? 17, W / H, 1, 2000)
  if (o.frontal) {
    // Square on to the POS screen: the camera sits on the screen's own axis, so the screen is an
    // exact rectangle. `shift` moves the framing without turning the camera.
    scene.updateMatrixWorld(true)
    const c = screen.getWorldPosition(new THREE.Vector3()), n = new THREE.Vector3(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(new THREE.Quaternion()))
    cam.position.copy(c).addScaledVector(n, o.frontal.dist); cam.up.set(0, 1, 0); cam.lookAt(c)
    cam.setViewOffset(W, H, 0, (o.frontal.shift || 0) * H, W, H)
  } else { cam.position.set(...(o.cam || [-14, 21, 112])); cam.lookAt(...(o.look || [3, 7, 0])) }
  cam.updateMatrixWorld()
  scene.updateMatrixWorld(true)
  window._ = { renderer, scene, cam, floor, screens: { pos: screen, phone: face } }
  const pt = new WebGLPathTracer(renderer)
  pt.textureSize.set(2048, 2048); pt.tiles.set(o.tiles ?? 2, o.tiles ?? 2); pt.bounces = 6; pt.filterGlossyFactor = 0.25; pt.renderScale = 1; pt.dynamicLowRes = false; pt.renderDelay = 0; pt.minSamples = 1; pt.fadeDuration = 0
  pt.setScene(scene, cam)
  window._.pt = pt
  return 'ready'
}
window.step = (n) => { const { pt } = window._; const t = performance.now(); for (let i = 0; i < n; i++) pt.renderSample(); window._.renderer.getContext().finish(); return { samples: pt.samples, ms: performance.now() - t } }
window.grab = () => window._.renderer.domElement.toDataURL('image/png')
// Object mask: everything but the counter, flat white.
window.mask = () => {
  const { renderer, scene, cam, floor } = window._
  floor.visible = false; const env = scene.environment; scene.environment = null
  scene.overrideMaterial = new THREE.MeshBasicMaterial({ color: '#fff', side: THREE.DoubleSide, toneMapped: false })
  renderer.setClearColor(0, 1); renderer.toneMapping = THREE.NoToneMapping; renderer.render(scene, cam)
  scene.overrideMaterial = null; floor.visible = true; scene.environment = env
  return renderer.domElement.toDataURL('image/png')
}
// Where a screen lands in the image, for pasting the real UI on afterwards: its corners
// (TL TR BR BL, in pixels) and a mask of the part that isn't hidden by anything in front.
window.screenPass = (name) => {
  const { renderer, scene, cam, floor, screens } = window._, m = screens[name], [w, h] = m.userData.flat
  const { width: W, height: H } = renderer.domElement
  const quad = [[-w / 2, h / 2], [w / 2, h / 2], [w / 2, -h / 2], [-w / 2, -h / 2]].map(([x, y]) => {
    const p = m.localToWorld(new THREE.Vector3(x, y, 0)).project(cam)
    return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]
  })
  const black = new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false }), white = new THREE.MeshBasicMaterial({ color: '#fff', toneMapped: false })
  const keep = new Map(); scene.traverse((o) => { if (o.isMesh) { keep.set(o, o.material); o.material = o === m ? white : black } })
  floor.visible = false; const env = scene.environment; scene.environment = null
  renderer.setClearColor(0, 1); renderer.toneMapping = THREE.NoToneMapping; renderer.render(scene, cam)
  const mask = renderer.domElement.toDataURL('image/png')
  keep.forEach((v, o) => { o.material = v }); floor.visible = true; scene.environment = env
  return { quad, mask }
}
