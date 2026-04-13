let selectedProduct = null;

const feedbackEl = document.getElementById("feedback");

// Product kiezen
document.querySelectorAll('[data-product]').forEach(button => {
  button.addEventListener('click', () => {
    selectedProduct = button.dataset.product;

    const message = `Gekozen: ${selectedProduct}`;

    feedbackEl.textContent = message; // zichtbaar + screenreader
  });
});

// Start navigatie
document.getElementById('startRoute').addEventListener('click', () => {

  if (!selectedProduct) {
    const message = "Kies eerst een product voordat je verder gaat.";

    feedbackEl.textContent = message;
    return;
  }

  const message = `Navigatie gestart naar ${selectedProduct}`;

  feedbackEl.textContent = message;

  localStorage.setItem("selectedProduct", selectedProduct);

  setTimeout(() => {
    window.location.href = "navigatie.html";
  }, 800); // kleine delay zodat screenreader het kan lezen
});