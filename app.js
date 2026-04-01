const STORAGE_KEY = "game_hub_v1";
const state = {
  view: "home",
  page: 1,
  pageSize: 12,
  query: "",
  category: "all",
  sort: "az",
  favorites: [],
  installed: [],
  pinned: [],
  theme: "dark",
  tileSize: 220,
  compact: false,
  safeMode: false,
  netflixMode: false,
  bg: "",
  hubTitle: "Game Hub OS",
  avatar: "",
  stats: { plays: {}, minutes: {} },
  adminUnlocked: false,
  snakeStartLength: 1,
  snakeTickMs: 120
};
let activeCleanup = null;
let activeGameKeydownHandler = null;
let activeGameKeyupHandler = null;
const validCategories = ["Action", "Puzzle", "Racing", "Horror", "Multiplayer"];
const coverMap = {
  snake: ["#0f172a", "#14532d"],
  tictactoe: ["#1e293b", "#7c3aed"],
  memory: ["#1f2937", "#0369a1"],
  runner: ["#111827", "#9a3412"],
  rps: ["#172554", "#4c1d95"],
  breakout: ["#0b3b2e", "#1d4ed8"],
  dodge: ["#3f0f0f", "#6d28d9"],
  math: ["#1f2937", "#b45309"],
  mines: ["#0f172a", "#475569"],
  sniper3d: ["#1a202c", "#7f1d1d"],
  busdrive: ["#0c4a6e", "#0369a1"],
  cardrive: ["#111827", "#059669"]
};

function makeCover(title, engine) {
  const [a, b] = coverMap[engine] || ["#0f172a", "#334155"];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='640' height='360' fill='url(#g)'/><text x='40' y='190' fill='white' font-size='44' font-family='Segoe UI, Arial'>${title}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const rawGames = [
  { id: "g1", title: "Neon Snake", category: "Action", engine: "snake", tags: ["Arcade", "2D", "Offline"] },
  { id: "g2", title: "Dash Runner", category: "Racing", engine: "runner", tags: ["Endless", "Reflex", "Offline"] },
  { id: "g3", title: "Grid Tactics", category: "Puzzle", engine: "tictactoe", tags: ["Board", "Logic", "Offline"] },
  { id: "g4", title: "Memory Vault", category: "Puzzle", engine: "memory", tags: ["Cards", "Focus", "Offline"] },
  { id: "g5", title: "RPS Arena", category: "Multiplayer", engine: "rps", tags: ["Versus", "Quick", "Local"] },
  { id: "g6", title: "Brick Breaker", category: "Action", engine: "breakout", tags: ["Arcade", "Paddle", "Offline"] },
  { id: "g7", title: "Shadow Dodge", category: "Horror", engine: "dodge", tags: ["Survival", "Reflex", "Offline"] },
  { id: "g8", title: "Quick Math", category: "Puzzle", engine: "math", tags: ["Brain", "Speed", "Offline"] },
  { id: "g9", title: "Minefield", category: "Puzzle", engine: "mines", tags: ["Minesweeper", "Logic", "Offline"] },
  { id: "g10", title: "Zombie Tower Sniper 3D", category: "Horror", engine: "sniper3d", tags: ["Sniper", "3D", "Wave"] },
  { id: "g11", title: "Double Decker Bus Sim", category: "Racing", engine: "busdrive", tags: ["Bus", "Passengers", "Timetable"] },
  { id: "g12", title: "Open Road Car Sim", category: "Racing", engine: "cardrive", tags: ["Cars", "Selection", "Driving"] }
];

const games = rawGames.map((g, i) => ({
  ...g,
  thumbnail: makeCover(g.title, g.engine),
  createdAt: Date.now() - i * 86400000
})).filter((game, index, arr) =>
  arr.findIndex((g) => g.id === game.id || g.title === game.title) === index
);
const gameIds = new Set(games.map((g) => g.id));

const q = (s) => document.querySelector(s);
const save = () => {
  const persistState = { ...state, adminUnlocked: false };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistState));
};
const load = () => Object.assign(state, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));

function lockBackgroundUi(lock) {
  const app = q("#app");
  if (!app) return;
  app.inert = lock;
  document.body.classList.toggle("playing-game", lock);
}

function uniq(items) {
  return [...new Set(items)];
}

function sanitizeState() {
  state.category = validCategories.includes(state.category) ? state.category : "all";
  state.favorites = uniq(state.favorites).filter((id) => gameIds.has(id));
  state.installed = uniq(state.installed).filter((id) => gameIds.has(id));
  state.pinned = uniq(state.pinned).filter((id) => gameIds.has(id));
  state.adminUnlocked = false;
  state.snakeStartLength = Math.max(1, Math.min(1, Number(state.snakeStartLength) || 1));
  state.snakeTickMs = Math.max(40, Math.min(400, Number(state.snakeTickMs) || 120));
}

