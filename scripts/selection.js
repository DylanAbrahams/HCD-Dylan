let selectedProducts = [];

const selectedList = document.getElementById("selectedList");
const liveStatus = document.getElementById("liveStatus");

// Product toggles
document.querySelectorAll('[data-product]').forEach(button => {
  button.addEventListener('click', () => {

    const product = button.dataset.product;

    if (selectedProducts.includes(product)) {
      selectedProducts = selectedProducts.filter(p => p !== product);
      button.classList.remove("selected");

      liveStatus.textContent = `${product} verwijderd`;
    } else {
      selectedProducts.push(product);
      button.classList.add("selected");

      liveStatus.textContent = `${product} toegevoegd`;
    }

    updateList();
  });
});

// Visuele lijst updaten
function updateList() {
  if (selectedProducts.length === 0) {
    selectedList.textContent = "Nog geen producten gekozen.";
    return;
  }

  selectedList.textContent = selectedProducts.join(", ");
}

// Start navigatie
document.getElementById("startRoute").addEventListener("click", () => {

  if (selectedProducts.length === 0) {
    liveStatus.textContent = "Geen producten geselecteerd";
    return;
  }

  const message =
    `Navigatie gestart naar: ${selectedProducts.join(", ")}`;

  // reset + trigger ARIA opnieuw
  liveStatus.textContent = "";
  setTimeout(() => {
    liveStatus.textContent = message;
  }, 50);

  // opslaan selectie
  localStorage.setItem(
    "selectedProducts",
    JSON.stringify(selectedProducts)
  );

  // genoeg tijd voor volledige speech
  setTimeout(() => {
    window.location.href = "navigatie.html";
  }, 2500);
});