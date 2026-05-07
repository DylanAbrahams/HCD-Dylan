let selectedProducts = [];

const selectedList = document.getElementById("selectedList");
const liveStatus = document.getElementById("liveStatus");

// Producten togglen 
document.querySelectorAll('[data-product]').forEach(button => {
  button.addEventListener('click', () => {

    const product = button.dataset.product;

    // Bron voor includes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
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

  // Opnieuw de tekst lezen voordat je naar de product pagina gaat
  liveStatus.textContent = "";
  setTimeout(() => {
    liveStatus.textContent = message;
  }, 50);

  // Producten opslaan
  localStorage.setItem(
    "selectedProducts",
    JSON.stringify(selectedProducts)
  );

  setTimeout(() => {
    window.location.href = "navigatie.html";
  }, 2500);
});