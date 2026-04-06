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
  stats: { plays: {}, minutes: {}, highscores: {} },
  achievements: [],
  adminUnlocked: false,
  snakeStartLength: 1,
  snakeTickMs: 120,
  selectedCar3D: 0
};
let activeCleanup = null;
let activeGameKeydownHandler = null;
let activeGameKeyupHandler = null;
const validCategories = ["Action", "Puzzle", "Racing", "Horror", "Multiplayer", "Retro", "Classic"];
const coverMap = {
  snake: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAACUCAMAAADcWPdGAAAArlBMVEUGPj2v+0Kz/0K2/0IAOD0APD28/0Kr80K5/0IALT0AEz2f50EAMj2e5EEAAD0ANj0AJj0xXj5Wiz4AGj17ukAAKj0kVz5LfT6k8EFnoD8AIj0AHzwAGD1rpT8VR0EOQj8ACT2P0EGHyECX20FXhz9MdT4gSD0gUUUvYEwADz0XPj1xrD9IeD5hmD+BwEAoWUlCbj42aD4+Xj4lTz03Uj1IaT4XOT0zWD4kQz04alLEi1hMAAAGpklEQVR4nO2cDXObuhKGQSADRpgPQwB/QGQI2MbYTrk3Sf//H7taYew4OWfqNsftmTv7xBNTtAi9Wml3YTJVFARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEAT5Oyj9/ffU2YD7M5dRXXCLHasqeovhP4huPeziUhIfXXbzdbTyff/hhsG6LS9C/6fm66voWVMY6gkj9L1bl4q3KorCyX5oHrUaIabjfXGcPwN9KQghvSStaI2kXdy4UuaGuHD0Y1fNC+jefP6NrtoUmnr207fxcaTZ3W2q5uDfG0RNpajRb1x/bDcCOSdnBVWqiWP/JlW3irJKVay/YvH1wd7KgoMa0iwLjagk4bBQeHfTtvobUZ8johfsV82N7v9HmNmwl5p51LXqSNNMTRutKlehkYAp1FpsFtEgkXqbyWQhznrz+Tyi70Sx3lwEuukie6jn46sYSjdzaxOdjq3F42QzvT3G/gKUgShzFym6u42bUFCKmaY0TdPlLnID7vB22w+BvaW2YfBdlIFd6l5ERfFS2MdMj/wVnDT4cXZxDM2apgljJiVtW+4kzj6esTvm46kjlh9x3kTe1Zk3E8DdWKwJryX/SUyx2UwjtoSlFaimWKFkxP8rGjXbHw+ivED4WBvtp1U40uTeFEYP57hgBSZ09ij8WDVE9AidJKV+P1WzBoIfKdLYr9gsOs0fi2Foid2HeqK+6sIb58DvGDAPZ1HWUZ7lUdcHUmmnOecQbgUwb/aj0MTNIdAStbmfr/St2Q/EcPhqn8b5wj2LUonYY/2AF7RKyBAmZWg5i7I6CNkkqV5CqUYtbHAX4RW9FkX1lXaJtIS090vHUTs6+QNuJvbM85QOorSwlI5UjWrRSCvTWdn9LFxEgRZCnmZPUhN/zd5a0K2V7rUor5WdjuxC7afq5trlF1QFxrCwTtvhRe9FmbsJezxKDbErMyjxJ9NJoL0X1bVgQAKL7jVYx52b5+NUWnhXoiYdZA+iHiebiZwhrZndTZQSPYeFQbRzsWTyF0uKIhPRupDn4mdYfVo7y5V8LEd/EmXG0iuhTre2HPt+JeCyn9OmGUTtoAsSQGyfyBXrzO8nSnG9h7htVo5x2kKk2fSBAooAL5GidrLmfYVA7YLzBlFEShGpjb4Ne46cpmfIy4OoUprLaskqwb32j4vhL0B1ZrnV67djEPaxsNpJUdOLqH5EstTQv5GLKLk9SDPJ6Vs/IdqZkX8tKpDLUyrVfSjOklueW35Vkvvy8rJ1RaLSXW8Hk2zEn0SBp8hfeEqDtSgusOhWRkWeLgWpRKRb+l5UPxeyAtmBp5LqbqL0quW2zdunjjGqV5CM1fLpoygflpm2nFNFn63e7alR3W+PB3crD/YbL4rG3ZPgVdct8QR62VPGsKfomN93T9GcQ4wgpsqbOPMCGcHjj6JKJoeslu5Caa+j3xHGqu1f3BS0GuXcmr0WpmmOQqtb7kV5NIh6kF3Yu/HU7bsI7yYqSocsT0hScBmhnNePy698lFGYqAUv1A95qm8JvGcZM5KwXDp97GZc7CwjGJ/ylLWUhgnfc7lSR9ndVt8kOYerU4Uj1tBj/FFURNVzRXEtiil9Css9mXOJFCQCRhrJaEBW3lBRUIec4qOM+HdMU9ORvYdwfhYmHupd65MoJiq8QblzJUpnvoztjjVtjaEPYiwj91mK4kNFkbPMPj9lExJad9NEadGNZwt31/BEg82lqbxzZZWuGVKUIY5IaSle6UCG1tTVM5TwokpXIW6LsDxNoUo3G2u+44aM5gaPPYVuHSjy0/G5SmfdypAbmGj2cnvPp0YfZowyLz+2YVEUYZm7it7Bk1UKLW4Kh5BRmN+uoF3PWxG1gzxaQgtEbSYfxFqmWNmubcKmjTO4VPdFh0HuPshWqCRcGjfcTpxV+3zP5ylx69M3dZlSdRWVd9MvLZdD3c0qaKcuvMWkMgnJd6+XN5WUMR1+9SPWaSVKDUXPt0Nn4uqq67rs596afg1Kzy+I/+ro/eEnm4vRlcWn6yilf+ItNIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIL8n0LhQ+Uf8dPhxL8Jevn0P8M5+u6flF7/pzdZTjOlzvO8zjMlo0pei5M5zXMlE9Ash/Y/B62VuhYDzOpMjKzOD3kmhyqOs/xAMxh+nQuTrH6nal3Xa7qWRrX4pkLfoT6IjzA71PS7kPr9TzpvfajrGvRkh7VyyMVw87X49V1ZrzPxDVoPyuGQrdfS/H8b3Ypstd7YagAAAABJRU5ErkJggg=="],
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
  cardrive: ["#111827", "#059669"],
  cardrive3d: ["#0a0a0a", "#ff6600"],
  pong: ["#1a1a2e", "#16213e"],
  flappybird: ["#87ceeb", "#2d5016"],
  tetris: ["#000080", "#00ff00"],
  pacman: ["#000033", "#ffff00"],
  spaceinvaders: ["#000000", "#00ff00"],
  hangman: ["#1f2937", "#fbbf24"],
  asteroids: ["#1a1a2e", "#00ffff"],
  checkers: ["#1a1a1a", "#999999"]
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
  { id: "g12", title: "Open Road Car Sim", category: "Racing", engine: "cardrive", tags: ["Cars", "Selection", "Driving"] },
  { id: "g13", title: "3D Car Drive", category: "Racing", engine: "cardrive3d", tags: ["3D", "OpenGL", "Fast"] },
  { id: "g14", title: "Pong Classic", category: "Multiplayer", engine: "pong", tags: ["Arcade", "Versus", "Paddles"] },
  { id: "g15", title: "Flappy Flight", category: "Action", engine: "flappybird", tags: ["Endless", "Timing", "Birds"] },
  { id: "g16", title: "Tetris Redux", category: "Retro", engine: "tetris", tags: ["Retro", "Blocks", "Offline"] },
  { id: "g17", title: "Pac-Man Maze", category: "Retro", engine: "pacman", tags: ["Retro", "Maze", "Ghosts"] },
  { id: "g18", title: "Space Invaders", category: "Retro", engine: "spaceinvaders", tags: ["Retro", "Shoot", "Arcade"] },
  { id: "g19", title: "Hangman", category: "Puzzle", engine: "hangman", tags: ["Word", "Classic", "Brain"] },
  { id: "g20", title: "Asteroids Classic", category: "Retro", engine: "asteroids", tags: ["Retro", "Shoot", "Arcade"] },
  { id: "g21", title: "Checkers Master", category: "Classic", engine: "checkers", tags: ["Strategy", "Board", "Offline"] }
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
    return `<article class="game-card"><h3>${g ? g.title : id}</h3><p>Plays: ${state.stats.plays[id] || 0}</p><p>Time: ${state.stats.minutes[id] || 0} min</p><p>High Score: ${state.stats.highscores[id] || 0}</p></article>`;
  }).join("") : "<p>Play a game to generate stats.</p>";
}

