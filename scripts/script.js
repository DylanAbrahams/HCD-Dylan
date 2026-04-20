const routeEl = document.getElementById("route");
const gridDiv = document.getElementById("grid");

let gridSize = 6;
let currentPosition = { x: 0, y: 0 };

// producten
const products = {
  melk: { x: 2, y: 5 },
  brood: { x: 1, y: 2 },
  cola: { x: 4, y: 3 }
};

// ---------------- PRODUCT ----------------

const selectedProduct = localStorage.getItem("selectedProduct");

if (!selectedProduct) {
  window.location.href = "index.html";
}

const targetPosition = products[selectedProduct];

document.getElementById("currentProduct").textContent =
  `Navigatie naar: ${selectedProduct}`;

// ---------------- GRID ----------------

let grid = [];

function createGrid() {
  gridDiv.innerHTML = "";
  grid = [];

  for (let y = gridSize - 1; y >= 0; y--) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      gridDiv.appendChild(cell);
      grid.push({ x, y, el: cell });
    }
  }
}

function updateGrid() {
  grid.forEach(c => (c.el.className = "cell"));

  const player = grid.find(
    c => c.x === currentPosition.x && c.y === currentPosition.y
  );
  if (player) player.el.classList.add("player");

  const productCell = grid.find(
    c => c.x === targetPosition.x && c.y === targetPosition.y
  );
  if (productCell) productCell.el.classList.add("product");
}

// ---------------- ROUTE ----------------

function getRoute() {
  const dx = targetPosition.x - currentPosition.x;
  const dy = targetPosition.y - currentPosition.y;

  const parts = [];

  if (dx > 0) parts.push(`${dx} stap${dx === 1 ? "" : "pen"} naar rechts`);
  if (dx < 0) parts.push(`${Math.abs(dx)} stap${Math.abs(dx) === 1 ? "" : "pen"} naar links`);

  if (dy > 0) parts.push(`${dy} stap${dy === 1 ? "" : "pen"} vooruit`);
  if (dy < 0) parts.push(`${Math.abs(dy)} stap${Math.abs(dy) === 1 ? "" : "pen"} achteruit`);

  if (parts.length === 0) {
    return `Je bent aangekomen bij ${selectedProduct}`;
  }

  return `Route: ${parts.join(", ")}`;
}

function updateRoute() {
  routeEl.textContent = getRoute();
}

// ---------------- BEWEGEN ----------------

function move(direction) {
  switch (direction) {
    case "up":
      if (currentPosition.y < gridSize - 1) currentPosition.y++;
      break;
    case "down":
      if (currentPosition.y > 0) currentPosition.y--;
      break;
    case "left":
      if (currentPosition.x > 0) currentPosition.x--;
      break;
    case "right":
      if (currentPosition.x < gridSize - 1) currentPosition.x++;
      break;
  }

  updateGrid();
  updateRoute();
}

// ---------------- KEYBOARD (ALT + SHIFT + ARROWS) ----------------

document.addEventListener("keydown", (e) => {
  // Alleen reageren als ALT + SHIFT ingedrukt zijn
  if (!(e.altKey && e.shiftKey)) return;

  switch (e.key) {
    case "ArrowUp":
      e.preventDefault();
      move("up");
      break;

    case "ArrowDown":
      e.preventDefault();
      move("down");
      break;

    case "ArrowLeft":
      e.preventDefault();
      move("left");
      break;

    case "ArrowRight":
      e.preventDefault();
      move("right");
      break;

    case "l":
    case "L": // voor de zekerheid (Shift kan hoofdletter maken)
      e.preventDefault();
      showLocation();
      break;
  }
});

// ---------------- LOOPKNOPPEN (FIX) ----------------

document.querySelectorAll("[data-move]").forEach(btn => {
  btn.addEventListener("click", () => {
    move(btn.dataset.move);
  });
});

// ---------------- LOCATIE KNOP ----------------

document
  .getElementById("showLocationBtn")
  .addEventListener("click", showLocation);

function showLocation() {
  const rij = currentPosition.y + 1;
  const kolom = currentPosition.x + 1;

  const dx = targetPosition.x - currentPosition.x;
  const dy = targetPosition.y - currentPosition.y;

  const parts = [];

  if (dx > 0) parts.push(`${dx} stap${dx === 1 ? "" : "pen"} naar rechts`);
  if (dx < 0) parts.push(`${Math.abs(dx)} stap${Math.abs(dx) === 1 ? "" : "pen"} naar links`);

  if (dy > 0) parts.push(`${dy} stap${dy === 1 ? "" : "pen"} vooruit`);
  if (dy < 0) parts.push(`${Math.abs(dy)} stap${Math.abs(dy) === 1 ? "" : "pen"} achteruit`);

  const route = parts.length
    ? `Nog ${parts.join(", ")} naar ${selectedProduct}`
    : `Je bent aangekomen bij ${selectedProduct}`;

  routeEl.textContent =
    `Je staat in rij ${rij}, kolom ${kolom}. ${route}`;
}

// ---------------- INIT ----------------

createGrid();
updateGrid();
updateRoute();