import { shopState } from "./state.js";

// Update currency display
function updateCurrencyDisplay() {
  const currencyMain = document.getElementById("currency-amount-main");
  const currencyShop = document.getElementById("currency-amount-shop");

  if (currencyMain) {
    currencyMain.textContent = shopState.currency;
  }

  if (currencyShop) {
    currencyShop.textContent = shopState.currency;
  }
}

// Update inventory display
export function updateInventoryDisplay() {
  document.getElementById("food-badge").textContent = shopState.foodAmount;
  document.getElementById("clean-badge").textContent = shopState.cleanAmount;
}

// Buy food
document.addEventListener("DOMContentLoaded", () => {
  const buyFoodBtn = document.getElementById("buy-food-btn");
  if (buyFoodBtn) {
    buyFoodBtn.addEventListener("click", () => {
      if (shopState.currency >= 10) {
        shopState.currency -= 10;
        shopState.foodAmount += 1;
        updateCurrencyDisplay();
        updateInventoryDisplay();
      } else {
        alert("Not enough currency to buy food!");
      }
    });
  } else {
    console.error("Buy food button not found.");
  }
});

// Buy cleaning supplies
document.addEventListener("DOMContentLoaded", () => {
  const buyCleanBtn = document.getElementById("buy-clean-btn");
  if (buyCleanBtn) {
    buyCleanBtn.addEventListener("click", () => {
      if (shopState.currency >= 5) {
        shopState.currency -= 5;
        shopState.cleanAmount += 1;
        updateCurrencyDisplay();
        updateInventoryDisplay();
      } else {
        alert("Not enough currency to buy cleaning supplies!");
      }
    });
  } else {
    console.error("Buy clean button not found.");
  }
});

// Open and close shop
document.addEventListener("DOMContentLoaded", () => {
  const openShopBtn = document.getElementById("open-shop-btn");
  const closeShopBtn = document.getElementById("close-shop-btn");

  if (openShopBtn) {
    openShopBtn.addEventListener("click", () => {
      const shopSection = document.getElementById("shop-section");
      if (shopSection) {
        shopSection.classList.remove("hidden");
      } else {
        console.error("Shop section not found.");
      }
    });
  } else {
    console.error("Open shop button not found.");
  }

  if (closeShopBtn) {
    closeShopBtn.addEventListener("click", () => {
      const shopSection = document.getElementById("shop-section");
      if (shopSection) {
        shopSection.classList.add("hidden");
      } else {
        console.error("Shop section not found.");
      }
    });
  } else {
    console.error("Close shop button not found.");
  }
});

// Initial UI setup
updateCurrencyDisplay();
updateInventoryDisplay();