function renderAchievements() {
  if (state.view !== "achievements") return;
  const grid = q("#gameGrid");
  const achievements = [
    { id: "first-game", title: "First Steps", desc: "Play your first game", unlocked: state.stats.plays && Object.keys(state.stats.plays).length > 0 },
    { id: "ten-games", title: "Dedicated Player", desc: "Play 10 different games", unlocked: state.stats.plays && Object.keys(state.stats.plays).length >= 10 },
    { id: "100-plays", title: "Obsessed", desc: "Total 100 game plays", unlocked: Object.values(state.stats.plays || {}).reduce((a,b) => a+b, 0) >= 100 },
    { id: "favorite", title: "Favorite Collector", desc: "Add 5 favorites", unlocked: state.favorites.length >= 5 },
    { id: "speedrunner", title: "Speedrunner", desc: "Play a game 10 times", unlocked: Object.values(state.stats.plays || {}).some(p => p >= 10) },
    { id: "gamer-hour", title: "Gaming Hour", desc: "Spend 60+ minutes gaming", unlocked: Object.values(state.stats.minutes || {}).reduce((a,b) => a+b, 0) >= 60 }
  ];
  grid.innerHTML = achievements.map(a => `
    <article class="game-card" style="opacity:${a.unlocked ? 1 : 0.5}">
      <h3>${a.unlocked ? "🏆 " : "🔒 "}${a.title}</h3>
      <p>${a.desc}</p>
      <p style="font-size:12px;opacity:0.7">${a.unlocked ? "Unlocked" : "Locked"}</p>
    </article>
  `).join("");
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
  else if (game.engine === "cardrive3d") activeCleanup = gameCarDrive3D(host);
  else if (game.engine === "pong") activeCleanup = gamePong(host);
  else if (game.engine === "flappybird") activeCleanup = gameFlappyBird(host);
  else if (game.engine === "tetris") activeCleanup = gameTetris(host);
  else if (game.engine === "pacman") activeCleanup = gamePacMan(host);
  else if (game.engine === "spaceinvaders") activeCleanup = gameSpaceInvaders(host);
  else if (game.engine === "hangman") activeCleanup = gameHangman(host);
  else if (game.engine === "asteroids") activeCleanup = gameAsteroids(host);
  else if (game.engine === "checkers") activeCleanup = gameCheckers(host);
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

function gameCarDrive3D(root) {
  const carModels = [
    { name: "Drift Supra", widthMul: 0.9, heightMul: 0.8, lengthMul: 1.1, color: 0xff1111, accel: 0.025, maxSpeed: 0.65, turn: 0.1 },
    { name: "Range Rover", widthMul: 1.3, heightMul: 1.2, lengthMul: 1.0, color: 0x1a4d1a, accel: 0.018, maxSpeed: 0.45, turn: 0.07 },
    { name: "Tesla Model S", widthMul: 1.0, heightMul: 0.85, lengthMul: 1.15, color: 0x333333, accel: 0.03, maxSpeed: 0.7, turn: 0.09 },
    { name: "Ferrari", widthMul: 0.85, heightMul: 0.75, lengthMul: 1.05, color: 0xcc0000, accel: 0.035, maxSpeed: 0.8, turn: 0.12 },
    { name: "Jeep Wrangler", widthMul: 1.2, heightMul: 1.0, lengthMul: 0.95, color: 0xffaa00, accel: 0.02, maxSpeed: 0.55, turn: 0.08 }
  ];
  
  root.innerHTML = `<div style="width:100%;height:100%;position:relative">
    <div style="position:absolute;top:8px;left:12px;z-index:10;display:flex;gap:6px;background:rgba(0,0,0,0.7);padding:8px;border-radius:8px;max-width:calc(100% - 30px)">
      <h3 style="margin:0;color:#fff">${carModels[state.selectedCar3D].name}</h3>
      ${carModels.map((c, i) => `<button data-car="${i}" style="padding:6px 10px;border-radius:6px;border:${i===state.selectedCar3D?'2px solid #fff':'1px solid #aaa'};background:rgba(255,255,255,${i===state.selectedCar3D?0.3:0.1});color:#fff;cursor:pointer;font-size:11px">${c.name}</button>`).join('')}
    </div>
    <div id="c3d" style="width:100%;height:100%"></div>
    <p id="c3dOut" style="position:absolute;bottom:12px;left:12px;color:#fff;margin:0">WASD/Arrows: Drive | Space: Brake</p>
  </div>`;
  
  // Car selection
  root.querySelectorAll('[data-car]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const newCarIdx = parseInt(e.target.dataset.car);
      state.selectedCar3D = newCarIdx;
      save();
      closeGame();
    });
  });
  const container = root.querySelector("#c3d");
  const out = root.querySelector("#c3dOut");
  const w = container.clientWidth || 860;
  const h = container.clientHeight || 420;
  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.Fog(0x87CEEB, 300, 700);
  
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 4, 12);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;
  container.appendChild(renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(150, 150, 150);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.far = 1200;
  directionalLight.shadow.camera.left = -400;
  directionalLight.shadow.camera.right = 400;
  directionalLight.shadow.camera.top = 400;
  directionalLight.shadow.camera.bottom = -400;
  scene.add(directionalLight);
  
  // Ground - much larger realistic terrain
  const groundGeom = new THREE.PlaneGeometry(800, 800);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a9d3a, roughness: 0.85 });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Add grass areas for visual variety
  function createGrassPlot(x, z, w, d) {
    const grassGeom = new THREE.PlaneGeometry(w, d);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4db84d, roughness: 0.9 });
    const grass = new THREE.Mesh(grassGeom, grassMat);
    grass.position.set(x, 0.005, z);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);
  }
  
  createGrassPlot(-250, -250, 150, 150);
  createGrassPlot(250, 250, 150, 150);
  createGrassPlot(-250, 250, 150, 150);
  createGrassPlot(250, -250, 150, 150);
  
  // Helper function for roads
  function createRoad(x, z, width, length, rotation = 0, color = 0x333333) {
    const roadGeom = new THREE.PlaneGeometry(width, length);
    const roadMat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
    const road = new THREE.Mesh(roadGeom, roadMat);
    road.position.set(x, 0.01, z);
    road.rotation.x = -Math.PI / 2;
    if (rotation) road.rotation.z = rotation;
    road.receiveShadow = true;
    scene.add(road);
    
    // Add lane markings for longer roads only
    if (length > 30) {
      const lineGeom = new THREE.PlaneGeometry(0.5, 5);
      const lineMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const numLines = Math.floor(length / 10);
      for (let i = 0; i < numLines; i++) {
        const line = new THREE.Mesh(lineGeom, lineMat);
        line.position.set(x, 0.02, z - length/2 + i * 10);
        line.rotation.x = -Math.PI / 2;
        scene.add(line);
      }
    }
  }
  
  // Main city highways
  createRoad(0, 0, 32, 220);  // Main north-south highway
  createRoad(-150, -100, 220, 32); // Major east-west road
  createRoad(150, 100, 220, 32); // Major east-west road
  
  // Connector roads
  createRoad(-80, -150, 24, 120);
  createRoad(80, 150, 24, 120);
  
  // Secondary roads
  createRoad(-140, 80, 20, 80, 0.2);
  createRoad(140, -80, 20, 80, -0.2);
  createRoad(0, 150, 18, 60);
  createRoad(0, -150, 18, 60);
  
  // ==================== RACE TRACKS ====================
  
  // Circular race track (right side) - high-performance track
  function createCircularTrack(centerX, centerZ, radius, trackWidth) {
    const trackMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.7 }); // Orange track
    const torusGeom = new THREE.TorusGeometry(radius, trackWidth / 2, 16, 32);
    const track = new THREE.Mesh(torusGeom, trackMat);
    track.position.set(centerX, 0.015, centerZ);
    track.rotation.x = -Math.PI / 2;
    track.receiveShadow = true;
    scene.add(track);
  }
  
  createCircularTrack(280, 0, 55, 14);
  
  // Figure-8 race track (left side) - technical track - simpler version
  function createFigure8Track(centerX, centerZ, loopRadius, trackWidth) {
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.7 }); // Green track
    
    // Create two circular loops
    const torusGeom = new THREE.TorusGeometry(loopRadius, trackWidth / 2, 16, 32);
    
    const loop1 = new THREE.Mesh(torusGeom, trackMat.clone());
    loop1.position.set(centerX, 0.015, centerZ + loopRadius * 1.2);
    loop1.rotation.x = -Math.PI / 2;
    loop1.receiveShadow = true;
    scene.add(loop1);
    
    const loop2 = new THREE.Mesh(torusGeom.clone(), trackMat.clone());
    loop2.position.set(centerX, 0.015, centerZ - loopRadius * 1.2);
    loop2.rotation.x = -Math.PI / 2;
    loop2.receiveShadow = true;
    scene.add(loop2);
    
    // Connect the loops with a road
    const connectorGeom = new THREE.PlaneGeometry(trackWidth, loopRadius * 2.4);
    const connectorMat = new THREE.MeshStandardMaterial({ color: 0x00cc00, roughness: 0.7 });
    const connector = new THREE.Mesh(connectorGeom, connectorMat);
    connector.position.set(centerX, 0.016, centerZ);
    connector.rotation.x = -Math.PI / 2;
    connector.receiveShadow = true;
    scene.add(connector);
  }
  
  createFigure8Track(-280, 0, 45, 12);
  
  // Create buildings function with more visual variety
  function createBuilding(x, z, w, h, d, color, hasRoof = true) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.7 });
    const building = new THREE.Mesh(geom, mat);
    building.position.set(x, h / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);
    
    if (hasRoof) {
      const roofGeom = new THREE.ConeGeometry(Math.max(w, d) / 1.8, h * 0.3, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0, roughness: 0.8 });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.set(x, h + h * 0.15, z);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);
    }
  }
  
  // Stadium/Large building (center)
  createBuilding(0, 0, 60, 20, 60, 0x666666, false);
  
  // Downtown district (North)
  createBuilding(-80, -180, 20, 28, 18, 0xb8860b);
  createBuilding(-50, -180, 22, 30, 20, 0xd2b48c);
  createBuilding(-20, -180, 18, 26, 16, 0xa0826d);
  createBuilding(20, -180, 24, 32, 22, 0xcd853f);
  createBuilding(60, -180, 20, 28, 18, 0xbc8f8f);
  
  createBuilding(-80, -150, 20, 26, 18, 0xc9a961);
  createBuilding(-50, -150, 22, 29, 20, 0xd4c4a8);
  createBuilding(20, -150, 18, 25, 16, 0xb0956b);
  createBuilding(60, -150, 24, 31, 22, 0xdaa520);
  
  // Harbor district (South)
  createBuilding(-80, 180, 20, 24, 18, 0x8b7355);
  createBuilding(-50, 180, 22, 26, 20, 0xa0826d);
  createBuilding(20, 180, 18, 23, 16, 0x996633);
  createBuilding(60, 180, 24, 28, 22, 0xbb8844);
  
  createBuilding(-80, 150, 20, 25, 18, 0x9d7c6a);
  createBuilding(-50, 150, 22, 27, 20, 0xb8956b);
  createBuilding(20, 150, 18, 24, 16, 0x8b7d6b);
  createBuilding(60, 150, 24, 29, 22, 0xaa9977);
  
  // East district - industrial zone
  createBuilding(220, -120, 28, 18, 28, 0x696969);
  createBuilding(220, -80, 28, 16, 28, 0x696969);
  createBuilding(220, -40, 28, 18, 28, 0x696969);
  createBuilding(220, 40, 28, 16, 28, 0x696969);
  createBuilding(220, 120, 28, 18, 28, 0x696969);
  
  // West district - residential
  createBuilding(-220, -120, 18, 20, 16, 0xd4af37);
  createBuilding(-220, -75, 18, 20, 16, 0xd4af37);
  createBuilding(-220, -30, 18, 20, 16, 0xd4af37);
  createBuilding(-220, 40, 18, 20, 16, 0xd4af37);
  createBuilding(-220, 120, 18, 20, 16, 0xd4af37);
  
  // Race track areas - paddock buildings
  createBuilding(280, -100, 16, 12, 14, 0xcccccc, false);
  createBuilding(280, 100, 16, 12, 14, 0xcccccc, false);
  createBuilding(-280, -85, 16, 12, 14, 0xcccccc, false);
  createBuilding(-280, 85, 16, 12, 14, 0xcccccc, false);
  
  // Create trees with variety
  function createTree(x, z, scale = 1) {
    const trunkHeight = 6 * scale;
    const foliageSize = 4 * scale;
    
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.8 * scale, 1 * scale, trunkHeight, 8), 
      new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 }));
    trunk.position.set(x, trunkHeight / 2, z);
    trunk.castShadow = true;
    scene.add(trunk);
    
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(foliageSize, 8, 8), 
      new THREE.MeshStandardMaterial({ color: 0x2d5016, roughness: 0.8 }));
    foliage.position.set(x, trunkHeight + foliageSize * 0.7, z);
    foliage.castShadow = true;
    scene.add(foliage);
  }
  
  // Forest areas on enlarged map
  const treePositions = [
    // North forest
    [-300, -280], [-280, -260], [-320, -300], [-270, -320], [-310, -270],
    [-350, -290], [-290, -280], [-330, -310],
    
    // South forest
    [300, 280], [280, 260], [320, 300], [270, 320], [310, 270],
    [350, 290], [290, 280], [330, 310],
    
    // West forest
    [-350, -80], [-340, 20], [-360, 60], [-330, 100], [-350, 140],
    [-370, -40], [-340, 80],
    
    // East forest
    [350, -80], [340, 20], [360, 60], [330, 100], [350, 140],
    [370, -40], [340, 80],
    
    // Park areas around city
    [-120, 200], [120, -200], [150, 150], [-150, -150],
    [50, 250], [-50, -250], [200, 50], [-200, -50]
  ];
  
  treePositions.forEach(p => createTree(p[0], p[1], Math.random() * 0.5 + 0.8));
  
  // Create dynamic car based on selected model
  const carGroup = new THREE.Group();
  scene.add(carGroup);
  
  const carSpec = carModels[state.selectedCar3D];
  
  // Car body with model-specific proportions
  const bodyWidth = 2.2 * carSpec.widthMul;
  const bodyHeight = 1.2 * carSpec.heightMul;
  const bodyLength = 4.5 * carSpec.lengthMul;
  
  // Create smooth car body using LatheGeometry for front profile
  const bodyMat = new THREE.MeshStandardMaterial({ color: carSpec.color, metalness: 0.7, roughness: 0.3 });
  
  // Main body as rounded box with curved top
  const bodyGeom = new THREE.BoxGeometry(bodyWidth, bodyHeight * 0.65, bodyLength, 8, 6, 16);
  // Curve the top by manipulating vertices
  const bodyPositions = bodyGeom.attributes.position;
  for (let i = 0; i < bodyPositions.count; i++) {
    const y = bodyPositions.getY(i);
    const z = bodyPositions.getZ(i);
    if (y > 0) {
      const curve = Math.cos((z / bodyLength) * Math.PI) * 0.15;
      bodyPositions.setY(i, y + curve * bodyHeight);
    }
  }
  bodyPositions.needsUpdate = true;
  bodyGeom.computeVertexNormals();
  
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = bodyHeight * 0.5;
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);
  
  // Rounded cabin section
  const cabinGeom = new THREE.BoxGeometry(bodyWidth * 0.82, bodyHeight * 0.58, bodyLength * 0.42, 8, 5, 12);
  const cabinMat = new THREE.MeshStandardMaterial({ color: carSpec.color, metalness: 0.75, roughness: 0.25 });
  const cabin = new THREE.Mesh(cabinGeom, cabinMat);
  cabin.position.set(0, bodyHeight * 1.08, -bodyLength * 0.12);
  cabin.castShadow = true;
  // Subtle rounding to cabin
  const cabinPos = cabin.geometry.attributes.position;
  for (let i = 0; i < cabinPos.count; i++) {
    const x = cabinPos.getX(i);
    const y = cabinPos.getY(i);
    if (Math.abs(x) > bodyWidth * 0.3) {
      cabinPos.setX(i, x * 0.9);
    }
    if (y > 0) {
      cabinPos.setY(i, y + 0.1);
    }
  }
  cabinPos.needsUpdate = true;
  cabin.geometry.computeVertexNormals();
  carGroup.add(cabin);
  
  // Windows with frame
  const windowFrame = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.2 });
  const windowGlass = new THREE.MeshStandardMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.55, metalness: 0.95, roughness: 0.1 });
  
  const windowPositions = [
    { x: -bodyWidth * 0.28, z: -bodyLength * 0.1 },
    { x: bodyWidth * 0.28, z: -bodyLength * 0.1 },
    { x: -bodyWidth * 0.25, z: bodyLength * 0.1 },
    { x: bodyWidth * 0.25, z: bodyLength * 0.1 }
  ];
  
  windowPositions.forEach(pos => {
    const frameGeom = new THREE.BoxGeometry(bodyWidth * 0.32, bodyHeight * 0.48, 0.15);
    const frame = new THREE.Mesh(frameGeom, windowFrame);
    frame.position.set(pos.x, bodyHeight * 1.3, pos.z - bodyLength * 0.2);
    carGroup.add(frame);
    
    const glassGeom = new THREE.BoxGeometry(bodyWidth * 0.27, bodyHeight * 0.42, 0.08);
    const glass = new THREE.Mesh(glassGeom, windowGlass);
    glass.position.set(pos.x, bodyHeight * 1.3, pos.z - bodyLength * 0.195);
    carGroup.add(glass);
  });
  
  // Front bumper with grille
  const bumperGeom = new THREE.BoxGeometry(bodyWidth * 0.95, bodyHeight * 0.25, 0.4, 12, 3, 4);
  const bumperMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.5 });
  const bumper = new THREE.Mesh(bumperGeom, bumperMat);
  bumper.position.set(0, bodyHeight * 0.35, bodyLength * 0.38);
  bumper.castShadow = true;
  carGroup.add(bumper);
  
  // Headlights (more realistic styling)
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffff99, emissive: 0xffff00, emissiveIntensity: 0.4, metalness: 0.8 });
  [-bodyWidth * 0.32, bodyWidth * 0.32].forEach(xPos => {
    const headlightGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const headlight = new THREE.Mesh(headlightGeom, lightMat);
    headlight.position.set(xPos, bodyHeight * 0.45, bodyLength * 0.45);
    carGroup.add(headlight);
  });
  
  // Rear lights
  const tailLightMat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff0000, emissiveIntensity: 0.2, metalness: 0.7 });
  [-bodyWidth * 0.3, bodyWidth * 0.3].forEach(xPos => {
    const tailGeom = new THREE.BoxGeometry(0.3, 0.4, 0.2, 8, 8, 4);
    const tailLight = new THREE.Mesh(tailGeom, tailLightMat);
    tailLight.position.set(xPos, bodyHeight * 0.45, -bodyLength * 0.4);
    carGroup.add(tailLight);
  });
  
  // Side mirrors
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.85, roughness: 0.15 });
  [-bodyWidth * 0.5, bodyWidth * 0.5].forEach(xPos => {
    const mirrorGeom = new THREE.BoxGeometry(0.15, 0.35, 0.25, 4, 4, 4);
    const mirror = new THREE.Mesh(mirrorGeom, mirrorMat);
    mirror.position.set(xPos, bodyHeight * 0.85, 0);
    carGroup.add(mirror);
  });
  
  // Spoiler (especially visible on Supra)
  if (state.selectedCar3D === 0) {
    const spoilerGeom = new THREE.BoxGeometry(bodyWidth * 0.65, bodyHeight * 0.55, 0.25, 12, 8, 3);
    const spoilerMat = new THREE.MeshStandardMaterial({ color: 0xaa0000, metalness: 0.85, roughness: 0.2 });
    const spoiler = new THREE.Mesh(spoilerGeom, spoilerMat);
    spoiler.position.set(0, bodyHeight * 0.85, -bodyLength * 0.42);
    spoiler.castShadow = true;
    carGroup.add(spoiler);
  }
  
  // Enhanced wheels with tires and rims
  const wheelRadius = 0.7 * Math.sqrt((carSpec.widthMul + carSpec.heightMul) / 2);
  const wheelWidth = 0.45;
  
  // Tire geometry
  const tireGeom = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24, 8);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.8 });
  
  // Rim geometry (visible through tire)
  const rimGeom = new THREE.CylinderGeometry(wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth * 0.6, 16, 4);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.2 });
  
  const wheelPosX = bodyWidth * 0.36;
  const wheelPosY = wheelRadius;
  const wheelPosZ_front = bodyLength * 0.3;
  const wheelPosZ_rear = -bodyLength * 0.3;
  
  const wheelPositions = [
    [-wheelPosX, wheelPosY, wheelPosZ_front], [wheelPosX, wheelPosY, wheelPosZ_front],
    [-wheelPosX, wheelPosY, wheelPosZ_rear], [wheelPosX, wheelPosY, wheelPosZ_rear]
  ];
  
  const wheels = [];
  wheelPositions.forEach(pos => {
    const tire = new THREE.Mesh(tireGeom.clone(), tireMat.clone());
    tire.rotation.z = Math.PI / 2;
    tire.position.set(...pos);
    tire.castShadow = true;
    carGroup.add(tire);
    
    const rim = new THREE.Mesh(rimGeom.clone(), rimMat.clone());
    rim.rotation.z = Math.PI / 2;
    rim.position.set(pos[0], pos[1], pos[2]);
    carGroup.add(rim);
    
    wheels.push(tire);
  });
  
  // Game state
  let carVelX = 0;
  let carVelZ = 0;
  let carAngle = 0;
  let distance = 0;
  let wheelRotation = 0;
  
  const keys = { w: false, a: false, s: false, d: false, space: false };
  
  activeGameKeydownHandler = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.keyCode === 38) { keys.w = true; e.preventDefault(); }
    if (k === 'a' || e.keyCode === 37) { keys.a = true; e.preventDefault(); }
    if (k === 's' || e.keyCode === 40) { keys.s = true; e.preventDefault(); }
    if (k === 'd' || e.keyCode === 39) { keys.d = true; e.preventDefault(); }
    if (k === ' ') { keys.space = true; e.preventDefault(); }
  };
  
  activeGameKeyupHandler = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.keyCode === 38) keys.w = false;
    if (k === 'a' || e.keyCode === 37) keys.a = false;
    if (k === 's' || e.keyCode === 40) keys.s = false;
    if (k === 'd' || e.keyCode === 39) keys.d = false;
    if (k === ' ') keys.space = false;
  };
  
  const interval = setInterval(() => {
    // Car-specific physics
    const maxSpeed = carSpec.maxSpeed;
    const accel = carSpec.accel;
    const friction = 0.92;
    
    let targetSpeedMag = 0;
    if (keys.w) targetSpeedMag = maxSpeed;
    if (keys.s) targetSpeedMag = -maxSpeed * 0.5;
    
    const currentSpeed = Math.sqrt(carVelX * carVelX + carVelZ * carVelZ);
    if (keys.space) {
      carVelX *= 0.7;
      carVelZ *= 0.7;
    } else if (currentSpeed < targetSpeedMag) {
      carVelX += Math.sin(carAngle) * accel;
      carVelZ += Math.cos(carAngle) * accel;
    } else if (currentSpeed > targetSpeedMag) {
      carVelX *= friction;
      carVelZ *= friction;
    } else {
      carVelX *= friction;
      carVelZ *= friction;
    }
    
    // Steering based on car model
    if (Math.sqrt(carVelX * carVelX + carVelZ * carVelZ) > 0.05) {
      if (keys.a) carAngle += carSpec.turn;
      if (keys.d) carAngle -= carSpec.turn;
    }
    
    // Update position
    carGroup.position.x += carVelX;
    carGroup.position.z += carVelZ;
    carGroup.rotation.y = carAngle;
    
    // Keep in bounds (larger 800x800 map)
    carGroup.position.x = Math.max(-390, Math.min(390, carGroup.position.x));
    carGroup.position.z = Math.max(-390, Math.min(390, carGroup.position.z));
    
    // Wheel rotation
    const speed = Math.sqrt(carVelX * carVelX + carVelZ * carVelZ);
    wheelRotation += speed * 0.3;
    wheels.forEach(w => {
      w.rotation.x = wheelRotation;
    });
    
    // Distance counter
    distance += speed;
    
    // Camera follow
    const cameraDistance = 10;
    const cameraHeight = 4;
    const targetCamX = carGroup.position.x - Math.sin(carAngle) * cameraDistance;
    const targetCamZ = carGroup.position.z - Math.cos(carAngle) * cameraDistance;
    
    camera.position.x += (targetCamX - camera.position.x) * 0.1;
    camera.position.z += (targetCamZ - camera.position.z) * 0.1;
    camera.position.y = Math.max(2, carGroup.position.y + cameraHeight);
    camera.lookAt(carGroup.position.x, carGroup.position.y + 1.5, carGroup.position.z);
    
    // Update light position
    directionalLight.position.set(carGroup.position.x + 80, 100, carGroup.position.z + 80);
    
    const speedKmh = (speed * 100).toFixed(1);
    out.textContent = `${carSpec.name} | Speed: ${speedKmh} km/h | Distance: ${distance.toFixed(0)}m | Pos: ${carGroup.position.x.toFixed(0)}, ${carGroup.position.z.toFixed(0)}`;
    
    renderer.render(scene, camera);
  }, 30);
  
  return () => {
    clearInterval(interval);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}

