// Parse roll type from the URL
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const rollType = params.get("roll");
const path = window.location.pathname;

// Check if we're on the detail
if (rollType) {
  // This code only runs on the detail page bcs index is hardcoded
  // Get roll data from rollsData and update DOM elmts
  const rollData = rolls[rollType];
  document.querySelector(
    ".overview h1"
  ).textContent = `${rollType} Cinnamon Roll`;
  document.querySelector(
    ".product-image-details"
  ).src = `../assets/products/${rollData.imageFile}`;
  document.getElementById(
    "product-price"
  ).textContent = `$${rollData.basePrice.toFixed(2)}`;

  // Function to compute and update the final price
  function updatePrice(
    glazingPriceChange = null,
    packSizeMultiplierChange = null
  ) {
    const glazingSelect = document.getElementById("glazing");
    const packSizeSelect = document.getElementById("pack-size");
    const priceDisplayed = document.getElementById("product-price");

    // Get the current selected values if not passed in
    const glazingPrice =
      glazingPriceChange !== null
        ? glazingPriceChange
        : parseFloat(glazingSelect.value);
    const packSizeMultiplier =
      packSizeMultiplierChange !== null
        ? packSizeMultiplierChange
        : parseFloat(packSizeSelect.value);

    // Compute final price using the roll's base price
    const finalPrice = (rollData.basePrice + glazingPrice) * packSizeMultiplier;

    // Update the price display
    priceDisplayed.textContent = `$${finalPrice.toFixed(2)}`;
  }

  // Function triggered when glazing option is changed
  function glazingChange(element) {
    const glazingPrice = parseFloat(element.value);
    updatePrice(glazingPrice, null);
  }

  // Function triggered when pack size option is changed
  function packSizeChange(element) {
    const packSizeMultiplier = parseFloat(element.value);
    updatePrice(null, packSizeMultiplier);
  }
}

// Populate the dropdowns dynamically
function populateDropdowns() {
  const glazingSelect = document.getElementById("glazing");
  const packSizeSelect = document.getElementById("pack-size");

  // Populate glazing options
  for (const glazing in glazingOptions) {
    const opt = document.createElement("option");
    opt.value = glazingOptions[glazing]; // Set the price as value
    opt.textContent = glazing; // Set the name as text
    glazingSelect.appendChild(opt);
  }

  // Populate pack size options
  for (const size in packSizeOptions) {
    const opt = document.createElement("option");
    opt.value = packSizeOptions[size]; // Set the multiplier as value
    opt.textContent = size; // Set the size as text
    packSizeSelect.appendChild(opt);
  }
}
/*
For hw3 and hw4 I had an array of objects, 
here I changed it to an object for easier value retrieval later
*/
const glazingOptions = {
  "Keep Original": 0.0,
  "Sugar Milk": 0.0,
  "Vanilla Milk": 0.5,
  "Double Chocolate": 1.5,
};

const packSizeOptions = {
  1: 1,
  3: 3,
  6: 5,
  12: 10,
};

const basePrice = {
  "Keep Original": 2.49,
  "Sugar Milk": 3.49,
  "Vanilla Milk": 0.5,
  "Double Chocolate": 1.5,
};

// Define the Roll class to store cart items
class Roll {
  constructor(rollType, rollGlazing, packSize, basePrice) {
    this.type = rollType;
    this.glazing = rollGlazing;
    this.size = packSize;
    this.basePrice = basePrice;
  }
}

// Add to Cart function to store the selected roll in the cart array
function addToCart() {
  const glazing =
    document.getElementById("glazing").options[
      document.getElementById("glazing").selectedIndex
    ].text;
  const packSize =
    document.getElementById("pack-size").options[
      document.getElementById("pack-size").selectedIndex
    ].text;
  const price = parseFloat(
    document.getElementById("product-price").textContent.slice(1)
  );

  // Create a new Roll instance with the current selections
  const roll = new Roll(rollType, glazing, packSize, price);

  // Add the roll to the cart array
  cart.push(roll);

  // Log the cart contents to the console (for debugging purposes)
  console.log(cart);
}

// This function is strictly for calculating a single item's price given a roll for hw5.
function computeCartItemPrice(type, glazing, size) {
  const basePrice = rolls[type].basePrice;
  const glazingPrice = glazingOptions[glazing]; // get the price change for glazing
  const sizeMultiplier = packSizeOptions[size]; // get the multiplier for the pack size

  return (basePrice + glazingPrice) * sizeMultiplier;
}

// Create an empty cart array to store the added items
const cart = [];

// Creating 4 new hardcoded roll objects and push to cart
const original = new Roll("Original", "Sugar Milk", 1, 2.49);
const walnut = new Roll("Walnut", "Vanilla Milk", 12, 39.9);
const raisin = new Roll("Raisin", "Sugar Milk", 3, 8.97);
const apple = new Roll("Apple", "Original", 3, 10.47);

cart.push(original, walnut, raisin, apple);

// Takes in one roll to display it using a template
function displayCartItem(roll) {
  const cartContainer = document.getElementById("cart-container");
  const template = document.getElementById("cart-item-template");

  // Clone the template content
  const clone = document.importNode(template.content, true);

  // Fill in roll data
  const img = clone.querySelector(".cart-image");
  img.src = `../assets/products/${roll.type.toLowerCase()}-cinnamon-roll.jpg`;
  img.alt = `${roll.type} Cinnamon Roll`;

  const itemName = clone.querySelector(".cart-item-name");
  itemName.textContent = `${roll.type} Cinnamon Roll`;

  const glazing = clone.querySelector(".cart-item-glazing");
  glazing.textContent = `Glazing: ${roll.glazing}`;

  const size = clone.querySelector(".cart-item-size");
  size.textContent = `Pack Size: ${roll.size}`;

  const price = clone.querySelector(".cart-item-price");
  price.textContent = `$${roll.basePrice.toFixed(2)}`;

  // Add remove btn
  const removeBtn = clone.querySelector(".cart-item-remove");
  removeBtn.onclick = () => {
    removeCartItem(roll);
  };

  // Add clone to container
  cartContainer.appendChild(clone);
}

// Function to remove a roll from the cart and update the display
function removeCartItem(roll) {
  const index = cart.indexOf(roll);
  //if roll is found
  if (index !== -1) {
    cart.splice(index, 1); // remove roll from cart arr
    displayCartItems();
  }
}

// Display all rolls in the cart using displayCartItem(roll)
function displayCartItems() {
  const cartContainer = document.getElementById("cart-container");

  // Clear container before adding
  cartContainer.innerHTML = "";

  // Loop thru cart array to display each roll
  cart.forEach((roll) => {
    displayCartItem(roll);
  });

  updateTotalPrice();
}

// Function to update total price of cart
function updateTotalPrice() {
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;
  cart.forEach((roll) => {
    totalPrice += roll.basePrice;
  });
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

window.onload = () => {
  // This is from hw4, only running on detail page
  if (path.includes("detail.html")) {
    populateDropdowns();
    updatePrice();

    //to prevent flashing of default content, set visible only after loaded
    document.querySelector(".product-content").style.visibility = "visible";
  }

  // Only running this on the cart page
  if (path.includes("cart.html")) {
    displayCartItems();
  }
};
