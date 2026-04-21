const routeEl = document.getElementById("route");
const gridDiv = document.getElementById("grid");

let gridSize = 8;
let currentPosition = { x: 0, y: 0 };

// ---------------- PRODUCTS ----------------

const products = {
  appel: { x: 1, y: 7 },
  banaan: { x: 7, y: 7 },

  melk: { x: 2, y: 5 },
  brood: { x: 3, y: 5 },
  pasta: { x: 5, y: 4 },
  rijst: { x: 6, y: 4 },

  cola: { x: 1, y: 2 },
  water: { x: 7, y: 2 },

  chips: { x: 4, y: 1 }
};

// ---------------- QUEUE ----------------

let productQueue = JSON.parse(
  localStorage.getItem("selectedProducts")
);

if (!productQueue || productQueue.length === 0) {
  window.location.href = "index.html";
}

let currentProduct = productQueue.shift();
let targetPosition = products[currentProduct];

document.getElementById("currentProduct").textContent =
  `Navigatie naar: ${currentProduct}`;

// ---------------- NEXT PRODUCT ----------------

function nextProduct() {
  if (productQueue.length === 0) {
    routeEl.textContent = "Alle producten gevonden";
    return;
  }

  currentProduct = productQueue.shift();
  targetPosition = products[currentProduct];

  document.getElementById("currentProduct").textContent =
    `Navigatie naar: ${currentProduct}`;

  updateGrid();
  updateRoute();
}

// ---------------- SKIP PRODUCT ----------------

function skipProduct() {
  if (productQueue.length === 0) {
    routeEl.textContent = "Geen producten meer om te skippen";
    return;
  }

  // huidig product naar achteren zetten
  productQueue.push(currentProduct);

  // volgende pakken
  currentProduct = productQueue.shift();
  targetPosition = products[currentProduct];

  document.getElementById("currentProduct").textContent =
    `Navigatie naar: ${currentProduct}`;

  updateGrid();
  updateRoute();
}

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
  grid.forEach(c => {
    c.el.className = "cell";
  });

  // player
  const player = grid.find(
    c => c.x === currentPosition.x && c.y === currentPosition.y
  );
  if (player) player.el.classList.add("player");

  // current product
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

  return parts.length
    ? `Route naar ${currentProduct}: ${parts.join(", ")}`
    : `Je bent aangekomen bij ${currentProduct}`;
}

function updateRoute() {
  routeEl.textContent = getRoute();
}

// ---------------- ARRIVAL CHECK ----------------

function checkArrival() {
  if (
    currentPosition.x === targetPosition.x &&
    currentPosition.y === targetPosition.y
  ) {
    routeEl.textContent = `${currentProduct} gevonden`;

    const audio = new Audio("audio/Audio_Scan.m4a");
    audio.play();

    setTimeout(() => {
      nextProduct();
    }, 1000);
  }
}

// ---------------- MOVEMENT ----------------

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
  checkArrival();
}

// ---------------- KEYBOARD ----------------

document.addEventListener("keydown", (e) => {
  if (!(e.altKey && e.shiftKey)) return;

  const key = e.key.toLowerCase();

  switch (key) {
    case "arrowup":
      e.preventDefault();
      move("up");
      break;

    case "arrowdown":
      e.preventDefault();
      move("down");
      break;

    case "arrowleft":
      e.preventDefault();
      move("left");
      break;

    case "arrowright":
      e.preventDefault();
      move("right");
      break;

    case "l":
      e.preventDefault();
      showLocation();
      break;

    case "s":
      e.preventDefault();
      skipProduct();
      break;
  }
});

// ---------------- BUTTONS ----------------

document.querySelectorAll("[data-move]").forEach(btn => {
  btn.addEventListener("click", () => {
    move(btn.dataset.move);
  });
});

// SKIP BUTTON (JOUW HTML FIX)
document
  .getElementById("skipProductBtn")
  .addEventListener("click", skipProduct);

// ---------------- LOCATION ----------------

document
  .getElementById("showLocationBtn")
  .addEventListener("click", showLocation);

function showLocation() {
  const rij = currentPosition.y + 1;
  const kolom = currentPosition.x + 1;

  routeEl.textContent =
    `Je staat in rij ${rij}, kolom ${kolom}. ${getRoute()}`;
}

// ---------------- INIT ----------------

createGrid();
updateGrid();
updateRoute();