function gamePong(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Pong - 2 Player</h3><canvas id="pong" width="640" height="400" style="max-width:100%;background:#1a1a2e;border-radius:8px;display:block;margin:0 auto"></canvas><p id="pongOut">P1: W/S | P2: UP/DOWN Arrow | First to 11 wins!</p></div>`;
  const c = root.querySelector("#pong");
  const ctx = c.getContext("2d");
  const out = root.querySelector("#pongOut");
  
  const ball = { x: c.width / 2, y: c.height / 2, r: 6, vx: 4, vy: 4 };
  const paddle1 = { x: 15, y: c.height / 2 - 50, w: 10, h: 100, vy: 0 };
  const paddle2 = { x: c.width - 25, y: c.height / 2 - 50, w: 10, h: 100, vy: 0 };
  let score1 = 0, score2 = 0;
  let gameOver = false;
  let winner = "";
  const keys = { w: false, s: false, up: false, down: false };
  
  activeGameKeydownHandler = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w') { keys.w = true; e.preventDefault(); }
    if (k === 's') { keys.s = true; e.preventDefault(); }
    if (e.keyCode === 38) { keys.up = true; e.preventDefault(); } // Up arrow
    if (e.keyCode === 40) { keys.down = true; e.preventDefault(); } // Down arrow
  };
  
  activeGameKeyupHandler = (e) => {
    const k = e.key.toLowerCase();
    if (k === 'w') keys.w = false;
    if (k === 's') keys.s = false;
    if (e.keyCode === 38) keys.up = false; // Up arrow
    if (e.keyCode === 40) keys.down = false; // Down arrow
  };
  
  const interval = setInterval(() => {
    if (gameOver) return;
    
    // Player 1 control (W/S)
    paddle1.y += (keys.w ? -5 : keys.s ? 5 : 0);
    paddle1.y = Math.max(0, Math.min(c.height - paddle1.h, paddle1.y));
    
    // Player 2 control (UP/DOWN arrows)
    paddle2.y += (keys.up ? -5 : keys.down ? 5 : 0);
    paddle2.y = Math.max(0, Math.min(c.height - paddle2.h, paddle2.y));
    
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    if (ball.y - ball.r < 0 || ball.y + ball.r > c.height) ball.vy *= -1;
    
    if (ball.x - ball.r < paddle1.x + paddle1.w && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.h) {
      ball.vx *= -1;
      ball.x = paddle1.x + paddle1.w + ball.r;
    }
    if (ball.x + ball.r > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.h) {
      ball.vx *= -1;
      ball.x = paddle2.x - ball.r;
    }
    
    if (ball.x < 0) { score2++; ball.x = c.width / 2; ball.y = c.height / 2; ball.vx = 4; }
    if (ball.x > c.width) { score1++; ball.x = c.width / 2; ball.y = c.height / 2; ball.vx = -4; }
    
    if (score1 >= 11) { gameOver = true; winner = "P1 Wins!"; }
    if (score2 >= 11) { gameOver = true; winner = "P2 Wins!"; }
    
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, c.width, c.height);
    
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(c.width / 2, 0);
    ctx.lineTo(c.width / 2, c.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = "#ff6600";
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score1, c.width / 4, 30);
    ctx.fillText(score2, c.width * 3 / 4, 30);
    
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 48px Arial";
      ctx.fillText(winner, c.width / 2, c.height / 2);
    }
    
    out.textContent = gameOver ? `${score1} - ${score2} | ${winner}` : `${score1} - ${score2}`;
  }, 30);
  
  return () => clearInterval(interval);
}

function gameFlappyBird(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Flappy Flight</h3><canvas id="flappy" width="400" height="500" style="max-width:100%;background:linear-gradient(to bottom,#87ceeb,#e0f6ff);border-radius:8px;display:block;margin:0 auto"></canvas><p id="flappyOut">Click or press SPACE to flap</p></div>`;
  const c = root.querySelector("#flappy");
  const ctx = c.getContext("2d");
  const out = root.querySelector("#flappyOut");
  
  const bird = { x: 50, y: c.height / 2, r: 12, vy: 0, flap: -8, gravity: 0.35 };
  const pipes = [];
  const gap = 160;
  const pipeW = 30;
  let score = 0;
  let gameOver = false;
  
  const spawnPipe = () => {
    const minY = 40;
    const maxY = c.height - gap - 40;
    const topY = minY + Math.random() * (maxY - minY);
    pipes.push({ x: c.width, topY, bottomY: topY + gap });
  };
  
  const tick = () => {
    bird.vy += bird.gravity;
    bird.y += bird.vy;
    
    if (bird.y + bird.r > c.height || bird.y - bird.r < 0) gameOver = true;
    
    pipes.forEach((pipe, i) => {
      pipe.x -= 4;
      if (pipe.x + pipeW < 0) {
        pipes.splice(i, 1);
        score++;
      }
      
      if (bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + pipeW) {
        if (bird.y - bird.r < pipe.topY || bird.y + bird.r > pipe.bottomY) {
          gameOver = true;
        }
      }
    });
    
    if (pipes.length === 0 || pipes[pipes.length - 1].x < c.width - 150) spawnPipe();
  };
  
  const render = () => {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, c.width, c.height);
    
    pipes.forEach(pipe => {
      ctx.fillStyle = "#2d5016";
      ctx.fillRect(pipe.x, 0, pipeW, pipe.topY);
      ctx.fillRect(pipe.x, pipe.bottomY, pipeW, c.height - pipe.bottomY);
    });
    
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 25);
    
    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", c.width / 2, c.height / 2 - 20);
      ctx.font = "20px Arial";
      ctx.fillText(`Final Score: ${score}`, c.width / 2, c.height / 2 + 20);
    }
  };
  
  const flap = () => {
    if (!gameOver) bird.vy = bird.flap;
  };
  
  c.addEventListener("click", flap);
  activeGameKeydownHandler = (e) => {
    if (e.code === "Space") { flap(); e.preventDefault(); }
  };
  
  const interval = setInterval(() => {
    if (!gameOver) tick();
    render();
    out.textContent = gameOver ? `Game Over - Score: ${score}` : `Score: ${score}`;
  }, 30);
  
  return () => clearInterval(interval);
}