function loadAdminValuesIntoInputs() {
  if (q("#snakeStartLength")) q("#snakeStartLength").value = String(state.snakeStartLength);
  if (q("#snakeTickMs")) q("#snakeTickMs").value = String(state.snakeTickMs);
  if (!q("#adminGameSelect")) return;
  const selected = q("#adminGameSelect").value;
  if (q("#adminPlays")) q("#adminPlays").value = String(state.stats.plays[selected] || 0);
  if (q("#adminMinutes")) q("#adminMinutes").value = String(state.stats.minutes[selected] || 0);
}

function filteredGames() {
  let list = [...games];
  const query = state.query.toLowerCase();
  if (query) {
    list = list.filter(g =>
      g.title.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query) ||
      g.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  if (state.category !== "all") list = list.filter(g => g.category === state.category);
  if (state.view === "favorites") list = list.filter(g => state.favorites.includes(g.id));
  if (state.view === "installed") list = list.filter(g => state.installed.includes(g.id));
  if (state.view === "trending") list.sort((a, b) => (state.stats.plays[b.id] || 0) - (state.stats.plays[a.id] || 0));
  if (state.sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
  if (state.sort === "played") list.sort((a, b) => (state.stats.plays[b.id] || 0) - (state.stats.plays[a.id] || 0));
  if (state.sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
}

function renderFeatured() {
  const wrap = q("#featuredRow");
  const f = [...games].sort((a, b) => (state.stats.plays[b.id] || 0) - (state.stats.plays[a.id] || 0)).slice(0, 4);
  wrap.innerHTML = f.map(g => `<article class="featured-card"><strong>${g.title}</strong><p>${g.category}</p></article>`).join("");
}

function renderGrid() {
  const grid = q("#gameGrid");
  const list = filteredGames();
  if (!list.length) {
    grid.innerHTML = "<p>No results. Try a shorter query or different category.</p>";
    q("#pageLabel").textContent = "Page 1";
    return;
  }
  const pages = Math.max(1, Math.ceil(list.length / state.pageSize));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * state.pageSize;
  const chunk = list.slice(start, start + state.pageSize);
  q("#pageLabel").textContent = `Page ${state.page} / ${pages}`;

  grid.style.setProperty("--tile-size", `${state.tileSize}px`);
  grid.innerHTML = chunk.map(g => `
    <article class="game-card" data-id="${g.id}">
      <img class="thumb" src="${g.thumbnail}" alt="${g.title}" loading="lazy" />
      <h3>${g.title}</h3>
      <div class="tags">${g.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="card-actions">
        <button data-play="${g.id}">▶ Play</button>
        <button data-fav="${g.id}">${state.favorites.includes(g.id) ? "★" : "☆"} Favorite</button>
      </div>
    </article>
  `).join("");
}

function renderStats() {
  if (state.view !== "stats") return;
  const grid = q("#gameGrid");
  const rows = Object.keys(state.stats.plays).sort((a, b) => (state.stats.plays[b] || 0) - (state.stats.plays[a] || 0));
  grid.innerHTML = rows.length ? rows.map(id => {
    const g = games.find(x => x.id === id);
    return `<article class="game-card"><h3>${g ? g.title : id}</h3><p>Plays: ${state.stats.plays[id] || 0}</p><p>Time: ${state.stats.minutes[id] || 0} min</p></article>`;
  }).join("") : "<p>Play a game to generate stats.</p>";
}

function applyUi() {
  document.body.classList.toggle("compact", state.compact);
  document.body.classList.toggle("collapsed", q("#sidebar").classList.contains("is-collapsed"));
  document.body.classList.remove("theme-light", "theme-neon", "theme-retro");
  if (state.theme !== "dark") document.body.classList.add(`theme-${state.theme}`);
  if (state.bg) document.documentElement.style.setProperty("--bg", state.bg);
  else document.documentElement.style.removeProperty("--bg");
  q("#hubTitle").value = state.hubTitle;
  q("#gridSize").value = String(state.tileSize);
  q("#compactMode").checked = state.compact;
  q("#safeMode").checked = state.safeMode;
  q("#netflixMode").checked = state.netflixMode;
  if (q("#themeSelect")) q("#themeSelect").value = state.theme;
  if (q("#bgInput")) q("#bgInput").value = state.bg;
  if (q("#avatarInput")) q("#avatarInput").value = state.avatar;
  if (q("#snakeStartLength")) q("#snakeStartLength").value = String(state.snakeStartLength);
  if (q("#snakeTickMs")) q("#snakeTickMs").value = String(state.snakeTickMs);
  if (q("#adminPanel")) q("#adminPanel").hidden = !state.adminUnlocked;
  if (q("#adminStatus")) q("#adminStatus").textContent = state.adminUnlocked ? "Unlocked" : "Locked";
  if (q("#adminPasscode")) q("#adminPasscode").value = "";
  if (q("#adminGameSelect")) {
    q("#adminGameSelect").innerHTML = games.map((g) => `<option value="${g.id}">${g.title}</option>`).join("");
    loadAdminValuesIntoInputs();
  }
}

function openGame(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;
  const modal = q("#gameModal");
  modal.classList.remove("is-fullscreen");
  q("#modalTitle").textContent = game.title;
  mountGame(game);
  if (!state.installed.includes(id)) state.installed.push(id);
  state.stats.plays[id] = (state.stats.plays[id] || 0) + 1;
  save();
  const start = Date.now();
  lockBackgroundUi(true);
  modal.showModal();
  modal.dataset.gameId = id;
  modal.dataset.start = String(start);
}

function closeGame() {
  const modal = q("#gameModal");
  const id = modal.dataset.gameId;
  const start = Number(modal.dataset.start || Date.now());
  const mins = Math.round((Date.now() - start) / 60000);
  if (id && mins > 0) state.stats.minutes[id] = (state.stats.minutes[id] || 0) + mins;
  if (activeCleanup) activeCleanup();
  activeCleanup = null;
  activeGameKeydownHandler = null;
  activeGameKeyupHandler = null;
  q("#gameHost").innerHTML = "";
  modal.close();
  lockBackgroundUi(false);
  save();
  renderAll();
}

function mountGame(game) {
  if (activeCleanup) activeCleanup();
  activeGameKeydownHandler = null;
  activeGameKeyupHandler = null;
  const host = q("#gameHost");
  host.innerHTML = "";
  if (game.engine === "snake") activeCleanup = gameSnake(host);
  else if (game.engine === "tictactoe") activeCleanup = gameTic(host);
  else if (game.engine === "memory") activeCleanup = gameMemory(host);
  else if (game.engine === "runner") activeCleanup = gameRunner(host);
  else if (game.engine === "breakout") activeCleanup = gameBreakout(host);
  else if (game.engine === "dodge") activeCleanup = gameDodge(host);
  else if (game.engine === "math") activeCleanup = gameMath(host);
  else if (game.engine === "mines") activeCleanup = gameMines(host);
  else if (game.engine === "sniper3d") activeCleanup = gameSniper3D(host);
  else if (game.engine === "busdrive") activeCleanup = gameBusDrive(host);
  else if (game.engine === "cardrive") activeCleanup = gameCarDrive(host);
  else activeCleanup = gameRps(host);
}

function gameSniper3D(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Zombie Tower Sniper 3D</h3><canvas id="zs" width="840" height="420" style="max-width:100%;background:#0b1220;border-radius:8px"></canvas><p id="zsOut">Hold the line. Click to snipe zombies before they reach the tower.</p></div>`;
  const c = root.querySelector("#zs");
  const ctx = c.getContext("2d");
  const out = root.querySelector("#zsOut");
  let score = 0;
  let health = 100;
  let wave = 1;
  const cross = { x: 420, y: 210 };
  const zombies = [];
  const spawn = () => {
    zombies.push({
      x: Math.random() * 760 + 40,
      depth: 0,
      speed: 0.004 + Math.random() * 0.006 + wave * 0.001
    });
  };
  for (let i = 0; i < 6; i++) spawn();
  const onMove = (e) => {
    const r = c.getBoundingClientRect();
    cross.x = ((e.clientX - r.left) / r.width) * c.width;
    cross.y = ((e.clientY - r.top) / r.height) * c.height;
  };
  const onShoot = () => {
    let hit = false;
    for (let i = zombies.length - 1; i >= 0; i--) {
      const z = zombies[i];
      const zy = 360 - z.depth * 270;
      const size = 12 + z.depth * 44;
      if (Math.abs(cross.x - z.x) < size && Math.abs(cross.y - zy) < size) {
        zombies.splice(i, 1);
        score += 10;
        hit = true;
        break;
      }
    }
    if (!hit) score = Math.max(0, score - 2);
  };
  c.addEventListener("mousemove", onMove);
  c.addEventListener("click", onShoot);
  const t = setInterval(() => {
    if (health <= 0) return;
    if (Math.random() < 0.08 + wave * 0.01) spawn();
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#1f2937";
    ctx.beginPath();
    ctx.moveTo(420, 420);
    ctx.lineTo(0, 260);
    ctx.lineTo(840, 260);
    ctx.closePath();
    ctx.fill();
    zombies.forEach((z) => {
      z.depth += z.speed;
      const zy = 360 - z.depth * 270;
      const size = 12 + z.depth * 44;
      ctx.fillStyle = "#84cc16";
      ctx.fillRect(z.x - size / 2, zy - size, size, size * 1.2);
    });
    for (let i = zombies.length - 1; i >= 0; i--) {
      if (zombies[i].depth >= 1) {
        zombies.splice(i, 1);
        health -= 10;
      }
    }
    if (score >= wave * 120) wave += 1;
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(cross.x, cross.y, 14, 0, Math.PI * 2);
    ctx.moveTo(cross.x - 20, cross.y);
    ctx.lineTo(cross.x + 20, cross.y);
    ctx.moveTo(cross.x, cross.y - 20);
    ctx.lineTo(cross.x, cross.y + 20);
    ctx.stroke();
    out.textContent = health > 0 ? `Wave ${wave} | Score ${score} | Tower HP ${health}` : `Game over. Final score ${score}`;
  }, 33);
  return () => {
    clearInterval(t);
    c.removeEventListener("mousemove", onMove);
    c.removeEventListener("click", onShoot);
  };
}

function gameBusDrive(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Double Decker Bus Sim</h3><canvas id="bs" width="860" height="420" style="max-width:100%;background:#102a43;border-radius:8px"></canvas><p id="bsOut">Route A: Stop at all bus stops, pick passengers, keep schedule.</p></div>`;
  const c = root.querySelector("#bs");
  const ctx = c.getContext("2d");
  const out = root.querySelector("#bsOut");
  const keys = { up: false, down: false, left: false, right: false };
  let bus = { x: 120, y: 320, a: 0, speed: 0 };
  let passengers = 0;
  let totalDelivered = 0;
  let stopIndex = 0;
  let schedule = 80;
  const stops = [{ x: 180, y: 330 }, { x: 390, y: 310 }, { x: 620, y: 285 }, { x: 760, y: 250 }];
  activeGameKeydownHandler = (e) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  };
  activeGameKeyupHandler = (e) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
  };
  const t = setInterval(() => {
    if (keys.up) bus.speed += 0.08;
    if (keys.down) bus.speed -= 0.12;
    bus.speed *= 0.96;
    bus.speed = Math.max(-1.6, Math.min(3.6, bus.speed));
    if (keys.left) bus.a -= 0.05;
    if (keys.right) bus.a += 0.05;
    bus.x += Math.cos(bus.a) * bus.speed;
    bus.y += Math.sin(bus.a) * bus.speed;
    bus.x = Math.max(30, Math.min(830, bus.x));
    bus.y = Math.max(40, Math.min(390, bus.y));
    schedule -= 0.05;
    const stop = stops[stopIndex];
    const dist = Math.hypot(bus.x - stop.x, bus.y - stop.y);
    if (dist < 24 && Math.abs(bus.speed) < 0.5) {
      const picked = 2 + Math.floor(Math.random() * 5);
      passengers += picked;
      totalDelivered += passengers;
      passengers = 0;
      stopIndex = (stopIndex + 1) % stops.length;
      schedule += 18;
    }
    if (schedule <= 0) schedule = 0;
    ctx.fillStyle = "#102a43";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 52;
    ctx.beginPath();
    ctx.moveTo(40, 350);
    ctx.bezierCurveTo(260, 340, 420, 320, 820, 230);
    ctx.stroke();
    stops.forEach((s, i) => {
      ctx.fillStyle = i === stopIndex ? "#f59e0b" : "#22c55e";
      ctx.fillRect(s.x - 8, s.y - 18, 16, 36);
    });
    ctx.save();
    ctx.translate(bus.x, bus.y);
    ctx.rotate(bus.a);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-24, -12, 48, 24);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-16, -8, 14, 6);
    ctx.fillRect(2, -8, 14, 6);
    ctx.restore();
    out.textContent = `Next stop ${stopIndex + 1}/${stops.length} | Onboard ${passengers} | Delivered ${totalDelivered} | Timetable ${schedule.toFixed(1)} min`;
  }, 30);
  return () => clearInterval(t);
}

