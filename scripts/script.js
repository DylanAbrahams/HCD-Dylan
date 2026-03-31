const routeList = document.getElementById("routeList");
const gridDiv = document.getElementById("grid");

let gridSize = 6;
let currentPosition = { x: 0, y: 0 };
let targetPosition = null; // gekozen product

const products = {
  melk: { x: 2, y: 5 },
  brood: { x: 1, y: 2 },
  cola: { x: 4, y: 3 }
};

// Maak grid
let grid = [];
function createGrid() {
  gridDiv.innerHTML = '';
  grid = [];
  for (let y = gridSize - 1; y >= 0; y--) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      gridDiv.appendChild(cell);
      grid.push({ x, y, el: cell });
    }
  }
}
createGrid();

// Update grid: speler en producten
function updateGrid() {
  grid.forEach(c => c.el.className = 'cell');
  const playerCell = grid.find(c => c.x === currentPosition.x && c.y === currentPosition.y);
  if (playerCell) playerCell.el.classList.add('player');
  for (let p in products) {
    const prodCell = grid.find(c => c.x === products[p].x && c.y === products[p].y);
    if (prodCell) prodCell.el.classList.add('product');
  }
}

// Selecteer product
function selectProduct(product) {
  targetPosition = { ...products[product] };
  updateRouteList();
  updateGrid();
}

// Bereken verschil in stappen
function calculateSteps() {
  if (!targetPosition) return null;
  let steps = [];

  const dy = targetPosition.y - currentPosition.y;
  if (dy > 0) steps.push({ text: "vooruit", count: dy });
  if (dy < 0) steps.push({ text: "achteruit", count: Math.abs(dy) });

  const dx = targetPosition.x - currentPosition.x;
  if (dx > 0) steps.push({ text: "naar rechts", count: dx });
  if (dx < 0) steps.push({ text: "naar links", count: Math.abs(dx) });

  return steps;
}

function updateRouteList() {
  if (!targetPosition) {
    routeList.innerHTML = "<li>Kies eerst een product</li>";
    return;
  }

  const steps = calculateSteps();

  if (steps.length === 0) {
    routeList.innerHTML = "<li>Je bent aangekomen bij je product!</li>";
  } else {
    // Combineer alle stappen in één zin
    const tekst = steps.map(s => `${s.count} ${s.count === 1 ? "stap" : "stappen"} ${s.text}`).join(", ");
    routeList.innerHTML = `<li>${tekst}</li>`;
  }
}

// Vrij bewegen
function move(direction) {
  switch (direction) {
    case 'up': if(currentPosition.y < gridSize-1) currentPosition.y += 1; break;
    case 'down': if(currentPosition.y > 0) currentPosition.y -= 1; break;
    case 'left': if(currentPosition.x > 0) currentPosition.x -= 1; break;
    case 'right': if(currentPosition.x < gridSize-1) currentPosition.x += 1; break;
  }
  updateRouteList();
  updateGrid();
}

// Locatie knop
function showLocation() {
  const rij = currentPosition.y + 1;    // tellen vanaf 1
  const kolom = currentPosition.x + 1;  // tellen vanaf 1

  const statusEl = document.getElementById("status");
  statusEl.textContent = `Je staat in rij ${rij}, kolom ${kolom}`;
}

// Init
updateGrid();
updateRouteList();