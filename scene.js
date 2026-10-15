// Escenario 3D de Figsoft: el isotipo del logotipo (hexágono en tres colores) extruido,
// rodeado de una red de nodos y partículas. Todo reacciona al ratón y al scroll.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const BLUE = 0x2b86ff, GREEN = 0x22c26e, NAVY = 0x2f3558;

// Hexágono "pointy-top": los seis lados se colorean como en el logotipo
// (azul arriba y a la izquierda, azul marino abajo a la izquierda, verde a la derecha).
const SIDE_COLORS = [BLUE, GREEN, GREEN, NAVY, BLUE, BLUE]; // lados: arriba-dcha, dcha, abajo-dcha, abajo-izq, izq, arriba-izq

function hexPoint(r, i) {
  const a = Math.PI / 2 - (i * Math.PI) / 3; // vértice 0 arriba
  return new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r);
}

function buildMark() {
  const g = new THREE.Group();
  const R = 1.3, r = 0.65, depth = 0.8;
  for (let i = 0; i < 6; i++) {
    const a = hexPoint(R, i), b = hexPoint(R, i + 1), c = hexPoint(r, i + 1), d = hexPoint(r, i);
    const shape = new THREE.Shape([a, b, c, d]);
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
    geo.translate(0, 0, -depth / 2);
    const mat = new THREE.MeshPhysicalMaterial({ color: SIDE_COLORS[i], roughness: 0.42, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.15 });
    g.add(new THREE.Mesh(geo, mat));
  }
  return g;
}

function buildNetwork(count, radius) {
  const group = new THREE.Group();
  const pts = [];
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(boxGeo);
  const cubes = [];
  for (let i = 0; i < count; i++) {
    const dir = new THREE.Vector3().randomDirection();
    const p = dir.multiplyScalar(radius * (0.75 + Math.random() * 0.9));
    const s = 0.1 + Math.random() * 0.2;
    const col = Math.random() > 0.5 ? BLUE : GREEN;
    const m = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.35, roughness: 0.4, emissive: col, emissiveIntensity: 0.5 }));
    m.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 })));
    m.position.copy(p); m.scale.setScalar(s);
    m.userData = { spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).multiplyScalar(0.6), phase: Math.random() * 6.28, base: p.clone() };
    group.add(m); cubes.push(m); pts.push(p);
  }
  const seg = [];
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++)
      if (pts[i].distanceTo(pts[j]) < radius * 0.75) seg.push(pts[i], pts[j]);
  const lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), new THREE.LineBasicMaterial({ color: 0x4f7fd0, transparent: true, opacity: 0.22 }));
  group.add(lines);
  return { group, cubes };
}

function buildDust(n) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const a = new THREE.Color(BLUE), b = new THREE.Color(GREEN);
  for (let i = 0; i < n; i++) {
    const p = new THREE.Vector3().randomDirection().multiplyScalar(4 + Math.random() * 9);
    pos.set([p.x, p.y, p.z], i * 3);
    const c = a.clone().lerp(b, Math.random());
    col.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
}

export function initScene(canvas, { reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 4, 5); scene.add(key);
  const rimB = new THREE.PointLight(BLUE, 60, 14); rimB.position.set(-4, -1, 3); scene.add(rimB);
  const rimG = new THREE.PointLight(GREEN, 60, 14); rimG.position.set(4, -2, 2); scene.add(rimG);

  const rig = new THREE.Group(); scene.add(rig);
  const mark = buildMark(); rig.add(mark);
  const net = buildNetwork(30, 2.5); rig.add(net.group);
  const dust = buildDust(900); scene.add(dust);

  let mobile = false;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    mobile = w < 800;
    camera.fov = mobile ? 52 : 38;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener("resize", resize);

  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener("pointermove", (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  let scrollP = 0, scrollS = 0;
  const onScroll = () => { scrollP = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const clock = new THREE.Clock();
  let running = true, raf = 0;

  function frame() {
    const t = clock.getElapsedTime();
    scrollS += (scrollP - scrollS) * 0.06;
    mouse.sx += (mouse.x - mouse.sx) * 0.05;
    mouse.sy += (mouse.y - mouse.sy) * 0.05;

    // Posición: a la derecha en el hero; al hacer scroll se aleja y se desplaza al margen.
    const heroFade = smooth(clamp(scrollY / (innerHeight * 0.9), 0, 1));
    const baseX = mobile ? 0 : 2.9, baseY = mobile ? 2.1 : 0.1;
    rig.position.x = baseX + heroFade * (mobile ? 0 : 1.2) * Math.sin(scrollS * 12);
    rig.position.y = baseY + Math.sin(t * 0.8) * 0.12 + heroFade * (mobile ? 2 : 0);
    rig.position.z = -heroFade * 3.2;
    const sc = (mobile ? 0.62 : 1) * (1 - heroFade * 0.25);
    rig.scale.setScalar(sc);

    mark.rotation.y = Math.sin(t * 0.35) * 0.5 + mouse.sx * 1.1 + scrollS * 14;
    mark.rotation.x = mouse.sy * 0.7 + Math.sin(t * 0.5) * 0.08;
    net.group.rotation.y = t * 0.06 + scrollS * 6;
    net.group.rotation.x = Math.sin(t * 0.1) * 0.2;
    for (const c of net.cubes) {
      const u = c.userData;
      c.rotation.x += u.spin.x * 0.01; c.rotation.y += u.spin.y * 0.01;
      c.position.y = u.base.y + Math.sin(t * 0.6 + u.phase) * 0.12;
    }
    dust.rotation.y = t * 0.012 + scrollS * 2;
    dust.rotation.x = scrollS * 0.6;
    camera.position.x = mouse.sx * 0.6; camera.position.y = -mouse.sy * 0.4;
    camera.lookAt(0, 0, 0);

    // El lienzo se atenúa tras el hero para no competir con el contenido.
    canvas.style.setProperty("--stage", String((mobile ? 0.42 : 1) * (1 - heroFade * (mobile ? 0.6 : 0.6))));
    renderer.render(scene, camera);
    if (running && !reduced) raf = requestAnimationFrame(frame);
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !reduced) { clock.getDelta(); raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
  });
  if (reduced) { frame(); addEventListener("resize", frame); addEventListener("scroll", frame, { passive: true }); }
  else frame();
  requestAnimationFrame(() => canvas.classList.add("is-ready"));
}
