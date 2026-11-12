/* ════════════════════════════════════════════════════════════════
   Pasteles de mamá — collage en 2D guiado por el scroll
   1. Utilidades y WhatsApp   3. Guion de las piezas (PISTAS)
   2. Papel rasgado           4. Bucle   5. Polaroids que se arrastran
   Sin dependencias: solo imágenes, CSS y este archivo.
   ════════════════════════════════════════════════════════════════ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const suave = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const calma = matchMedia('(prefers-reduced-motion: reduce)').matches;

function azar(semilla) {
  return () => {
    semilla |= 0; semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ───────── 1. WhatsApp ───────── */
{
  const numero = (document.body.dataset.whatsapp || '').replace(/\D/g, '');
  for (const a of $$('.js-wa')) {
    const postre = a.dataset.postre;
    const texto = postre ? `Hola, quiero pedir ${postre}.` : 'Hola, quiero hacer un pedido.';
    a.href = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  }
}

/* ───────── 2. Papel rasgado ─────────
   Cada [data-rasgar="N"] recibe dos capas de fondo con la orilla irregular:
   una blanca (la fibra del papel) y, un poco más adentro, la cara de color.
   N = cuántos px puede morder el rasgado. */
function rasgar(el, i) {
  const amp = Number(el.dataset.rasgar) || 6;
  const borde = document.createElement('span'), cara = document.createElement('span');
  borde.className = 'papel__borde'; cara.className = 'papel__cara';
  el.prepend(borde, cara);
  const dibujar = () => {
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    const r = azar(i * 97 + 5), paso = Math.max(7, amp * 1.7), afuera = [], adentro = [];
    const lado = (x0, y0, x1, y1, nx, ny) => {
      const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / paso));
      for (let k = 0; k < n; k++) {
        const t = (k + r() * 0.7) / n, d = r() * r() * amp, d2 = d + 1.5 + r() * Math.min(5, amp * 0.6);
        const x = lerp(x0, x1, t), y = lerp(y0, y1, t);
        afuera.push(`${(x + nx * d).toFixed(1)}px ${(y + ny * d).toFixed(1)}px`);
        adentro.push(`${(x + nx * d2).toFixed(1)}px ${(y + ny * d2).toFixed(1)}px`);
      }
    };
    lado(0, 0, w, 0, 0, 1); lado(w, 0, w, h, -1, 0); lado(w, h, 0, h, 0, -1); lado(0, h, 0, 0, 1, 0);
    borde.style.clipPath = `polygon(${afuera.join(',')})`;
    cara.style.clipPath = `polygon(${adentro.join(',')})`;
  };
  dibujar();
  let ancho = el.offsetWidth, alto = el.offsetHeight;
  new ResizeObserver(() => {
    if (Math.abs(el.offsetWidth - ancho) < 2 && Math.abs(el.offsetHeight - alto) < 2) return;
    ancho = el.offsetWidth; alto = el.offsetHeight; dibujar();
  }).observe(el);
}
$$('[data-rasgar]').forEach(rasgar);

/* ───────── 3. Guion ─────────
   Un cuadro por acto (portada, rebanada, fresa, postres, pedido).
   x, y: centro de la pieza, en fracción del ancho/alto de la ventana desde el centro.
   s: escala · r: giro en grados. `e` = escritorio, `m` = móvil. */
