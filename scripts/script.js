const routeEl = document.getElementById("route");
const gridDiv = document.getElementById("grid");

let gridSize = 8;
let currentPosition = { x: 0, y: 0 };
let gameFinished = false;

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

// ---------------- CHECKOUT ----------------

const checkout = { x: 7, y: 0 };
let goingToCheckout = false;

// ---------------- QUEUE ----------------

// Er wordt veel .shift gebruikt. Hiermee ga je naar het volgende product in de array
// Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift

// Hier is ChatGPT voor gebruikt om items uit localstorage te halen
// Prompt: "Ik wil dat de producten op pagina A worden overgezet naar pagina B door deze in localStorage op te slaan."


let productQueue;

try {
  productQueue = JSON.parse(localStorage.getItem("selectedProducts"));
} catch {
  productQueue = null;
}

if (!Array.isArray(productQueue) || productQueue.length === 0) {
  window.location.href = "index.html";
}

let currentProduct = productQueue.shift();

if (!products[currentProduct]) {
  currentProduct = productQueue.shift();
}

let targetPosition = products[currentProduct];

document.getElementById("currentProduct").textContent =
  `Navigatie naar: ${currentProduct}`;

// ---------------- NEXT PRODUCT ----------------

function nextProduct() {
  if (productQueue.length === 0) {
    goingToCheckout = true;
    targetPosition = checkout;

    document.getElementById("currentProduct").textContent =
      "Ga naar de kassa";

    updateGrid();
    updateRoute();
    return;
  }

  currentProduct = productQueue.shift();

  if (!products[currentProduct]) {
    nextProduct();
    return;
  }

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

  productQueue.push(currentProduct);

  currentProduct = productQueue.shift();
  targetPosition = products[currentProduct];

  document.getElementById("currentProduct").textContent =
    `Navigatie naar: ${currentProduct}`;

  updateGrid();
  updateRoute();
}

function deleteProduct() {
  if (productQueue.length === 0) {
    goingToCheckout = true;
    targetPosition = checkout;

    document.getElementById("currentProduct").textContent =
      "Ga naar de kassa";

    updateGrid();
    updateRoute();
    return;
  }

  currentProduct = productQueue.shift();

  if (!products[currentProduct]) {
    deleteProduct();
    return;
  }

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

  const player = grid.find(
    c => c.x === currentPosition.x && c.y === currentPosition.y
  );
  if (player) player.el.classList.add("player");

  const targetCell = grid.find(
    c => c.x === targetPosition.x && c.y === targetPosition.y
  );

  if (targetCell) targetCell.el.classList.add("product");
}

// ---------------- ROUTE ----------------

function getRoute() {
  const dx = targetPosition.x - currentPosition.x;
  const dy = targetPosition.y - currentPosition.y;

  const parts = [];

  // Deze code is geschreven door ChatGPT, het komt neer op bepalen waar je staat op een grid.
  // Prompt: "Ik wil een tekst waarin staat hoeveel stappen ik vooruit/achteruit en links/rechts moet zetten om bij het product te komen"

  if (dx > 0) parts.push(`${dx} stap${dx === 1 ? "" : "pen"} naar rechts`);
  if (dx < 0) parts.push(`${Math.abs(dx)} stap${Math.abs(dx) === 1 ? "" : "pen"} naar links`);

  if (dy > 0) parts.push(`${dy} stap${dy === 1 ? "" : "pen"} vooruit`);
  if (dy < 0) parts.push(`${Math.abs(dy)} stap${Math.abs(dy) === 1 ? "" : "pen"} achteruit`);

  if (!parts.length) {
    return goingToCheckout
      ? "Je bent bij de kassa"
      : `Je bent aangekomen bij ${currentProduct}`;
  }

  return `Route naar ${goingToCheckout ? "de kassa" : currentProduct}: ${parts.join(", ")}`;
}

function updateRoute() {
  routeEl.textContent = getRoute();
}

// ---------------- KASSA CHECK ----------------

function checkArrival() {
  if (
    currentPosition.x === targetPosition.x &&
    currentPosition.y === targetPosition.y
  ) {
    if (goingToCheckout) {
      routeEl.textContent = "Je hebt afgerekend! Klaar met winkelen.";
      document.getElementById("currentProduct").textContent = "Voltooid";
      gameFinished = true;
      return;
    }

    routeEl.textContent = `${currentProduct} gevonden`;

    const audio = new Audio("audio/Audio_Scan.m4a");
    audio.play().catch(() => { });

    setTimeout(() => {
      nextProduct();
    }, 1000);
  }
}

// ---------------- MOVEMENT ----------------

function move(direction) {
  if (gameFinished) return;

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
  if (gameFinished) return;

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
    case "v":
      e.preventDefault();
      deleteProduct();
      break;
  }
});

// ---------------- BUTTONS ----------------

document.querySelectorAll("[data-move]").forEach(btn => {
  btn.addEventListener("click", () => {
    move(btn.dataset.move);
  });
});

document
  .getElementById("skipProductBtn")
  .addEventListener("click", skipProduct);

document
  .getElementById("showLocationBtn")
  .addEventListener("click", showLocation);

document
  .getElementById("deleteProductBtn")
  .addEventListener("click", deleteProduct);

// ---------------- LOCATION ----------------

function showLocation() {
  if (gameFinished) return;

  const rij = currentPosition.y + 1;
  const kolom = currentPosition.x + 1;

  routeEl.textContent =
    `Je staat in rij ${rij}, kolom ${kolom}. ${getRoute()}`;
}

// ---------------- INIT ----------------

createGrid();
updateGrid();
updateRoute();