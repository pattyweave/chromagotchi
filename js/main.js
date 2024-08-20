// main.js
import {
  nextScreen,
  showScreen,
  finishOnboarding,
  currentScreenIndex,
} from "./onboarding.js";
import { loadSpriteMap, loadPet, feed, play, clean, sleep } from "./pet.js";
import { checkAchievements } from "./achievements.js";
import { setupCanvas } from "./canvas.js";
import { animatePet } from "./animation.js";

document.addEventListener("DOMContentLoaded", function () {
  initializeExtension();

  // Load the pet state when the extension is opened
  document.addEventListener("DOMContentLoaded", function () {
    loadPet();
  });

  // Event listeners for onboarding buttons
  document
    .getElementById("get-started-btn")
    .addEventListener("click", nextScreen);
  document.getElementById("continue-btn").addEventListener("click", nextScreen);
  document
    .getElementById("finish-tutorial-btn")
    .addEventListener("click", nextScreen);
  document
    .getElementById("finish-onboarding-btn")
    .addEventListener("click", finishOnboarding);

  // Initialize pet interactions
  document.getElementById("feed-icon").addEventListener("click", feed);
  document.getElementById("play-icon").addEventListener("click", play);
  document.getElementById("clean-icon").addEventListener("click", clean);
  document.getElementById("sleep-icon").addEventListener("click", sleep);

  // Initialize achievements
  checkAchievements();
});

function initializeExtension() {
  chrome.storage.local.get(
    ["onboardingCompleted", "selectedEggType", "petName"],
    (result) => {
      if (result.onboardingCompleted) {
        document.getElementById("onboarding").classList.add("hidden");
        document.getElementById("main-app").classList.remove("hidden");
        setupCanvas("pet-canvas-main");
        if (result.selectedEggType) {
          loadSpriteMap(result.selectedEggType);
        }
        if (result.petName) {
          // Use the petName if needed
        }
        requestAnimationFrame(animatePet);
      } else {
        showScreen(currentScreenIndex);
      }
    }
  );
}

// document.addEventListener("DOMContentLoaded", () => {
//   const memoryGameBtn = document.getElementById("memory-game-btn");
//   if (memoryGameBtn) {
//     memoryGameBtn.addEventListener("click", () => {
//       window.location.href = "../memory.html";
//     });
//   } else {
//     console.error("Memory game button not found.");
//   }
// });
