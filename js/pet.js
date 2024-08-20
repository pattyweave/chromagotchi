import { checkAchievements } from "./achievements.js";
import { drawPet, setupCanvas } from "./canvas.js";
import {
  animatePet,
  FRAME_INTERVAL,
  queueAction,
  spriteMaps,
} from "./animation.js";
import { updateInventoryDisplay } from "./shop.js";
import { shopState } from "./state.js";

let pet = {
  hunger: 50,
  happiness: 50,
  cleanliness: 50,
  energy: 50,
  lastUpdate: Date.now(),
  currentAction: "idle",
  currentFrame: 0,
  isSleeping: false,
  animationDirection: 1,
  loopBack: false,
  actionQueue: [],
  cooldowns: {
    feed: 0,
    play: 0,
    clean: 0,
    sleep: 0,
  },
};

// // Directly update the bars with these hardcoded values
// document.getElementById("health-value").style.width = `${pet.happiness}%`;
// document.getElementById("hunger-value").style.width = `${pet.hunger}%`;
// document.getElementById("mood-value").style.width = `${pet.happiness}%`;
// document.getElementById("energy-value").style.width = `${pet.energy}%`;

// // Update tooltips
// document.querySelector(
//   "#health-bar .tooltip"
// ).textContent = `Health: ${pet.happiness}%`;
// document.querySelector(
//   "#hunger-bar .tooltip"
// ).textContent = `Hunger: ${pet.hunger}%`;
// document.querySelector(
//   "#mood-bar .tooltip"
// ).textContent = `Mood: ${pet.happiness}%`;
// document.querySelector(
//   "#energy-bar .tooltip"
// ).textContent = `Energy: ${pet.energy}%`;

let spriteMap;
let spriteSheet = new Image();

// Load the sprite map based on the selected egg type
function loadSpriteMap(eggType) {
  if (spriteMaps[eggType]) {
    spriteMap = spriteMaps[eggType].map;
    spriteSheet.src = spriteMaps[eggType].sheet;
    spriteSheet.onload = () => {
      drawPet();
    };
  } else {
    console.error("Invalid egg type selected.");
  }
}

// Save the pet state to local storage
function savePet() {
  chrome.storage.local.set({ pet }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving pet:", chrome.runtime.lastError);
    } else {
      console.log("Pet data saved successfully.");
    }
  });
}

// Load the pet state from local storage
function loadPet() {
  chrome.storage.local.get(["pet"], (result) => {
    if (result.pet) {
      pet = result.pet;
      pet.actionQueue = []; // Clear the action queue when loading the pet
      pet.currentAction = "idle"; // Reset to idle
      pet.currentFrame = 0; // Reset to the first frame

      updateStats(); // Ensure the stats are updated after loading
      setupCanvas("pet-canvas-main");
      requestAnimationFrame(animatePet);
      console.log("Pet data loaded:", pet);
    } else {
      console.log("No saved pet found, initializing with default values.");
      savePet(); // Save the initial pet object if no saved state is found
    }
  });
}

// Update the pet's stats over time
function updateStats() {
  const now = Date.now();
  const timePassed = (now - pet.lastUpdate) / 1000;

  if (!pet.isSleeping) {
    pet.hunger = Math.max(0, Math.min(100, pet.hunger - timePassed * 0.1));
    pet.happiness = Math.max(
      0,
      Math.min(100, pet.happiness - timePassed * 0.05)
    );
    pet.cleanliness = Math.max(
      0,
      Math.min(100, pet.cleanliness - timePassed * 0.08)
    );
    pet.energy = Math.max(0, Math.min(100, pet.energy - timePassed * 0.03));
  } else {
    pet.energy = Math.min(100, pet.energy + timePassed * 0.1);
  }

  pet.lastUpdate = now;

  // Update radial indicators
  updateRadialIndicator("health", pet.happiness);
  updateRadialIndicator("hunger", pet.hunger);
  updateRadialIndicator("mood", pet.cleanliness);
  updateRadialIndicator("energy", pet.energy);

  updateUI();
  updateMood();
  savePet();
}

function updateRadialIndicator(stat, value) {
  const circle = document.getElementById(`${stat}-circle`);
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;
}