function gameCarDrive(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Open Road Car Sim</h3><div id="carPick" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"></div><canvas id="cs" width="860" height="420" style="max-width:100%;background:#0f172a;border-radius:8px"></canvas><p id="csOut">Choose a car then drive with WASD/Arrows.</p></div>`;
  const c = root.querySelector("#cs");
  const ctx = c.getContext("2d");
  const out = root.querySelector("#csOut");
  const pick = root.querySelector("#carPick");
  const cars = [
    { name: "City Compact", max: 3.1, accel: 0.07, turn: 0.05, color: "#60a5fa" },
    { name: "Sport GT", max: 5.2, accel: 0.11, turn: 0.06, color: "#f43f5e" },
    { name: "Muscle V8", max: 4.6, accel: 0.1, turn: 0.04, color: "#f59e0b" },
    { name: "Rally X", max: 4.3, accel: 0.09, turn: 0.07, color: "#22c55e" },
    { name: "Electric S", max: 4.8, accel: 0.12, turn: 0.055, color: "#a78bfa" }
  ];
  let selected = cars[0];
  cars.forEach((car) => {
    const b = document.createElement("button");
    b.textContent = car.name;
    b.onclick = () => { selected = car; };
    pick.appendChild(b);
  });
  const keys = { up: false, down: false, left: false, right: false };
  let player = { x: 430, y: 210, a: 0, speed: 0 };
  activeGameKeydownHandler = (e) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  };
  activeGameKeyupHandler = (e) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
  };
  const t = setInterval(() => {
    if (keys.up) player.speed += selected.accel;
    if (keys.down) player.speed -= selected.accel * 1.2;
    player.speed *= 0.97;
    player.speed = Math.max(-selected.max / 2, Math.min(selected.max, player.speed));
    if (keys.left) player.a -= selected.turn;
    if (keys.right) player.a += selected.turn;
    player.x += Math.cos(player.a) * player.speed;
    player.y += Math.sin(player.a) * player.speed;
    if (player.x < 20) player.x = 840;
    if (player.x > 840) player.x = 20;
    if (player.y < 20) player.y = 400;
    if (player.y > 400) player.y = 20;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 46;
    ctx.strokeRect(80, 60, 700, 300);
    ctx.setLineDash([18, 12]);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(120, 100, 620, 220);
    ctx.setLineDash([]);
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.a);
    ctx.fillStyle = selected.color;
    ctx.fillRect(-18, -10, 36, 20);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(-10, -8, 20, 6);
    ctx.restore();
    out.textContent = `${selected.name} | Speed ${Math.abs(player.speed).toFixed(2)} | Handling ${selected.turn.toFixed(3)}`;
  }, 30);
  return () => clearInterval(t);
}

