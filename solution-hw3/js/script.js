// base price
const basePrice = 2.49;

// create objects for glazing and pack size options
const glazingOptions = [
  { name: "Keep Original", price: 0.0 },
  { name: "Sugar Milk", price: 0.0 },
  { name: "Vanilla Milk", price: 0.5 },
  { name: "Double Chocolate", price: 1.5 },
];

const packSizeOptions = [
  { size: 1, priceMultiplier: 1 },
  { size: 3, priceMultiplier: 3 },
  { size: 6, priceMultiplier: 5 },
  { size: 12, priceMultiplier: 10 },
];

// populate the dropdowns dynamically
function populateDropdowns() {
  const glazingSelect = document.getElementById("glazing");
  const packSizeSelect = document.getElementById("pack-size");

  // Populate glazing options with foreach loop
  glazingOptions.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.price;
    opt.textContent = option.name;
    glazingSelect.appendChild(opt);
  });

  // similarly, populate pack size options with foreach loop
  packSizeOptions.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.priceMultiplier;
    opt.textContent = option.size;
    packSizeSelect.appendChild(opt);
  });
}

// function triggered when glazing option is changed
function glazingChange(element) {
  const glazingPrice = parseFloat(element.value);
  updatePrice(glazingPrice, null);
}

// function triggered when pack size option is changed
function packSizeChange(element) {
  const packSizeMultiplier = parseFloat(element.value);
  updatePrice(null, packSizeMultiplier);
}

// function to compute and update the final price
function updatePrice(
  glazingPriceChange = null,
  packSizeMultiplierChange = null
) {
  const glazingSelect = document.getElementById("glazing");
  const packSizeSelect = document.getElementById("pack-size");
  const priceDisplayed = document.getElementById("product-price");

  // get current selected values if not passed in
  const glazingPrice =
    glazingPriceChange !== null
      ? glazingPriceChange
      : parseFloat(glazingSelect.value);
  const packSizeMultiplier =
    packSizeMultiplierChange !== null
      ? packSizeMultiplierChange
      : parseFloat(packSizeSelect.value);

  // compute final price
  const finalPrice = (basePrice + glazingPrice) * packSizeMultiplier;

  // update the price display
  priceDisplayed.textContent = `$${finalPrice.toFixed(2)}`;
}

// initialize dropdown and set the default price
populateDropdowns();
updatePrice();
