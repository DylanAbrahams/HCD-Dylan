let selectedProducts = [];

const feedbackEl = document.getElementById("feedback");

// 👉 Standaard tekst bij laden pagina
feedbackEl.textContent = "Kies één of meerdere producten om te beginnen.";

// Product kiezen (toggle systeem)
document.querySelectorAll('[data-product]').forEach(button => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;

    if (selectedProducts.includes(product)) {
      // verwijderen
      selectedProducts = selectedProducts.filter(p => p !== product);
      button.classList.remove("selected");
    } else {
      // toevoegen
      selectedProducts.push(product);
      button.classList.add("selected");
    }

    updateFeedback();
  });
});

// Feedback updaten
function updateFeedback() {
  if (selectedProducts.length === 0) {
    feedbackEl.textContent = "Kies één of meerdere producten om te beginnen.";
    return;
  }

  feedbackEl.textContent = `Gekozen: ${selectedProducts.join(", ")}`;
}

// Start navigatie
document.getElementById('startRoute').addEventListener('click', () => {

  if (selectedProducts.length === 0) {
    feedbackEl.textContent = "Kies eerst minstens één product voordat je verder gaat.";
    return;
  }

  feedbackEl.textContent =
    `Navigatie gestart naar: ${selectedProducts.join(", ")}`;

  localStorage.setItem(
    "selectedProducts",
    JSON.stringify(selectedProducts)
  );

  setTimeout(() => {
    window.location.href = "navigatie.html";
  }, 800);
});