function gameMines(root) {
  const size = 10;
  const bombs = 16;
  const board = Array.from({ length: size * size }, () => ({ bomb: false, open: false, around: 0 }));
  let opened = 0;
  while (board.filter((c) => c.bomb).length < bombs) {
    board[Math.floor(Math.random() * board.length)].bomb = true;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      if (board[i].bomb) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
          if (board[ny * size + nx].bomb) count++;
        }
      }
      board[i].around = count;
    }
  }
  root.innerHTML = `<div style="padding:12px"><h3>Minefield</h3><p id="mineOut">Open all safe tiles.</p><div id="mineGrid" style="display:grid;grid-template-columns:repeat(${size},minmax(26px,1fr));gap:4px"></div></div>`;
  const grid = root.querySelector("#mineGrid");
  const out = root.querySelector("#mineOut");
  const flood = (idx) => {
    if (idx < 0 || idx >= board.length || board[idx].open) return;
    board[idx].open = true;
    opened++;
    if (board[idx].around !== 0 || board[idx].bomb) return;
    const x = idx % size;
    const y = Math.floor(idx / size);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        flood(ny * size + nx);
      }
    }
  };
  const render = () => {
    grid.innerHTML = "";
    board.forEach((cell, i) => {
      const b = document.createElement("button");
      b.style.minHeight = "30px";
      b.textContent = cell.open ? (cell.bomb ? "💣" : (cell.around || "")) : "";
      b.onclick = () => {
        if (cell.open) return;
        if (cell.bomb) {
          board.forEach((c) => { if (c.bomb) c.open = true; });
          out.textContent = "Boom. Try again.";
          render();
          return;
        }
        flood(i);
        if (opened >= size * size - bombs) out.textContent = "Cleared. You win.";
        render();
      };
      grid.appendChild(b);
    });
  };
  render();
  return () => {};
}

