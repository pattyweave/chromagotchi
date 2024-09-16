import { openAuthModal } from "./auth.js";
import { shopState } from "./state.js";

// Fetch and update the user's currency
async function fetchAndSetUserBalance() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await fetch("http://localhost:5001/api/shop/balance", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch balance");
    }

    const data = await response.json();
    shopState.currency = data.currency;
    updateCurrencyDisplay();
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

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

// Handle shop icon click to open auth modal or proceed to shop
document.getElementById("shop-icon").addEventListener("click", () => {
  openAuthModal();
  // const userConfirmed = confirm(
  //   "You are about to leave the extension and visit our online shop. Continue?"
  // );
  // if (userConfirmed) {
  //   const shopUrl = "http://localhost:3000/shop"; // Replace with your actual URL
  //   window.open(shopUrl, "_blank"); // Opens the link in a new tab
  // }
});

// Initial UI setup
document.addEventListener("DOMContentLoaded", () => {
  fetchAndSetUserBalance();
  updateCurrencyDisplay();
  updateInventoryDisplay();
});