function gameTetris(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Tetris Redux</h3><canvas id="tetris" width="240" height="480" style="max-width:100%;background:#000;border-radius:8px;display:block;margin:0 auto;border:2px solid #0f0"></canvas><p id="tetrisOut">Classic Tetris - Press SPACE to rotate</p></div>`;
  const c = root.querySelector("#tetris");
  const ctx = c.getContext("2d");
  const out = root.querySelector("#tetrisOut");
  const grid = Array(20).fill().map(() => Array(10).fill(0));
  const blocks = [
    {shape:[[1,1,1,1]], color:"#00ffff"},
    {shape:[[1,1],[1,1]], color:"#ffff00"},
    {shape:[[0,1,1],[1,1,0]], color:"#ff00ff"},
    {shape:[[1,1,0],[0,1,1]], color:"#00ff00"},
    {shape:[[1,0],[1,0],[1,1]], color:"#ff0000"},
    {shape:[[0,1],[0,1],[1,1]], color:"#0000ff"},
    {shape:[[0,1],[1,1],[0,1]], color:"#ffaa00"}
  ];
  let current = {...blocks[Math.floor(Math.random()*blocks.length)], x: 3, y: 0};
  let score = 0;
  let gameOver = false;
  const tick = () => {
    if(gameOver) return;
    if(!canMove(current, 0, 1)) {
      placePiece(current);
      current = {...blocks[Math.floor(Math.random()*blocks.length)], x: 3, y: 0};
      if(!canMove(current, 0, 0)) gameOver = true;
    } else {
      current.y++;
    }
    clearLines();
  };
  const canMove = (p, dx, dy) => {
    for(let y = 0; y < p.shape.length; y++) {
      for(let x = 0; x < p.shape[y].length; x++) {
        if(!p.shape[y][x]) continue;
        const nx = p.x + x + dx, ny = p.y + y + dy;
        if(nx < 0 || nx >= 10 || ny >= 20) return false;
        if(ny >= 0 && grid[ny][nx]) return false;
      }
    }
    return true;
  };
  const placePiece = (p) => {
    for(let y = 0; y < p.shape.length; y++) {
      for(let x = 0; x < p.shape[y].length; x++) {
        if(p.shape[y][x]) {
          const ny = p.y + y;
          if(ny >= 0) grid[ny][p.x + x] = p.color;
        }
      }
    }
  };
  const clearLines = () => {
    for(let y = grid.length - 1; y >= 0; y--) {
      if(grid[y].every(c => c !== 0)) {
        grid.splice(y, 1);
        grid.unshift(Array(10).fill(0));
        score += 100;
      }
    }
  };
  const render = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    for(let y = 0; y < 20; y++) {
      for(let x = 0; x < 10; x++) {
        const cell = grid[y][x];
        if(cell) {
          ctx.fillStyle = cell;
          ctx.fillRect(x * 24, y * 24, 23, 23);
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          ctx.strokeRect(x * 24, y * 24, 23, 23);
        }
      }
    }
    for(let y = 0; y < current.shape.length; y++) {
      for(let x = 0; x < current.shape[y].length; x++) {
        if(current.shape[y][x]) {
          ctx.fillStyle = current.color;
          const px = (current.x + x) * 24, py = (current.y + y) * 24;
          ctx.fillRect(px, py, 23, 23);
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, 23, 23);
        }
      }
    }
    ctx.fillStyle = "#0f0";
    ctx.font = "bold 12px Arial";
    ctx.fillText(`Score: ${score}`, 5, c.height - 5);
    if(gameOver) {
      ctx.fillStyle = "rgba(255,0,0,0.5)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", c.width/2, c.height/2);
    }
  };
  activeGameKeydownHandler = (e) => {
    if(gameOver) return;
    if(e.code === "ArrowLeft" && canMove(current, -1, 0)) current.x--;
    if(e.code === "ArrowRight" && canMove(current, 1, 0)) current.x++;
    if(e.code === "Space") {
      const rotated = {shape: current.shape[0].map((_, i) => current.shape.map(r => r[i]).reverse()), x: current.x, y: current.y, color: current.color};
      if(canMove(rotated, 0, 0)) current.shape = rotated.shape;
    }
  };
  const interval = setInterval(tick, 400);
  const renderInterval = setInterval(render, 30);
  return () => { clearInterval(interval); clearInterval(renderInterval); };
}

function gamePacMan(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Pac-Man Maze</h3><canvas id="pacman" width="400" height="400" style="max-width:100%;background:#000033;border-radius:8px;display:block;margin:0 auto"></canvas><p id="pacmanOut">Use Arrow Keys - Eat pellets, avoid ghosts</p></div>`;
  const c = root.querySelector("#pacman");
  const ctx = c.getContext("2d");
  const grid = 20;
  const pellets = [];
  for(let y = 0; y < 20; y++) for(let x = 0; x < 20; x++) pellets.push({x,y});
  const pacman = {x: 10, y: 10, mouth: 0};
  const ghosts = [{x: 1, y: 1, color: "#ff0000"}, {x: 18, y: 1, color: "#ffb8ff"}, {x: 1, y: 18, color: "#00ffff"}];
  let score = 0;
  let dx = 0, dy = 0;
  let nextDx = 0, nextDy = 0;
  activeGameKeydownHandler = (e) => {
    if(e.key === "ArrowUp") nextDx = 0, nextDy = -1;
    if(e.key === "ArrowDown") nextDx = 0, nextDy = 1;
    if(e.key === "ArrowLeft") nextDx = -1, nextDy = 0;
    if(e.key === "ArrowRight") nextDx = 1, nextDy = 0;
  };
  const tick = () => {
    if(nextDx !== 0 || nextDy !== 0) dx = nextDx, dy = nextDy;
    const nx = pacman.x + dx, ny = pacman.y + dy;
    if(nx >= 0 && nx < 20 && ny >= 0 && ny < 20) {
      pacman.x = nx; pacman.y = ny;
    }
    for(let i = pellets.length - 1; i >= 0; i--) {
      if(pellets[i].x === pacman.x && pellets[i].y === pacman.y) {
        pellets.splice(i, 1);
        score += 10;
      }
    }
    ghosts.forEach(g => {
      g.x += Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0;
      g.y += Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0;
      g.x = Math.max(0, Math.min(19, g.x));
      g.y = Math.max(0, Math.min(19, g.y));
      if(g.x === pacman.x && g.y === pacman.y) score = 0;
    });
    pacman.mouth = (pacman.mouth + 1) % 20;
  };
  const render = () => {
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, c.width, c.height);
    pellets.forEach(p => {
      ctx.fillStyle = "#ffaa00";
      ctx.fillRect(p.x * 20 + 8, p.y * 20 + 8, 4, 4);
    });
    ghosts.forEach(g => {
      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(g.x * 20 + 10, g.y * 20 + 10, 8, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();
    const mouthOpen = Math.abs(pacman.mouth - 10) / 10;
    ctx.arc(pacman.x * 20 + 10, pacman.y * 20 + 10, 8, mouthOpen, Math.PI*2 - mouthOpen);
    ctx.lineTo(pacman.x * 20 + 10, pacman.y * 20 + 10);
    ctx.fill();
    ctx.fillStyle = "#ffff00";
    ctx.font = "14px Arial";
    ctx.fillText(`Score: ${score}`, 5, c.height - 5);
  };
  const interval = setInterval(() => { tick(); render(); }, 100);
  return () => clearInterval(interval);
}

function gameSpaceInvaders(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Space Invaders</h3><canvas id="si" width="480" height="400" style="max-width:100%;background:#000;border-radius:8px;display:block;margin:0 auto"></canvas><p id="siOut">Arrow Keys to move, SPACE to shoot</p></div>`;
  const c = root.querySelector("#si");
  const ctx = c.getContext("2d");
  let player = {x: 240, y: 360, w: 30, h: 20};
  const enemies = Array(6).fill().map((_, i) => ({x: 50 + i * 70, y: 30, w: 30, h: 20}));
  const bullets = [];
  let score = 0;
  let keys = {};
  activeGameKeydownHandler = (e) => {
    keys[e.key] = true;
    if(e.key === " ") bullets.push({x: player.x + 15, y: player.y, w: 4, h: 10});
  };
  activeGameKeyupHandler = (e) => { keys[e.key] = false; };
  const tick = () => {
    if(keys["ArrowLeft"]) player.x = Math.max(0, player.x - 8);
    if(keys["ArrowRight"]) player.x = Math.min(450, player.x + 8);
    for(let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= 6;
      if(bullets[i].y < 0) bullets.splice(i, 1);
    }
    enemies.forEach(e => { e.x += 2; if(e.x > 450) e.x = -30; });
    for(let i = enemies.length - 1; i >= 0; i--) {
      bullets.forEach(b => {
        if(b.x < enemies[i].x + 30 && b.x + 4 > enemies[i].x && b.y < enemies[i].y + 20 && b.y + 10 > enemies[i].y) {
          enemies.splice(i, 1);
          score += 50;
        }
      });
    }
  };
  const render = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    enemies.forEach(e => {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(e.x, e.y, e.w, e.h);
    });
    bullets.forEach(b => {
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });
    ctx.fillStyle = "#0f0";
    ctx.font = "14px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
  };
  const interval = setInterval(() => { tick(); render(); }, 30);
  return () => clearInterval(interval);
}

function gameHangman(root) {
  const words = ["JAVASCRIPT", "PROGRAMMING", "COMPUTER", "INTERNET", "DATABASE", "FUNCTION", "VARIABLE", "ALGORITHM", "NETWORK", "SECURITY"];
  const word = words[Math.floor(Math.random() * words.length)];
  const guessed = new Set();
  let wrong = 0;
  root.innerHTML = `<div style="padding:12px;text-align:center"><h3>Hangman</h3><p id="hgWord" style="font-size:32px;letter-spacing:10px;font-family:monospace"></p><p id="hgWrong">Wrong: 0/6</p><div id="hgLetters" style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:15px 0"></div></div>`;
  const wordEl = root.querySelector("#hgWord");
  const wrongEl = root.querySelector("#hgWrong");
  const lettersEl = root.querySelector("#hgLetters");
  const render = () => {
    wordEl.textContent = word.split("").map(c => guessed.has(c) ? c : "_").join(" ");
    wrongEl.textContent = `Wrong: ${wrong}/6`;
    lettersEl.innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => `<button data-letter="${l}" style="padding:5px 8px;cursor:pointer;opacity:${guessed.has(l)?0.3:1}">${l}</button>`).join("");
    lettersEl.querySelectorAll("button").forEach(b => {
      b.disabled = guessed.has(b.dataset.letter);
      b.onclick = () => {
        guessed.add(b.dataset.letter);
        if(!word.includes(b.dataset.letter)) wrong++;
        render();
      };
    });
  };
  render();
  return () => {};
}

function gameAsteroids(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Asteroids</h3><canvas id="ast" width="480" height="400" style="max-width:100%;background:#000;border-radius:8px;display:block;margin:0 auto"></canvas><p id="astOut">Arrow Keys to move, SPACE to shoot</p></div>`;
  const c = root.querySelector("#ast");
  const ctx = c.getContext("2d");
  let ship = {x: 240, y: 200, a: 0, r: 10};
  let vel = {x: 0, y: 0};
  const asteroids = Array(5).fill().map(() => ({x: Math.random() * 480, y: Math.random() * 400, vx: (Math.random()-0.5)*3, vy: (Math.random()-0.5)*3, r: 20}));
  const bullets = [];
  let score = 0;
  let keys = {};
  activeGameKeydownHandler = (e) => {
    keys[e.key] = true;
    if(e.key === " ") bullets.push({x: ship.x, y: ship.y, vx: Math.cos(ship.a)*5, vy: Math.sin(ship.a)*5});
  };
  activeGameKeyupHandler = (e) => { keys[e.key] = false; };
  const tick = () => {
    if(keys["ArrowLeft"]) ship.a -= 0.2;
    if(keys["ArrowRight"]) ship.a += 0.2;
    if(keys["ArrowUp"]) vel.x += Math.cos(ship.a)*0.3, vel.y += Math.sin(ship.a)*0.3;
    vel.x *= 0.99; vel.y *= 0.99;
    ship.x += vel.x; ship.y += vel.y;
    ship.x = (ship.x + c.width) % c.width;
    ship.y = (ship.y + c.height) % c.height;
    bullets.forEach((b, i) => {
      b.x += b.vx; b.y += b.vy;
      if(b.x < 0 || b.x > 480 || b.y < 0 || b.y > 400) bullets.splice(i, 1);
    });
    asteroids.forEach(a => {
      a.x += a.vx; a.y += a.vy;
      a.x = (a.x + c.width) % c.width;
      a.y = (a.y + c.height) % c.height;
    });
  };
  const render = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.a);
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    ctx.lineTo(10, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    asteroids.forEach(a => {
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
      ctx.stroke();
    });
    bullets.forEach(b => {
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(b.x-1, b.y-1, 2, 2);
    });
    ctx.fillStyle = "#0f0";
    ctx.font = "14px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
  };
  const interval = setInterval(() => { tick(); render(); }, 30);
  return () => clearInterval(interval);
}

function gameCheckers(root) {
  root.innerHTML = `<div style="padding:12px"><h3>Checkers</h3><div id="checkersBoard" style="display:inline-block;background:#000;padding:0"></div><p id="checkersInfo">Click pieces to select, then click destination</p></div>`;
  const board = root.querySelector("#checkersBoard");
  let selected = null;
  const state = Array(8).fill().map((_, y) => Array(8).fill().map((_, x) => {
    if((x+y) % 2 === 0) return 0;
    if(y < 3) return 1;
    if(y > 4) return -1;
    return 0;
  }));
  const render = () => {
    let html = `<div style="display:grid;grid-template-columns:repeat(8,50px);gap:0">`;
    for(let y = 0; y < 8; y++) {
      for(let x = 0; x < 8; x++) {
        const cell = state[y][x];
        const color = (x+y)%2===0 ? "#fff" : "#333";
        const piece = cell===0 ? "" : `<div style="width:40px;height:40px;border-radius:50%;background:${cell>0?"#f00":"#000"};margin:5px;border:2px solid ${selected===`${x},${y}`?"#ff0":"#999"}"></div>`;
        html += `<div data-pos="${x},${y}" style="width:50px;height:50px;background:${color};display:flex;align-items:center;justify-content:center;cursor:pointer">${piece}</div>`;
      }
    }
    html += `</div>`;
    board.innerHTML = html;
    board.querySelectorAll("[data-pos]").forEach(el => {
      el.addEventListener("click", () => {
        const pos = el.dataset.pos;
        if(selected === pos) selected = null;
        else if(selected) {
          const [fx,fy] = selected.split(",").map(Number);
          const [tx,ty] = pos.split(",").map(Number);
          if((tx+ty)%2===1 && state[ty][tx]===0 && Math.abs(tx-fx)===1 && Math.abs(ty-fy)===1) {
            state[ty][tx] = state[fy][fx];
            state[fy][fx] = 0;
            selected = null;
          }
        } else if(state[parseInt(pos.split(",")[1])][parseInt(pos.split(",")[0])]!==0) {
          selected = pos;
        }
        render();
      });
    });
  };
  render();
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
  else if (state.view === "achievements") renderAchievements();
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