function gameTic(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Tic Tac Toe</h3><div id="ttt" style="display:grid;grid-template-columns:repeat(3,90px);gap:8px"></div><p id="tttOut">You are X</p></div>`;
  const board = Array(9).fill("");
  const grid = root.querySelector("#ttt");
  const out = root.querySelector("#tttOut");
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const won = (p) => wins.some(line => line.every(i => board[i] === p));
  const render = () => {
    grid.innerHTML = "";
    board.forEach((v, i) => {
      const b = document.createElement("button");
      b.textContent = v;
      b.style.height = "90px";
      b.onclick = () => {
        if (board[i] || won("X") || won("O")) return;
        board[i] = "X";
        if (!won("X")) {
          const free = board.map((x, idx) => x ? null : idx).filter(x => x !== null);
          if (free.length) board[free[Math.floor(Math.random() * free.length)]] = "O";
        }
        if (won("X")) out.textContent = "You win!";
        else if (won("O")) out.textContent = "Computer wins.";
        else if (board.every(Boolean)) out.textContent = "Draw.";
        render();
      };
      grid.appendChild(b);
    });
  };
  render();
  return () => {};
}

function gameRps(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Rock Paper Scissors</h3><div id="rps"></div><p id="rpsOut">Pick a move.</p></div>`;
  const out = root.querySelector("#rpsOut");
  const wrap = root.querySelector("#rps");
  ["Rock", "Paper", "Scissors"].forEach(move => {
    const b = document.createElement("button");
    b.textContent = move;
    b.style.marginRight = "8px";
    b.onclick = () => {
      const ai = ["Rock", "Paper", "Scissors"][Math.floor(Math.random() * 3)];
      let res = "Draw";
      if ((move === "Rock" && ai === "Scissors") || (move === "Paper" && ai === "Rock") || (move === "Scissors" && ai === "Paper")) res = "You win";
      else if (move !== ai) res = "Computer wins";
      out.textContent = `You: ${move} | CPU: ${ai} => ${res}`;
    };
    wrap.appendChild(b);
  });
  return () => {};
}

function gameMemory(root) {
  const base = ["A","B","C","D","E","F"];
  const deck = [...base, ...base].sort(() => Math.random() - 0.5);
  const open = Array(deck.length).fill(false);
  let first = null;
  let lock = false;
  root.innerHTML = `<div style="padding:12px"><h3>Memory Match</h3><div id="mem" style="display:grid;grid-template-columns:repeat(4,80px);gap:8px"></div></div>`;
  const grid = root.querySelector("#mem");
  const paint = () => {
    grid.innerHTML = "";
    deck.forEach((v, i) => {
      const b = document.createElement("button");
      b.style.height = "80px";
      b.textContent = open[i] ? v : "?";
      b.onclick = () => {
        if (lock || open[i]) return;
        open[i] = true;
        paint();
        if (first === null) first = i;
        else if (deck[first] !== deck[i]) {
          lock = true;
          setTimeout(() => {
            open[first] = false;
            open[i] = false;
            first = null;
            lock = false;
            paint();
          }, 500);
        } else first = null;
      };
      grid.appendChild(b);
    });
  };
  paint();
  return () => {};
}

