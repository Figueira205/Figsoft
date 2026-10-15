// Escena 3D de Figsoft.
// El isotipo del logotipo se modela como un objeto físico: seis piezas biseladas con paneles,
// tornillos y tiras de luz. El centro queda vacío, como en el logotipo. Alrededor, órbitas con paquetes
// de datos. El scroll no lo "da vueltas": lo coreografía, de pieza en pieza, con cada sección.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const BLUE = 0x2a7fff, GREEN = 0x1fbf6e, NAVY = 0x3a4478;
// Lados del hexágono: arriba-dcha, dcha, abajo-dcha, abajo-izq, izq, arriba-izq (igual que el logotipo)
const SIDE = [BLUE, GREEN, GREEN, NAVY, BLUE, BLUE];
const GLOW = [0x6fb0ff, 0x5dffa8, 0x5dffa8, 0x7d8cff, 0x6fb0ff, 0x6fb0ff];
const R = 1.32, r = 0.66, DEPTH = 0.58;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));

const hex = (rad, i) => {
  const a = Math.PI / 2 - (i * Math.PI) / 3;
  return new THREE.Vector2(Math.cos(a) * rad, Math.sin(a) * rad);
};
const shrink = (pts, k) => {
  const c = pts.reduce((s, p) => s.add(p), new THREE.Vector2()).multiplyScalar(1 / pts.length);
  return pts.map((p) => p.clone().sub(c).multiplyScalar(k).add(c));
};

// Entorno de estudio: tiras de luz rectangulares que dibujan reflejos nítidos en el barniz.
function studioEnvironment(renderer) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x03050b);
  const panel = (w, h, pos, col, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); s.add(m);
  };
  panel(11, 1.8, [0, 6, 2], 0xffffff, 7);
  panel(1.8, 10, [-7, 0, 2], 0xd5e6ff, 5.5);
  panel(1.4, 10, [7.5, 0, 3], 0xc9ffe3, 4);
  panel(12, 1.2, [0, -5, 4], 0x4a8cff, 3);
  panel(5, 5, [0, 1, -9], 0xffffff, 2.2);
  const tex = new THREE.PMREMGenerator(renderer).fromScene(s, 0.015).texture;
  return tex;
}

function softSprite() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"), grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(0.25, "rgba(255,255,255,.55)"); grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function backdrop() {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 1024;
  const g = c.getContext("2d");
  g.fillStyle = "#070a14"; g.fillRect(0, 0, 1024, 1024);
  const blob = (x, y, rad, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024); };
  blob(790, 220, 560, "43,134,255", 0.2);
  blob(80, 760, 480, "34,194,110", 0.09);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Una pieza del hexágono: trapecio biselado, paneles delante y detrás, tornillos y tiras de luz.
function buildSegment(i, mats) {
  const g = new THREE.Group();
  const a = hex(R, i), b = hex(R, i + 1), c = hex(r, i + 1), d = hex(r, i);
  const pts = shrink([a, b, c, d], 0.984);
  const bs = 0.05, depth = DEPTH - bs * 2;
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth, bevelEnabled: true, bevelThickness: bs, bevelSize: bs, bevelOffset: -bs, bevelSegments: 7, curveSegments: 1 }),
    mats.body[i]);
  body.geometry.translate(0, 0, -depth / 2);
  g.add(body);

  // Paneles satinados incrustados (delante y detrás): contraste brillo / mate
  const plateShape = new THREE.Shape(shrink(pts, 0.78));
  const plateGeo = new THREE.ExtrudeGeometry(plateShape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelOffset: -0.012, bevelSegments: 3, curveSegments: 1 });
  for (const side of [1, -1]) {
    const p = new THREE.Mesh(plateGeo, mats.plate[i]);
    p.position.z = side > 0 ? DEPTH / 2 - 0.002 : -DEPTH / 2 + 0.002;
    if (side < 0) p.rotation.y = Math.PI, p.position.z = -DEPTH / 2 + 0.002;
    g.add(p);
  }

  // Tornillos en las esquinas exteriores de la cara frontal
  const cen = pts.reduce((s, p) => s.add(p), new THREE.Vector2()).multiplyScalar(0.25);
  const outerA = pts[0], outerB = pts[1];
  for (const q of [outerA, outerB]) {
    const pos = q.clone().sub(cen).multiplyScalar(0.8).add(cen);
    const screw = new THREE.Mesh(mats.screwGeo, mats.screw);
    screw.rotation.x = Math.PI / 2; screw.position.set(pos.x, pos.y, DEPTH / 2 + 0.006);
    const socket = new THREE.Mesh(mats.socketGeo, mats.socketMat);
    socket.rotation.x = Math.PI / 2; socket.position.set(pos.x, pos.y, DEPTH / 2 + 0.03);
    g.add(screw, socket);
  }

  // Tiras de luz en las caras exterior e interior (aquí circula el pulso de datos)
  const strips = [];
  for (const [p, q] of [[pts[0], pts[1]], [pts[3], pts[2]]]) {
    const mid = p.clone().add(q).multiplyScalar(0.5);
    const n = mid.clone().sub(cen).normalize();
    const strip = new THREE.Mesh(new THREE.BoxGeometry(p.distanceTo(q) * 0.62, 0.012, 0.05), mats.strip[i].clone());
    strip.position.set(mid.x + n.x * 0.004, mid.y + n.y * 0.004, 0);
    strip.rotation.z = Math.atan2(q.y - p.y, q.x - p.x);
    g.add(strip); strips.push(strip);
  }

  const mid = a.clone().add(b).multiplyScalar(0.5).normalize();
  g.userData = { dir: new THREE.Vector3(mid.x, mid.y, 0), strips, index: i };
  return g;
}

