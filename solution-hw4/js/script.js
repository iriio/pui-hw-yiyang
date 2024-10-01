// Parse roll type
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const rollType = params.get("roll");

// Check if we're on the detail
if (rollType) {
  // This code only runs on the detail page bcs index is hardcoded
  // Get roll data from rollsData and update the DOM elements
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

  // Glazing and pack size options
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

  // Populate the dropdowns dynamically
  function populateDropdowns() {
    const glazingSelect = document.getElementById("glazing");
    const packSizeSelect = document.getElementById("pack-size");

    // Populate glazing options
    glazingOptions.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.price;
      opt.textContent = option.name;
      glazingSelect.appendChild(opt);
    });

    // Populate pack size options
    packSizeOptions.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.priceMultiplier;
      opt.textContent = option.size;
      packSizeSelect.appendChild(opt);
    });
  }

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

  // Define the Roll class to store cart items
  class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
      this.type = rollType;
      this.glazing = rollGlazing;
      this.size = packSize;
      this.basePrice = basePrice;
    }
  }

  // create an empty cart array to store the added items
  const cart = [];

  // cart function to store the selected roll in the cart array
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

    // Log the cart contents to the console (for debuggging)
    console.log(cart);
  }

  // Initialize the dropdowns and set the default price when the page loads
  window.onload = () => {
    populateDropdowns(); // Populate glazing and pack size options
    updatePrice(); // Set the initial price based on the default selections

    //to prevent flashing of default content, set visible only after loaded
    document.querySelector(".product-content").style.visibility = "visible";
  };
}