function gameSnake(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Snake</h3><canvas id="sn" width="420" height="420" style="max-width:100%;background:#0a0a0a;border-radius:8px"></canvas></div>`;
  const c = root.querySelector("#sn");
  const ctx = c.getContext("2d");
  const startLen = Math.max(1, Math.min(1, Number(state.snakeStartLength) || 1));
  let snake = Array.from({ length: startLen }, (_, i) => ({ x: 8 - i, y: 8 }));
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let food = { x: 15, y: 10 };
  const board = 21;
  const tile = 20;
  const isOpposite = (a, b) => a.x === -b.x && a.y === -b.y;
  const spawnFood = () => {
    let f = { x: 0, y: 0 };
    do {
      f = { x: Math.floor(Math.random() * board), y: Math.floor(Math.random() * board) };
    } while (snake.some((s) => s.x === f.x && s.y === f.y));
    return f;
  };
  activeGameKeydownHandler = (e) => {
    let proposed = null;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") proposed = { x: 0, y: -1 };
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") proposed = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") proposed = { x: -1, y: 0 };
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") proposed = { x: 1, y: 0 };
    if (!proposed) return;
    if (!isOpposite(proposed, dir)) nextDir = proposed;
  };
  const t = setInterval(() => {
    dir = nextDir;
    const n = {
      x: (snake[0].x + dir.x + board) % board,
      y: (snake[0].y + dir.y + board) % board
    };
    if (snake.some(s => s.x === n.x && s.y === n.y)) {
      snake = [{ x: 8, y: 8 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      food = spawnFood();
      return;
    }
    snake.unshift(n);
    if (n.x === food.x && n.y === food.y) food = spawnFood();
    else snake.pop();
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 420, 420);
    ctx.fillStyle = "#39ff88";
    snake.forEach(s => ctx.fillRect(s.x * tile, s.y * tile, tile - 2, tile - 2));
    ctx.fillStyle = "#ff4d4d";
    ctx.fillRect(food.x * tile, food.y * tile, tile - 2, tile - 2);
  }, state.snakeTickMs);
  return () => {
    clearInterval(t);
  };
}

function gameRunner(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Dash Runner</h3><canvas id="rn" width="520" height="240" style="max-width:100%;background:#111827;border-radius:8px"></canvas><p>Press Space to jump.</p></div>`;
  const c = root.querySelector("#rn");
  const ctx = c.getContext("2d");
  let y = 180;
  let vy = 0;
  const g = 0.9;
  let obsX = 520;
  let score = 0;
  activeGameKeydownHandler = (e) => {
    if ((e.code === "Space" || e.key === "ArrowUp") && y >= 180) vy = -14;
  };
  const t = setInterval(() => {
    vy += g;
    y = Math.min(180, y + vy);
    obsX -= 7;
    if (obsX < -25) { obsX = 560; score += 1; }
    const hit = obsX < 65 && obsX > 20 && y > 145;
    if (hit) { obsX = 560; score = 0; }
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 520, 240);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(30, y, 30, 35);
    ctx.fillRect(obsX, 160, 20, 55);
    ctx.fillText(`Score ${score}`, 10, 20);
  }, 30);
  return () => {
    clearInterval(t);
  };
}