function buildMark() {
  const rig = new THREE.Group();
  const mats = {
    body: SIDE.map((c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.18, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.25 })),
    plate: SIDE.map((c) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c).multiplyScalar(0.8), metalness: 0.5, roughness: 0.5, envMapIntensity: 1.1 })),
    strip: GLOW.map((c) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2.2), toneMapped: false })),
    screw: new THREE.MeshStandardMaterial({ color: 0xcfd6e4, metalness: 1, roughness: 0.22 }),
    socketMat: new THREE.MeshStandardMaterial({ color: 0x0a0d18, metalness: 0.2, roughness: 0.6 }),
    screwGeo: new THREE.CylinderGeometry(0.036, 0.036, 0.018, 20),
    socketGeo: new THREE.CylinderGeometry(0.016, 0.016, 0.006, 6),
  };
  const segs = [];
  for (let i = 0; i < 6; i++) { const s = buildSegment(i, mats); rig.add(s); segs.push(s); }
  return { rig, segs };
}

// Órbitas con paquetes de datos que las recorren
function buildOrbits(sprite) {
  const group = new THREE.Group();
  const defs = [
    { rad: 1.95, tilt: [1.15, 0.2, 0.3], n: 3, speed: 0.22, col: 0x57a6ff },
    { rad: 2.4, tilt: [0.5, 0.9, -0.2], n: 4, speed: -0.16, col: 0x4dffa6 },
    { rad: 2.95, tilt: [1.45, -0.5, 0.1], n: 3, speed: 0.11, col: 0x57a6ff },
  ];
  const packets = [];
  const buf = new Float32Array(defs.reduce((s, d) => s + d.n, 0) * 3), col = new Float32Array(buf.length);
  let k = 0;
  const tmp = new THREE.Color();
  for (const d of defs) {
    const pts = [];
    for (let j = 0; j <= 220; j++) { const a = (j / 220) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * d.rad, 0, Math.sin(a) * d.rad)); }
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: d.col, transparent: true, opacity: 0.14 }));
    const holder = new THREE.Group(); holder.rotation.set(...d.tilt); holder.add(ring); group.add(holder);
    for (let j = 0; j < d.n; j++) { packets.push({ d, holder, phase: j / d.n, k }); tmp.set(d.col).multiplyScalar(2.4); col.set([tmp.r, tmp.g, tmp.b], k * 3); k++; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(buf, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.2, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  pts.frustumCulled = false;
  group.add(pts);
  const world = new THREE.Vector3();
  return {
    group,
    update(t, rigScale) {
      for (const p of packets) {
        const a = (p.phase + t * p.d.speed) * Math.PI * 2;
        world.set(Math.cos(a) * p.d.rad, 0, Math.sin(a) * p.d.rad).applyEuler(p.holder.rotation);
        buf[p.k * 3] = world.x; buf[p.k * 3 + 1] = world.y; buf[p.k * 3 + 2] = world.z;
      }
      geo.attributes.position.needsUpdate = true;
    },
    ringMaterials: group.children.filter((c) => c.isGroup).map((h) => h.children[0].material),
  };
}

function buildDust(n, sprite) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const p = new THREE.Vector3().randomDirection().multiplyScalar(5 + Math.random() * 12); pos.set([p.x, p.y, p.z - 4], i * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.07, map: sprite, color: 0x8db8ff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
}

export function initScene(canvas, { reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  let mobile = innerWidth < 800;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.background = backdrop();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(0, 0, 10);

  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-3, 4, 6); scene.add(key);
  const rimB = new THREE.PointLight(0x2b86ff, 70, 16); rimB.position.set(-4.5, -1.5, -2); scene.add(rimB);
  const rimG = new THREE.PointLight(0x22c26e, 55, 16); rimG.position.set(4.5, 2, -2.5); scene.add(rimG);

  const sprite = softSprite();
  const world = new THREE.Group(); scene.add(world);
  const { rig: markRig, segs } = buildMark();
    const orbits = buildOrbits(sprite);
  const body = new THREE.Group(); body.add(markRig);
  world.add(body, orbits.group);
  scene.add(buildDust(mobile ? 280 : 520, sprite));

  // Disco de luz bajo el objeto: lo asienta en la escena
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(60,140,255,.55)"); gr.addColorStop(0.5, "rgba(60,140,255,.12)"); gr.addColorStop(1, "rgba(60,140,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.1; world.add(floor);

  // Postproceso: solo lo emisivo brilla
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.5, 0.7, 0.95);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  function resize() {
    const w = innerWidth, h = innerHeight;
    mobile = w < 800;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h; camera.fov = mobile ? 44 : 32; camera.updateProjectionMatrix();
    measure();
  }

  // Coreografía: una pose por sección, interpolada con el scroll
  const IDS = ["top", "servicios", "metodo", "proyectos", "stack", "equipo", "contacto"];
  let stops = [];
  function measure() {
    stops = IDS.map((id) => { const el = document.getElementById(id); const top = el.getBoundingClientRect().top + scrollY; return top + el.offsetHeight / 2; });
    stops[0] = innerHeight * 0.5; // con scroll 0 el centro del visor coincide con la portada
  }
  const D = (x, y, s, ex, ry, rx, rz, orb, dim) => ({ x, y, s, ex, ry, rx, rz, orb, dim });
  const poses = () => mobile ? [
    D(0, 2.7, 0.78, 0, -0.35, 0.12, 0, 0.8, 0.5),
    D(0, 3.3, 0.5, 1, -0.6, 0.2, 0, 0.5, 0.28),
    D(0, 3.3, 0.5, 0.2, 0.1, 0.1, 0, 0.5, 0.28),
    D(0, 3.3, 0.5, 0.5, 0.5, 0.1, 0, 1, 0.28),
    D(0, 3.3, 0.5, 0, -0.3, 0.1, 0, 0.5, 0.25),
    D(0, 3.3, 0.5, 0, 0.3, 0.1, 0, 0.5, 0.25),
    D(0, 3.3, 0.5, 0, 0, 0.1, 0, 0.5, 0.25),
  ] : [
    //  x     y    esc  expl  rotY   rotX   rotZ  órbitas dim
    D(3.05, 0.05, 1.0, 0, -0.3, 0.1, 0, 1, 1),         // portada: ensamblado, de tres cuartos
    D(2.75, 0.5, 0.72, 0.55, -0.5, 0.2, 0.08, 0.8, 0.95), // servicios: se abre, una pieza por área
    D(-3.2, -1.75, 0.66, 0.12, 0.1, 0.1, 0, 0.6, 0.95),  // método: pasa a la izquierda, bajo el titular, y gira a pasos
    D(3.0, 1.35, 0.52, 0.5, 0.4, 0.14, 0, 1, 0.95),     // casos de uso: ocupa el hueco junto al titular
    D(3.2, 0.2, 0.74, 0, -0.25, 0.12, 0, 0.7, 0.85),    // tecnología
    D(3.0, 0.4, 0.78, 0.1, 0.28, 0.1, 0, 0.7, 0.9),     // equipo
    D(-3.15, -1.3, 0.72, 0, 0, 0.08, 0, 0.9, 0.95),     // contacto: vuelve a la izquierda y se cierra frente a cámara
  ];

  const pose = { x: 3, y: 0, s: 1, ex: 0, ry: 0, rx: 0, rz: 0, orb: 1, dim: 1 };
  const target = { ...pose };
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener("pointermove", (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });

  function computeTarget() {
    const P = poses(), y = scrollY + innerHeight * 0.5;
    let k = 0;
    while (k < stops.length - 2 && y > stops[k + 1]) k++;
    const span = Math.max(1, stops[k + 1] - stops[k]);
    const t = ease(clamp((y - stops[k]) / span, 0, 1));
    for (const key of Object.keys(target)) target[key] = lerp(P[k][key], P[k + 1][key], t);
    // Al cruzar de un lado al otro se atenúa, para no tapar el texto que atraviesa
    if (P[k].x * P[k + 1].x < 0) target.dim *= 1 - 0.55 * Math.sin(Math.PI * t);
    // El método gira a pasos, uno por fase, sincronizado con la línea de progreso
    const rc = document.getElementById("steps").getBoundingClientRect();
    const p = clamp((innerHeight * 0.62 - rc.top) / rc.height, 0, 1);
    stepRot.target = rc.bottom < innerHeight * 0.4 ? Math.PI * 2 : Math.min(3, Math.floor(p * 4 + 0.001)) * (Math.PI / 3);
  }
  const stepRot = { v: 0, vel: 0, target: 0 };

  const clock = new THREE.Clock();
  let intro = reduced ? 1 : 0, introT = reduced ? 9 : 0, running = true, raf = 0;
  const camBase = new THREE.Vector3();
  const pulse = (u) => Math.pow(Math.max(0, 1 - Math.abs(u) * 2.4), 3);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    introT = reduced ? 9 : introT + dt;
    intro = Math.min(1, introT / 2.8);
    const e = 1 - Math.pow(1 - intro, 4);
    computeTarget();
    const k = reduced ? 1 : 3.2;
    for (const key of Object.keys(pose)) pose[key] = reduced ? target[key] : damp(pose[key], target[key], k, dt);
    // muelle ligeramente subamortiguado: cada paso asienta con un pequeño rebote
    stepRot.vel += ((stepRot.target - stepRot.v) * 38 - stepRot.vel * 9) * dt; stepRot.v += stepRot.vel * dt;
    mouse.sx = damp(mouse.sx, mouse.x, 3, dt); mouse.sy = damp(mouse.sy, mouse.y, 3, dt);

    // Ensamblado de entrada: seis piezas, escalonadas, cada una llega girando desde su lado y encaja con un leve rebote
    segs.forEach((s, i) => {
      const d = s.userData.dir;
      const p = clamp((introT - 0.25 - i * 0.2) / 1.1, 0, 1), o = 1 - easeOutBack(p);
      const local = pose.ex + o * 3.4;
      s.position.set(d.x * local * 0.85, d.y * local * 0.85, (i - 2.5) * 0.12 * pose.ex - o * 1.4);
      s.rotation.set(o * (i % 2 ? 0.5 : -0.5), o * 0.4, o * (i % 2 ? 1.1 : -1.1));
      s.scale.setScalar(lerp(0.6, 1, clamp(p * 2, 0, 1)));
      // destello al encajar + pulso de luz que recorre el anillo después
      const flash = Math.exp(-Math.max(0, introT - (0.25 + i * 0.2 + 1.1)) * 3.5) * (p >= 1 ? 1 : 0);
      const u = ((t * 0.5 - i / 6) % 1 + 1) % 1;
      const amp = 0.35 + 1.7 * pulse(u > 0.5 ? u - 1 : u) + 2.2 * flash;
      for (const st of s.userData.strips) st.material.color.set(GLOW[i]).multiplyScalar(amp);
    });
    const sway = 0;
    body.position.set(pose.x * (1 - (1 - e) * 0.1), pose.y + Math.sin(t * 0.8) * 0.035 + (1 - e) * -0.4, (1 - e) * -3);
    body.scale.setScalar(pose.s * lerp(0.85, 1, e));
    body.rotation.set(pose.rx + mouse.sy * 0.22 + sway * 0.6, pose.ry + mouse.sx * 0.38 + sway, pose.rz);
    markRig.rotation.z = stepRot.v;
    orbits.group.position.copy(body.position); orbits.group.scale.setScalar(body.scale.x);
    orbits.group.rotation.y = t * 0.05;
    orbits.update(t);
    for (const m of orbits.ringMaterials) m.opacity = 0.04 + 0.13 * pose.orb;
    floor.position.set(body.position.x, body.position.y - 1.45 * body.scale.x - 0.5, body.position.z);
    floor.scale.setScalar(body.scale.x * 1.2);
    floor.material.opacity = 0.5 * pose.dim * e;

    camera.position.set(mouse.sx * 0.5, -mouse.sy * 0.32 + 0.05, 10 + (1 - e) * 3);
    camera.lookAt(0, 0, 0);

    canvas.style.setProperty("--stage", String(clamp(pose.dim * (mobile ? 0.9 : 1), 0.15, 1)));
    composer.render();
    if (running && !reduced) raf = requestAnimationFrame(frame);
  }

  addEventListener("resize", () => { resize(); if (reduced) frame(); });
  resize();
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !reduced) { clock.getDelta(); raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
  });
  if (reduced) { frame(); addEventListener("scroll", frame, { passive: true }); }
  else frame();
  requestAnimationFrame(() => canvas.classList.add("is-ready"));
}
