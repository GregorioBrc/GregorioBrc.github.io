const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h;
let bgDragonPoints = [];
let parasitePoints = [];
let parasiteSequence = [];
let parasiteIndex = 0;
let particles = [];
let mouse = { x: -1000, y: -1000, isStill: false, timer: null };

const BG_ITERATIONS = 15;
const MaxNum = 9999;
const PARASITE_ITERATIONS = 11;
const PARASITE_Time = 3500;
const GLOW_DIST = 100; // Aumentado un poco para mejor efecto

function getDragonSequence(iterations) {
  let steps = [1];
  for (let i = 0; i < iterations; i++) {
    const next = [...steps, 1, ...[...steps].reverse().map((x) => -x)];
    steps = next;
  }
  return steps;
}

function init() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  const seed = Math.floor(Math.random() * MaxNum);
  const seedElement = document.getElementById("seed-val");
  if (seedElement) seedElement.innerText = seed;

  const size = 3 + (seed / MaxNum) * 3;
  const sequence = getDragonSequence(BG_ITERATIONS);

  let cx = w * 0.5;
  let cy = h * 0.5;
  let dir = (seed / MaxNum) * Math.PI * 2;

  bgDragonPoints = [{ x: cx, y: cy }];
  sequence.forEach((s) => {
    dir += (s * Math.PI) / 2;
    cx += Math.cos(dir) * size;
    cy += Math.sin(dir) * size;
    bgDragonPoints.push({ x: cx, y: cy });
  });

  parasiteSequence = getDragonSequence(PARASITE_ITERATIONS);
  parasitePoints = [];
  parasiteIndex = 0;
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (mouse.isStill) {
    shatter();
    const statusElem = document.getElementById("status");
    if (statusElem) statusElem.innerText = "scanning";
  }

  mouse.isStill = false;
  clearTimeout(mouse.timer);
  mouse.timer = setTimeout(() => {
    mouse.isStill = true;
    startParasite();
    const statusElem = document.getElementById("status");
    if (statusElem) statusElem.innerText = "infecting...";
  }, PARASITE_Time);
});

function startParasite() {
  parasiteIndex = 0;
  parasitePoints = [
    { x: mouse.x, y: mouse.y, dir: Math.random() * Math.PI * 2 },
  ];
}

function shatter() {
  if (parasitePoints.length > 0) {
    parasitePoints.forEach((p) => {
      if (Math.random() > 0.5) {
        particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1.0,
        });
      }
    });
  }
  parasitePoints = [];
  parasiteIndex = 0;
}

function update() {
  if (
    mouse.isStill &&
    parasitePoints.length > 0 &&
    parasiteIndex < parasiteSequence.length
  ) {
    for (let i = 0; i < 8; i++) {
      if (parasiteIndex >= parasiteSequence.length) break;
      let last = parasitePoints[parasitePoints.length - 1];
      if (!last) break; // Seguridad extra

      let newDir = last.dir + (parasiteSequence[parasiteIndex] * Math.PI) / 2;
      let newX = last.x + Math.cos(newDir) * 5;
      let newY = last.y + Math.sin(newDir) * 5;
      parasitePoints.push({ x: newX, y: newY, dir: newDir });
      parasiteIndex++;
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life -= 0.03;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function draw() {
  // Fondo oscuro con trail
  ctx.fillStyle = "rgba(2, 4, 6, 0.25)";
  ctx.fillRect(0, 0, w, h);

  // --- PASO 1: Dibujar todo el dragón tenue de una sola vez ---
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0, 128, 255, 0.08)";
  //ctx.strokeStyle = "rgba(0, 50, 100, 0.08)";
  ctx.lineWidth = 1;
  ctx.moveTo(bgDragonPoints[0].x, bgDragonPoints[0].y);
  for (let i = 1; i < bgDragonPoints.length; i++) {
    ctx.lineTo(bgDragonPoints[i].x, bgDragonPoints[i].y);
  }
  ctx.stroke();

  // --- PASO 2: Dibujar solo los segmentos brillantes cerca del mouse ---
  ctx.lineWidth = 2;
  for (let i = 0; i < bgDragonPoints.length - 1; i++) {
    const p1 = bgDragonPoints[i];
    const d = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);

    if (d < GLOW_DIST) {
      const p2 = bgDragonPoints[i + 1];
      const intensity = 1 - d / GLOW_DIST;
      ctx.strokeStyle = `rgba(0, 210, 255, ${intensity})`;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  // --- PASO 3: Parásito Verde ---
  if (parasitePoints.length > 1) {
    ctx.strokeStyle = "#44ff9847";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(parasitePoints[0].x, parasitePoints[0].y);
    for (let i = 1; i < parasitePoints.length; i++) {
      ctx.lineTo(parasitePoints[i].x, parasitePoints[i].y);
    }
    ctx.stroke();
  }

  // --- PASO 4: Partículas ---
  ctx.fillStyle = "#44ff99";
  particles.forEach((p) => {
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x, p.y, 2, 2);
  });
  ctx.globalAlpha = 1;

  update();
  requestAnimationFrame(draw);
}

init();
draw();
window.addEventListener("resize", init);
