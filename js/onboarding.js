import { setupCanvas, drawPet } from "./canvas.js";
import { loadSpriteMap } from "./pet.js";
import { loadHatchingAnimation, startHatchingAnimation } from "./animation.js";

export let currentScreenIndex = 0;
let selectedEggType = null;
let cyclingInterval;

// Define egg images and corresponding pet types
const eggImages = [
  { src: "../images/blueEgg.png", type: "cobra", animationOffset: 32 },
  { src: "../images/redEgg.png", type: "parrot", animationOffset: 128 },
  { src: "../images/yellowEgg.png", type: "fox", animationOffset: 0 },
  { src: "../images/greenEgg.png", type: "turtle", animationOffset: 64 },
  { src: "../images/violetEgg.png", type: "octopus", animationOffset: 160 },
  { src: "../images/pinkEgg.png", type: "octopus", animationOffset: 96 },
];

const onboardingScreens = document.querySelectorAll(".screen");

export function showScreen(index) {
  onboardingScreens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  if (index === 1) {
    // Assuming egg selection screen is at index 1
    startEggCycling();
  }
}

export function nextScreen() {
  if (currentScreenIndex < onboardingScreens.length - 1) {
    currentScreenIndex += 1;
    showScreen(currentScreenIndex);
  } else {
    document.getElementById("onboarding").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    setupCanvas("pet-canvas-main");
    requestAnimationFrame(animatePet);
  }
}

function startEggCycling() {
  const eggImageElement = document.getElementById("current-egg");
  let currentIndex = 0;

  cyclingInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % eggImages.length;
    eggImageElement.src = eggImages[currentIndex].src;
  }, 200);
}

function stopEggCycling() {
  clearInterval(cyclingInterval);
  const currentEggSrc = document.getElementById("current-egg").src;

  // Extract the filename from the currentEggSrc
  const currentEggFilename = currentEggSrc.split("/").pop();

  // Find the egg that matches the filename
  const selectedEgg = eggImages.find((egg) =>
    egg.src.includes(currentEggFilename)
  );

  if (selectedEgg) {
    selectedEggType = selectedEgg.type;
    proceedToHatching(selectedEgg.animationOffset);
  } else {
    console.error(
      "Error: Selected egg not found. Ensure the image paths match exactly."
    );
    alert("Oops! Something went wrong. Please try selecting an egg again.");
    // Optionally, you can restart the egg cycling here
    startEggCycling();
  }
}

function proceedToHatching(offset) {
  nextScreen(); // Move to the hatching screen

  startHatchingAnimation(offset, () => {
    nextScreen(); // Automatically move to the pet introduction screen after hatching
  });

  chrome.storage.local.set({ selectedEggType: selectedEggType });
}

export function finishOnboarding() {
  chrome.storage.local.set({ onboardingCompleted: true }, nextScreen);
}

// Attach the stop function to the select button
document
  .getElementById("select-egg-btn")
  .addEventListener("click", stopEggCycling);

document
  .getElementById("next-name-egg-btn")
  .addEventListener("click", function () {
    const eggName = document.getElementById("egg-name-input").value.trim();

    if (eggName === "") {
      alert("Please enter a name for your pet.");
    } else {
      // Store the pet's name
      chrome.storage.local.set({ petName: eggName }, function () {
        nextScreen(); // Move to the next screen after storing the name
      });
    }
  });