function gameBreakout(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Brick Breaker</h3><canvas id="bo" width="520" height="300" style="max-width:100%;background:#0f172a;border-radius:8px"></canvas></div>`;
  const c = root.querySelector("#bo");
  const ctx = c.getContext("2d");
  let paddleX = 220;
  let paddleVX = 0;
  let ballX = 260;
  let ballY = 200;
  let vx = 3;
  let vy = -3;
  const bricks = [];
  for (let r = 0; r < 4; r++) for (let col = 0; col < 9; col++) bricks.push({ x: 20 + col * 54, y: 20 + r * 24, hit: false });
  const keys = { left: false, right: false };
  activeGameKeydownHandler = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  };
  activeGameKeyupHandler = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
  };
  const t = setInterval(() => {
    paddleVX = 0;
    if (keys.left) paddleVX -= 8;
    if (keys.right) paddleVX += 8;
    paddleX += paddleVX;
    paddleX = Math.max(0, Math.min(440, paddleX));
    ballX += vx;
    ballY += vy;
    if (ballX < 8 || ballX > 512) vx *= -1;
    if (ballY < 8) vy *= -1;
    if (ballY > 300) {
      ballX = 260; ballY = 200; vx = 3; vy = -3;
      bricks.forEach((b) => { b.hit = false; });
    }
    if (ballY > 274 && ballX > paddleX && ballX < paddleX + 80) vy = -Math.abs(vy);
    bricks.forEach((b) => {
      if (!b.hit && ballX > b.x && ballX < b.x + 46 && ballY > b.y && ballY < b.y + 16) {
        b.hit = true;
        vy *= -1;
      }
    });
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 520, 300);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(paddleX, 282, 80, 10);
    ctx.beginPath();
    ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#22d3ee";
    bricks.forEach((b) => { if (!b.hit) ctx.fillRect(b.x, b.y, 46, 16); });
  }, 16);
  return () => clearInterval(t);
}

function gameDodge(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Shadow Dodge</h3><canvas id="dg" width="520" height="300" style="max-width:100%;background:#111827;border-radius:8px"></canvas><p>Move with Arrow keys.</p></div>`;
  const c = root.querySelector("#dg");
  const ctx = c.getContext("2d");
  let px = 260, py = 150;
  let pvx = 0, pvy = 0;
  let score = 0;
  const hazards = Array.from({ length: 6 }).map(() => ({ x: Math.random() * 520, y: Math.random() * 300, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 }));
  const keys = { left: false, right: false, up: false, down: false };
  activeGameKeydownHandler = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = true;
  };
  activeGameKeyupHandler = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
  };
  const t = setInterval(() => {
    pvx = 0;
    pvy = 0;
    if (keys.left) pvx -= 5;
    if (keys.right) pvx += 5;
    if (keys.up) pvy -= 5;
    if (keys.down) pvy += 5;
    px += pvx;
    py += pvy;
    px = Math.max(8, Math.min(512, px));
    py = Math.max(8, Math.min(292, py));
    hazards.forEach((h) => {
      h.x += h.vx; h.y += h.vy;
      if (h.x < 0 || h.x > 520) h.vx *= -1;
      if (h.y < 0 || h.y > 300) h.vy *= -1;
      const dx = h.x - px;
      const dy = h.y - py;
      if (Math.hypot(dx, dy) < 14) score = 0;
    });
    score += 1;
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 520, 300);
    ctx.fillStyle = "#34d399";
    ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fb7185";
    hazards.forEach((h) => { ctx.beginPath(); ctx.arc(h.x, h.y, 6, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(`Survival: ${Math.floor(score / 10)}`, 10, 18);
  }, 30);
  return () => clearInterval(t);
}

function gameMath(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Quick Math</h3><p id="qmQ"></p><input id="qmIn" placeholder="Type answer and press Enter" /><p id="qmOut">Score: 0</p></div>`;
  const qEl = root.querySelector("#qmQ");
  const inEl = root.querySelector("#qmIn");
  const outEl = root.querySelector("#qmOut");
  let a = 0, b = 0, score = 0;
  const next = () => {
    a = 1 + Math.floor(Math.random() * 20);
    b = 1 + Math.floor(Math.random() * 20);
    qEl.textContent = `${a} + ${b} = ?`;
    inEl.value = "";
  };
  inEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const ok = Number(inEl.value) === a + b;
    if (ok) score += 1;
    outEl.textContent = ok ? `Correct. Score: ${score}` : `Wrong (${a + b}). Score: ${score}`;
    next();
  });
  setTimeout(() => inEl.focus(), 0);
  next();
  return () => {};
}

function renderSuggestions() {
  const sug = q("#suggestions");
  if (!state.query) {
    sug.style.display = "none";
    sug.innerHTML = "";
    return;
  }
  const hits = filteredGames().slice(0, 6);
  sug.innerHTML = hits.map(g => `<li data-id="${g.id}">${g.title}</li>`).join("");
  sug.style.display = hits.length ? "block" : "none";
}

function setView(view) {
  state.view = view;
  state.page = 1;
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  renderAll();
}

function renderAll() {
  renderFeatured();
  if (state.view === "stats") renderStats();
  else renderGrid();
  renderSuggestions();
  save();
}

function bind() {
  q("#searchInput").addEventListener("input", (e) => { state.query = e.target.value; state.page = 1; renderAll(); });
  q("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderAll(); });
  q("#categoryFilter").addEventListener("change", (e) => { state.category = e.target.value; state.page = 1; renderAll(); });
  q("#prevPage").addEventListener("click", () => { state.page = Math.max(1, state.page - 1); renderAll(); });
  q("#nextPage").addEventListener("click", () => { state.page += 1; renderAll(); });
  q("#gameGrid").addEventListener("click", (e) => {
    const play = e.target.closest("[data-play]");
    const fav = e.target.closest("[data-fav]");
    if (play) openGame(play.dataset.play);
    if (fav) {
      const id = fav.dataset.fav;
      if (state.favorites.includes(id)) state.favorites = state.favorites.filter(x => x !== id);
      else state.favorites.push(id);
      renderAll();
    }
  });
  q("#suggestions").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    openGame(li.dataset.id);
  });
  q("#favoritesShortcut").addEventListener("click", () => setView("favorites"));
  q("#randomBtn").addEventListener("click", () => {
    const list = filteredGames();
    if (!list.length) return;
    openGame(list[Math.floor(Math.random() * list.length)].id);
  });
  q("#settingsBtn").addEventListener("click", () => {
    applyUi();
    q("#settingsModal").showModal();
  });
  q("#closeSettings").addEventListener("click", () => q("#settingsModal").close());
  q("#saveSettings").addEventListener("click", () => {
    state.theme = q("#themeSelect").value;
    state.bg = q("#bgInput").value.trim();
    state.avatar = q("#avatarInput").value.trim();
    applyUi();
    save();
    q("#settingsModal").close();
    renderAll();
  });
  q("#unlockAdmin").addEventListener("click", () => {
    const code = q("#adminPasscode").value.trim();
    if (code === "admin1010123") {
      state.adminUnlocked = true;
      q("#adminStatus").textContent = "Unlocked";
      q("#adminPanel").hidden = false;
      loadAdminValuesIntoInputs();
      save();
    } else {
      q("#adminStatus").textContent = "Wrong passcode";
    }
    q("#adminPasscode").value = "";
  });
  q("#adminGameSelect").addEventListener("change", (e) => {
    const id = e.target.value;
    q("#adminPlays").value = String(state.stats.plays[id] || 0);
    q("#adminMinutes").value = String(state.stats.minutes[id] || 0);
  });
  q("#loadAdminValues").addEventListener("click", () => {
    if (!state.adminUnlocked) return;
    loadAdminValuesIntoInputs();
    q("#adminStatus").textContent = "Loaded saved values";
  });
  q("#resetSnakeConfig").addEventListener("click", () => {
    if (!state.adminUnlocked) return;
    state.snakeStartLength = 1;
    state.snakeTickMs = 120;
    loadAdminValuesIntoInputs();
    save();
    q("#adminStatus").textContent = "Snake defaults restored";
  });
  q("#applyAdmin").addEventListener("click", () => {
    if (!state.adminUnlocked) return;
    const id = q("#adminGameSelect").value;
    const plays = Math.max(0, Number(q("#adminPlays").value) || 0);
    const minutes = Math.max(0, Number(q("#adminMinutes").value) || 0);
    state.stats.plays[id] = plays;
    state.stats.minutes[id] = minutes;
    state.snakeStartLength = Math.max(200, Math.min(1, Number(q("#snakeStartLength").value) || 1));
    state.snakeTickMs = Math.max(40, Math.min(400, Number(q("#snakeTickMs").value) || 120));
    save();
    renderAll();
    q("#adminStatus").textContent = "Admin changes applied";
  });
  q("#hubTitle").addEventListener("input", (e) => { state.hubTitle = e.target.value; save(); });
  q("#sidebarToggle").addEventListener("click", () => {
    q("#sidebar").classList.toggle("is-collapsed");
    document.body.classList.toggle("collapsed", q("#sidebar").classList.contains("is-collapsed"));
  });
  q("#gridSize").addEventListener("input", (e) => { state.tileSize = Number(e.target.value); renderAll(); });
  q("#compactMode").addEventListener("change", (e) => { state.compact = e.target.checked; applyUi(); save(); });
  q("#safeMode").addEventListener("change", (e) => {
    state.safeMode = e.target.checked;
    document.documentElement.style.setProperty("--transition", state.safeMode ? "none" : "0.2s ease");
    save();
  });
  q("#netflixMode").addEventListener("change", (e) => {
    state.netflixMode = e.target.checked;
    q("#gameGrid").style.gridTemplateColumns = state.netflixMode ? "repeat(1, minmax(0, 1fr))" : "";
    save();
  });
  document.querySelectorAll(".nav-btn").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));
  q("#closeGame").addEventListener("click", closeGame);
  q("#minimizeGame").addEventListener("click", closeGame);
  q("#gameModal").addEventListener("cancel", (e) => e.preventDefault());
  const isTypingTarget = (target) =>
    !!target && (target.closest("input, textarea, [contenteditable='true']") || target.tagName === "INPUT" || target.tagName === "TEXTAREA");
  document.addEventListener("keydown", (e) => {
    if (!q("#gameModal").open) return;
    if (isTypingTarget(e.target)) return;
    if (activeGameKeydownHandler) activeGameKeydownHandler(e);
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
    if (e.code === "Space" || e.key.startsWith("Arrow")) {
      e.preventDefault();
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);
  document.addEventListener("keyup", (e) => {
    if (!q("#gameModal").open) return;
    if (activeGameKeyupHandler) activeGameKeyupHandler(e);
    if (e.code === "Space" || e.key.startsWith("Arrow")) e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);
  q("#fullscreenGame").addEventListener("click", async () => {
    const modal = q("#gameModal");
    const enable = !modal.classList.contains("is-fullscreen");
    modal.classList.toggle("is-fullscreen", enable);
    if (enable && modal.requestFullscreen) {
      try { await modal.requestFullscreen(); } catch (_) {}
    } else if (!enable && document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) q("#gameModal").classList.remove("is-fullscreen");
  });
}

function initPwa() {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
}

function init() {
  load();
  sanitizeState();
  applyUi();
  bind();
  renderAll();
  initPwa();
}

init();
