// Parse roll type from the URL
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const rollType = params.get("roll");
const path = window.location.pathname;

// Check if we're on the detail
if (rollType) {
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

  // Event listener for add to cart button
  document
    .getElementById("addToCartBtn")
    .addEventListener("click", function () {
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
      addToCart(roll);
    });
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

// Function to update total price of cart
function updateTotalPrice() {
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;
  cart.forEach((roll) => {
    totalPrice += roll.basePrice;
  });
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

//////////HW6//////////

// Retrieve the cart from local storage
function getCartFromStorage() {
  let cart = localStorage.getItem("cart");
  if (cart === null) {
    cart = [];
  } else {
    cart = JSON.parse(cart);
  }
  return cart;
}

// Save the cart to local storage
function saveCartToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Cart saved to local storage:", cart);
}

// Add roll to cart and update local storage
function addToCart(roll) {
  const cart = getCartFromStorage();
  cart.push(roll);
  saveCartToStorage(cart);
  console.log("Added to cart:", cart);
}

// Cart page, populate items from local storage
function populateCartPage() {
  const cart = getCartFromStorage();
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  const template = document.getElementById("cart-item-template");

  cart.forEach((roll, index) => {
    // Clone template to populate cart
    const clone = document.importNode(template.content, true);

    clone.querySelector(
      ".cart-image"
    ).src = `../assets/products/${roll.type.toLowerCase()}-cinnamon-roll.jpg`;
    clone.querySelector(".cart-image").alt = `${roll.type} Cinnamon Roll`;
    clone.querySelector(
      ".cart-item-name"
    ).textContent = `${roll.type} Cinnamon Roll`;
    clone.querySelector(
      ".cart-item-glazing"
    ).textContent = `Glazing: ${roll.glazing}`;
    clone.querySelector(
      ".cart-item-size"
    ).textContent = `Pack Size: ${roll.size}`;
    clone.querySelector(
      ".cart-item-price"
    ).textContent = `$${roll.basePrice.toFixed(2)}`;

    // Add remove button listener
    const removeBtn = clone.querySelector(".cart-item-remove");
    removeBtn.addEventListener("click", function () {
      removeFromCart(index);
    });

    // Append the clone to the cart container
    cartContainer.appendChild(clone);
  });

  // Update total price
  updateTotalPrice(cart);
}

// Remove roll from cart
function removeFromCart(index) {
  const cart = getCartFromStorage();
  cart.splice(index, 1); // rm selected item
  saveCartToStorage(cart);
  populateCartPage();
}

// Fuction to update total price
function updateTotalPrice() {
  const cart = getCartFromStorage();
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

    // To prevent flashing of default content, set visible only after loaded
    document.querySelector(".product-content").style.visibility = "visible";
  }

  // Only running this on the cart page
  if (path.includes("cart.html")) {
    populateCartPage();
  }
};
