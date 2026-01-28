const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* GRID */
const TILE = 32;
const MAP_W = 30;
const MAP_H = 60;

/* TILE TYPES */
const TILES = {
  grass: 0,
  stone: 1,
  ore: 2,
  tree: 3
};

/* MAP */
let map = [];
for (let y = 0; y < MAP_H; y++) {
  map[y] = [];
  for (let x = 0; x < MAP_W; x++) {
    if (y < 5) map[y][x] = TILES.grass;
    else if (Math.random() < 0.08) map[y][x] = TILES.ore;
    else if (Math.random() < 0.15) map[y][x] = TILES.stone;
    else map[y][x] = TILES.grass;
  }
}

/* PLAYER */
const player = {
  x: 15,
  y: 3
};

/* INVENTORY */
let inventory = {
  grass: 0,
  stone: 0,
  ore: 0
};

let selectedSlot = "stone";

/* INPUT */
let placing = false;

document.getElementById("mineBtn").onclick = () => placing = false;
document.getElementById("placeBtn").onclick = () => placing = true;

/* HOTBAR */
const hotbar = document.getElementById("hotbar");
function updateHotbar() {
  hotbar.innerHTML = "";
  for (let key in inventory) {
    const div = document.createElement("div");
    div.className = "slot" + (key === selectedSlot ? " active" : "");
    div.innerText = key + "\n" + inventory[key];
    div.onclick = () => selectedSlot = key;
    hotbar.appendChild(div);
  }
}
updateHotbar();

/* TOUCH */
canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  const tx = Math.floor((t.clientX + camX) / TILE);
  const ty = Math.floor((t.clientY + camY) / TILE);

  if (!map[ty] || map[ty][tx] == null) return;

  if (!placing) {
    const tile = map[ty][tx];
    if (tile === TILES.stone) inventory.stone++;
    if (tile === TILES.ore) inventory.ore++;
    if (tile === TILES.grass) inventory.grass++;
    map[ty][tx] = TILES.grass;
  } else {
    if (inventory[selectedSlot] > 0 && map[ty][tx] === TILES.grass) {
      map[ty][tx] = TILES[selectedSlot];
      inventory[selectedSlot]--;
    }
  }

  updateHotbar();
});

/* CAMERA */
let camX = 0;
let camY = 0;

/* DRAW TILE */
function drawTile(type, x, y) {
  if (type === TILES.grass) ctx.fillStyle = "#43a047";
  if (type === TILES.stone) ctx.fillStyle = "#9e9e9e";
  if (type === TILES.ore) ctx.fillStyle = "#ffd600";

  ctx.fillRect(x, y, TILE, TILE);
}

/* LOOP */
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camX = player.x * TILE - canvas.width / 2;
  camY = player.y * TILE - canvas.height / 2;

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const sx = x * TILE - camX;
      const sy = y * TILE - camY;
      drawTile(map[y][x], sx, sy);
    }
  }

  // PLAYER
  ctx.fillStyle = "#1e88e5";
  ctx.fillRect(
    player.x * TILE - camX,
    player.y * TILE - camY,
    TILE,
    TILE
  );

  requestAnimationFrame(loop);
}

loop();