const PISTAS = {
  pastel: {
    ancho: (W, H, movil) => (movil ? Math.min(0.8 * W, 0.44 * H) : Math.min(0.36 * W, 0.66 * H)),
    e: [{ x: 0.25, y: 0.12, s: 1, r: -6 }, { x: 0.2, y: 0.0, s: 1.05, r: 4 }, { x: 0.36, y: 0.85, s: 1.05, r: 30 }, { x: 0.44, y: -0.5, s: 0.8, r: -30 }, { x: 0, y: 0.42, s: 0.85, r: 14 }],
    m: [{ x: 0, y: 0.03, s: 1, r: -6 }, { x: 0.05, y: -0.2, s: 1, r: 4 }, { x: 0.3, y: 0.85, s: 1, r: 30 }, { x: 0.42, y: -0.52, s: 0.75, r: -30 }, { x: 0, y: 0.36, s: 0.9, r: 14 }],
  },
  fresota: {
    ancho: (W, H, movil) => (movil ? Math.min(0.6 * W, 0.3 * H) : Math.min(0.3 * W, 0.48 * H)),
    e: [{ x: 0.42, y: 0.36, s: 0.6, r: -24 }, { x: 0.62, y: 0.6, s: 0.55, r: -40 }, { x: 0.2, y: 0.03, s: 1, r: 8 }, { x: -0.5, y: 0.34, s: 0.55, r: 30 }, { x: -0.36, y: 0.22, s: 0.62, r: -14 }],
    m: [{ x: 0.4, y: 0.2, s: 0.55, r: -24 }, { x: 0.8, y: 0.1, s: 0.5, r: -40 }, { x: 0, y: -0.19, s: 1, r: 8 }, { x: -0.7, y: 0.3, s: 0.5, r: 30 }, { x: -0.4, y: 0.1, s: 0.55, r: -14 }],
  },
};
const CORTE = [0, 1, 0.15, 0, 0];           // cuánto se separa la rebanada en cada acto
const DISPERSION = [1, 3, 3.4, 1.3, 1.1]; // qué tan lejos del pastel flotan las fresas
const FONDO = ['#b78c5c', '#eadfc6', '#9cc0d4', '#c7a172', '#3a1220'];
const PAUSA = [0.22, 0.3, 0.3, 0.72, 0];     // cuánto se sostiene cada cuadro antes de viajar
// Recortes flotantes, en el mismo orden que las .flot del HTML.
// x, y: posición respecto al pastel (en anchos de pastel) · t: tamaño · p: profundidad · giro: grados
const FLOTANTES = [
  { x: 0.58, y: -0.5, t: 0.72, p: 0.2, giro: 14 },   // helecho
  { x: 0.86, y: -0.05, t: 0.62, p: 0.15, giro: 9 },  // papel collage
  { x: -0.66, y: 0.56, t: 0.3, p: 0.3, giro: -10 },  // papel con flores
  { x: 0.86, y: 0.62, t: 0.4, p: 0.5, giro: 10 },   // girasoles
  { x: -0.4, y: 0.5, t: 0.14, p: 0.8, giro: -15 },   // sello rojo
  { x: 0.1, y: -0.68, t: 0.36, p: 0.6, giro: -6 },   // mariposas
  { x: -0.56, y: -0.34, t: 0.15, p: 0.9, giro: 12 }, // flor
  { x: 0.62, y: -0.1, t: 0.15, p: 0.7, giro: 20 },   // sello dorado
];

/* ───────── 4. Bucle ───────── */
const mesa = $('.mesa');
const actos = $$('[data-acto]');
const capas = actos.map((a) => (a.hasAttribute('data-libre') ? [] : $$('[data-capa]', a)));
const salientes = actos.map((a) => $$('[data-sale]', a));
const profundos = actos.map((a) => $$('[data-prof]', a));
const elPastel = $('[data-pieza="pastel"]'), elFresota = $('[data-pieza="fresota"]');
const elEntero = $('.pastel__entero'), elResto = $('.pastel__resto'), elRebanada = $('.pastel__rebanada');
const flots = $$('[data-flot]');
const rf = azar(12);
flots.forEach((el, i) => { el._d = { ...FLOTANTES[i % FLOTANTES.length], fase: rf() * 7 }; });

let W = 0, H = 0, movil = false, topes = [], anchoPastel = 0;
function medir() {
  W = innerWidth; H = innerHeight; movil = W / H < 0.9;
  topes = actos.map((a) => a.offsetTop);
  anchoPastel = PISTAS.pastel.ancho(W, H, movil);
  elPastel.style.width = `${anchoPastel}px`;
  elFresota.style.width = `${PISTAS.fresota.ancho(W, H, movil)}px`;
  flots.forEach((el) => { el.style.width = `${el._d.t * anchoPastel * (movil ? 1.15 : 1)}px`; });
}
addEventListener('resize', medir);
new ResizeObserver(medir).observe(document.body);
medir();

const puntero = { x: 0, y: 0, sx: 0, sy: 0 };
if (!calma) addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') { puntero.x = e.clientX / W - 0.5; puntero.y = e.clientY / H - 0.5; } });