// Update the pet's mood based on its stats
function updateMood() {
  const averageStats =
    (pet.hunger + pet.happiness + pet.cleanliness + pet.energy) / 4;
  let mood = "normal";
  if (averageStats > 70) mood = "happy";
  else if (averageStats < 30) mood = "sad";

  document.getElementById("mood-value").textContent =
    mood.charAt(0).toUpperCase() + mood.slice(1);
}

// Update the UI elements based on pet's state
function updateUI() {
  document.getElementById("feed-icon").addEventListener("click", () => {
    feed();
  });
  document.getElementById("play-icon").addEventListener("click", () => {
    play();
  });
  document.getElementById("clean-icon").addEventListener("click", () => {
    clean();
  });
  document.getElementById("sleep-icon").addEventListener("click", () => {
    sleep();
  });
}

// Interaction functions
function feed() {
  if (shopState.foodAmount > 0) {
    if (pet.cooldowns.feed === 0 && !pet.isSleeping) {
      shopState.foodAmount -= 1;
      pet.hunger = Math.min(100, pet.hunger + 20);
      updateInventoryDisplay();
      queueAction("eat", spriteMap["eat"].frames * FRAME_INTERVAL, true);
      pet.cooldowns.feed = 10;
      startCooldownTimer("feed-icon", pet.cooldowns.feed);
      checkAchievements();
      updateStats();
    }
  } else {
    alert("You need to buy food first!");
  }
}

function play() {
  console.log("PLAYED");
  if (pet.cooldowns.play === 0 && !pet.isSleeping) {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 10);
    queueAction("walk", 3000, true);
    pet.cooldowns.play = 15;
    startCooldownTimer("play-icon", pet.cooldowns.play);
    checkAchievements();
    updateStats();
  }
}

function clean() {
  if (shopState.cleanAmount > 0) {
    if (pet.cooldowns.clean === 0 && !pet.isSleeping) {
      shopState.cleanAmount -= 1;
      pet.cleanliness = Math.min(100, pet.cleanliness + 20);
      updateInventoryDisplay();
      queueAction("sit", 3000, true);
      pet.cooldowns.clean = 20;
      startCooldownTimer("clean-icon", pet.cooldowns.clean);
      checkAchievements();
      updateStats();
    }
  } else {
    alert("You need to buy cleaning supplies first!");
  }
}

function sleep() {
  if (pet.cooldowns.sleep === 0 && !pet.isSleeping) {
    pet.isSleeping = true;
    queueAction("sleep", spriteMap.sleep.frames * FRAME_INTERVAL, false);
    pet.energy += 30;
    pet.cooldowns.sleep = 60;
    startCooldownTimer("sleep-icon", pet.cooldowns.sleep, () => {
      pet.isSleeping = false;
      pet.currentAction = "idle";
      updateStats();
    });
    checkAchievements();
  }
}

// Cooldown timer for each action
function startCooldownTimer(controlId, cooldownTime) {
  const control = document.querySelector(`#${controlId}`);
  const timerElement = document.querySelector(`#${controlId} .timer`);
  const timerText = document.getElementById(`${controlId}-timeLeft`);
  const timerCircle = timerElement
    ? timerElement.querySelector("svg > circle + circle")
    : null;

  if (!timerElement || !timerCircle || !timerText) {
    console.error(`Could not find the required elements for ${controlId}`);
    return;
  }

  let timeLeft = cooldownTime;

  // Show the timer and start the cooldown
  control.style.visibility = "hidden";
  timerElement.style.visibility = "visible";
  timerElement.classList.add("animatable");

  function updateCooldown() {
    const normalizedTime = (cooldownTime - timeLeft) / cooldownTime;
    timerCircle.style.strokeDashoffset = normalizedTime;
    timerText.textContent = timeLeft;

    if (timeLeft > 0) {
      timeLeft--;
      setTimeout(updateCooldown, 1000); // Update every second
    } else {
      timerCircle.style.strokeDashoffset = 1; // Reset after cooldown
      timerText.textContent = "";
      timerElement.style.visibility = "hidden"; // Hide the timer after cooldown
      control.style.visibility = "visible";
      timerElement.classList.remove("animatable");
    }
  }

  updateCooldown();
}

export {
  loadSpriteMap,
  spriteSheet,
  spriteMap,
  pet,
  updateStats,
  savePet,
  loadPet,
  feed,
  play,
  clean,
  sleep,
  startCooldownTimer,
};