function posicionGuion() {
  const y = scrollY, n = topes.length;
  let i = 0;
  while (i < n - 2 && y >= topes[i + 1]) i++;
  const frac = clamp((y - topes[i]) / Math.max(1, topes[i + 1] - topes[i]));
  return i + suave(PAUSA[i], 1, frac);
}
const hex = (c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16));
const colores = FONDO.map(hex);
const poner = (el, x, y, s, r) => { el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`; };

let g = posicionGuion(), antes = performance.now(), visible = true;
document.addEventListener('visibilitychange', () => { visible = !document.hidden; antes = performance.now(); if (visible) requestAnimationFrame(cuadro); });

function cuadro(ahora) {
  if (!visible) return;
  const real = Math.min(0.3, (ahora - antes) / 1000); antes = ahora;
  const t = calma ? 0 : ahora / 1000;

  g = lerp(g, posicionGuion(), calma ? 1 : 1 - Math.exp(-real * 5.5));
  const i = Math.min(FONDO.length - 2, Math.floor(g)), u = clamp(g - i);
  const lado = movil ? 'm' : 'e';
  puntero.sx = lerp(puntero.sx, puntero.x, 0.06); puntero.sy = lerp(puntero.sy, puntero.y, 0.06);
  const mx = puntero.sx * W * 0.05, my = puntero.sy * H * 0.05;

  // Pastel y fresa grande
  const pista = (nombre, c) => lerp(PISTAS[nombre][lado][i][c], PISTAS[nombre][lado][i + 1][c], u);
  const px = pista('pastel', 'x') * W, py = pista('pastel', 'y') * H, ps = pista('pastel', 's');
  poner(elPastel, px - mx * 0.5, py - my * 0.5 + Math.sin(t * 0.5) * 4, ps, pista('pastel', 'r') + Math.sin(t * 0.4) * 0.6);
  poner(elFresota, pista('fresota', 'x') * W - mx * 1.4, pista('fresota', 'y') * H - my * 1.4 + Math.sin(t * 0.8 + 2) * 7, pista('fresota', 's'), pista('fresota', 'r') + Math.sin(t * 0.6) * 3);

  // Rebanada: se desliza hacia afuera y gira un poco
  const s = lerp(CORTE[i], CORTE[i + 1], u), sE = s * s * (3 - 2 * s);
  const cortado = s > 0.004;
  elEntero.style.opacity = cortado ? 0 : 1;
  elResto.style.opacity = elRebanada.style.opacity = cortado ? 1 : 0;
  elRebanada.style.transform = `translate(${(-0.2 * sE * 100).toFixed(2)}%, ${(0.3 * sE * 100).toFixed(2)}%) rotate(${(-10 * sE).toFixed(2)}deg)`;

  // Recortes flotantes: siguen al pastel y se dispersan según el acto
  const disp = lerp(DISPERSION[i], DISPERSION[i + 1], u), a = anchoPastel * ps;
  for (const el of flots) {
    const d = el._d;
    const fx = px + d.x * a * disp * (movil ? 0.82 : 1) - mx * (0.6 + d.p * 2);
    const fy = py + (movil ? Math.max(d.y, -0.34) : d.y) * a * disp - my * (0.6 + d.p * 2) + Math.sin(t * 0.7 + d.fase) * (6 + d.p * 8);
    poner(el, fx, fy, 1, d.giro + Math.sin(t * 0.5 + d.fase) * 4 + g * 24 * (d.p - 0.5));
  }

  // Fondo
  const c = colores[i].map((v, k) => Math.round(lerp(v, colores[i + 1][k], u)));
  document.body.style.backgroundColor = `rgb(${c})`;

  actos.forEach((_, n) => {
    const lejos = g - n;
    // Texto de cada acto
    const op = clamp(1.7 - Math.abs(lejos) * 2.8);
    for (const el of capas[n]) { el.style.opacity = op.toFixed(3); el.style.visibility = op < 0.02 ? 'hidden' : 'visible'; }
    // Papeles de fondo con parallax
    for (const el of profundos[n]) {
      const p = Number(el.dataset.prof);
      el.style.transform = `translate(${(-mx * p * 3).toFixed(1)}px, ${(-my * p * 3 - lejos * p * H * 0.9).toFixed(1)}px)`;
      el.style.opacity = clamp(1.6 - Math.abs(lejos) * 1.8).toFixed(3);
    }
    // Notas que salen de atrás del pastel
    for (const el of salientes[n]) {
      const fuera = suave(0.55, 0.05, Math.abs(lejos));
      const dx = movil ? 0 : (1 - fuera) * 0.34 * W, dy = movil ? -(1 - fuera) * 0.42 * H : 0;
      el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${((1 - fuera) * 10).toFixed(2)}deg)`;
      el.style.opacity = clamp(fuera * 3).toFixed(3);
      el.style.visibility = fuera < 0.01 ? 'hidden' : 'visible';
    }
  });

  requestAnimationFrame(cuadro);
}
requestAnimationFrame((t0) => { antes = t0; cuadro(t0); mesa.classList.add('lista'); });

/* ───────── 5. Polaroids que se arrastran (ratón o lápiz) ───────── */
let capaAlta = 3;
for (const el of $$('[data-arrastra]')) {
  let x0 = 0, y0 = 0, dx = 0, dy = 0, activo = false;
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // en táctil se deja libre para hacer scroll
    activo = true; x0 = e.clientX - dx; y0 = e.clientY - dy;
    el.setPointerCapture(e.pointerId); el.classList.remove('suelta');
    el.closest('.postre').style.zIndex = ++capaAlta; el.style.zIndex = capaAlta;
  });
  el.addEventListener('pointermove', (e) => {
    if (!activo) return;
    dx = e.clientX - x0; dy = e.clientY - y0;
    el.style.setProperty('--dx', `${dx}px`); el.style.setProperty('--dy', `${dy}px`);
  });
  const soltar = () => { activo = false; };
  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', soltar);
  el.addEventListener('dblclick', () => { dx = dy = 0; el.classList.add('suelta'); el.style.setProperty('--dx', '0px'); el.style.setProperty('--dy', '0px'); });
}
