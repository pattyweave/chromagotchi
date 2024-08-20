const spriteMaps = {
  cobra: {
    sheet: "./images/cobra.png",
    map: {
      idle: { x: 0, y: 0, width: 32, height: 32, frames: 8, loop: true },
      walk: { x: 0, y: 32, width: 32, height: 32, frames: 8, loop: true },
      eat: { x: 0, y: 64, width: 32, height: 32, frames: 6, loop: true },
      sit: { x: 0, y: 96, width: 32, height: 32, frames: 4, loop: true },
      sleep: { x: 0, y: 128, width: 32, height: 32, frames: 6, loop: false },
      //   sleep: { x: 0, y: 160, width: 32, height: 32, frames: 6, loop: false },
    },
  },
  parrot: {
    sheet: "./images/parrot.png",
    map: {
      idle: { x: 0, y: 0, width: 32, height: 32, frames: 4, loop: true },
      idle2: { x: 0, y: 32, width: 32, height: 32, frames: 5, loop: true },
      walk: { x: 0, y: 64, width: 32, height: 32, frames: 8, loop: true },
      eat: { x: 0, y: 96, width: 32, height: 32, frames: 6, loop: true },
      sit: { x: 0, y: 128, width: 32, height: 32, frames: 5, loop: true },
      sleep: { x: 0, y: 160, width: 32, height: 32, frames: 5, loop: false },
    },
  },
  fox: {
    sheet: "./images/fox.png",
    map: {
      idle: { x: 0, y: 32, width: 32, height: 32, frames: 14, loop: true },
      walk: { x: 0, y: 96, width: 32, height: 32, frames: 11, loop: true },
      sleep: { x: 0, y: 160, width: 32, height: 32, frames: 6, loop: true },
      eat: { x: 0, y: 128, width: 32, height: 32, frames: 5, loop: true },
      sit: { x: 0, y: 192, width: 32, height: 32, frames: 7, loop: false },
    },
  },
  turtle: {
    sheet: "./images/turtle.png",
    map: {
      idle: { x: 0, y: 32, width: 32, height: 32, frames: 10, loop: true },
      walk: { x: 0, y: 0, width: 32, height: 32, frames: 12, loop: true },
      sleep: { x: 0, y: 96, width: 32, height: 32, frames: 6, loop: true },
      eat: { x: 0, y: 128, width: 32, height: 32, frames: 5, loop: true },
      sit: { x: 0, y: 160, width: 32, height: 32, frames: 10, loop: false },
    },
  },
  octopus: {
    sheet: "./images/Octopus Sprite Sheet.png",
    map: {
      idle: { x: 0, y: -8, width: 32, height: 32, frames: 4, loop: true },
      walk: { x: 0, y: 24, width: 32, height: 32, frames: 4, loop: true },
      sleep: { x: 0, y: 88, width: 32, height: 32, frames: 6, loop: false },
      eat: { x: 0, y: 120, width: 32, height: 32, frames: 6, loop: true },
      sit: { x: 0, y: 184, width: 32, height: 32, frames: 7, loop: false },
    },
  },
};

let spriteMap;
let spriteSheet = new Image();

function loadSpriteMap(eggType) {
  if (spriteMaps[eggType]) {
    spriteMap = spriteMaps[eggType].map;
    spriteSheet.src = spriteMaps[eggType].sheet;
    spriteSheet.onload = () => {
      drawPet(); // Ensure the pet is drawn once the image is loaded
    };
  } else {
    console.error("Invalid egg type selected.");
  }
}

// Achievements object
const achievements = {
  firstFeed: {
    name: "First Feed",
    description: "Feed your pet for the first time.",
    earned: false,
  },
  firstPlay: {
    name: "First Play",
    description: "Play with your pet for the first time.",
    earned: false,
  },
  firstClean: {
    name: "First Clean",
    description: "Clean your pet for the first time.",
    earned: false,
  },
  firstSleep: {
    name: "First Sleep",
    description: "Put your pet to sleep for the first time.",
    earned: false,
  },
  levelUp10: {
    name: "Level Up 10",
    description: "Reach level 10.",
    earned: false,
  },
  levelUp20: {
    name: "Level Up 20",
    description: "Reach level 20.",
    earned: false,
  },
  levelUp30: {
    name: "Level Up 30",
    description: "Reach level 30.",
    earned: false,
  },
  maxStats: {
    name: "Max Stats",
    description: "Achieve 100 in hunger, happiness, cleanliness, and energy.",
    earned: false,
  },
  dailyCare7: {
    name: "Daily Care 7",
    description: "Interact with your pet daily for 7 days.",
    earned: false,
  },
  dailyCare30: {
    name: "Daily Care 30",
    description: "Interact with your pet daily for 30 days.",
    earned: false,
  },
  dailyCare90: {
    name: "Daily Care 90",
    description: "Interact with your pet daily for 90 days.",
    earned: false,
  },
  birthday: {
    name: "Birthday",
    description: "Celebrate your pet’s birthday.",
    earned: false,
  },
  holidayEvent: {
    name: "Holiday Event",
    description: "Participate in a holiday-themed event.",
    earned: false,
  },
  memoryMaster: {
    name: "Memory Master",
    description: "Complete the memory match game 10 times.",
    earned: false,
  },
  catchChampion: {
    name: "Catch Champion",
    description: "Score 50 points in the catch game.",
    earned: false,
  },
  clickerKing: {
    name: "Clicker King",
    description: "Click the target 100 times in the clicker game.",
    earned: false,
  },
};

// Load achievements from storage
chrome.storage.local.get("achievements", function (result) {
  if (result.achievements) {
    Object.assign(achievements, result.achievements);
    checkAchievements();
  }
});

// Function to save achievements to storage
function saveAchievements() {
  chrome.storage.local.set({ achievements: achievements });
}

// Function to check and display achievements
function checkAchievements() {
  const achievementsList = document.getElementById("achievements-list");
  achievementsList.innerHTML = ""; // Clear existing achievements

  for (const key in achievements) {
    const achievement = achievements[key];
    const li = document.createElement("li");
    li.textContent = `${achievement.name} - ${achievement.description}`;
    li.classList.add(
      achievement.earned ? "achievement-earned" : "achievement-pending"
    );
    achievementsList.appendChild(li);
  }
}

// Pet object to store state
let pet = {
  hunger: 50,
  happiness: 50,
  cleanliness: 50,
  energy: 50,
  lastUpdate: Date.now(),
  currentAction: "idle",
  currentFrame: 0,
  isSleeping: false,
  animationDirection: 1, // 1 for forward, -1 for reverse
  loopBack: false, // Whether to play in reverse after forward
  actionQueue: [],
  cooldowns: {
    feed: 0,
    play: 0,
    clean: 0,
    sleep: 0,
  },
};

// Animation control variables
let lastFrameTime = 0;
const FRAME_INTERVAL = 200; // Milliseconds between frame changes

// Canvas setup
let canvas, ctx;
function setupCanvas(canvasId) {
  canvas = document.getElementById(canvasId);
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 160;
  canvas.height = 160;

  // Disable image smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
}

// Function to update pet stats
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

  // Update cooldowns
  for (let action in pet.cooldowns) {
    pet.cooldowns[action] = Math.max(0, pet.cooldowns[action] - timePassed);
  }

  document.getElementById("hunger-value").textContent = Math.round(pet.hunger);
  document.getElementById("happiness-value").textContent = Math.round(
    pet.happiness
  );
  document.getElementById("cleanliness-value").textContent = Math.round(
    pet.cleanliness
  );
  document.getElementById("energy-value").textContent = Math.round(pet.energy);

  updateUI();
  updateMood();
  checkForAttention();
  savePet();
}

// Function to update pet's mood
function updateMood() {
  const averageStats =
    (pet.hunger + pet.happiness + pet.cleanliness + pet.energy) / 4;
  let mood;
  if (averageStats > 70) {
    mood = "happy";
  } else if (averageStats < 30) {
    mood = "sad";
  } else {
    mood = "normal";
  }
  document.getElementById("mood-value").textContent =
    mood.charAt(0).toUpperCase() + mood.slice(1);
}

function updateUI() {
  // Ensure pet.cooldowns is defined before accessing its properties
  if (pet.cooldowns) {
    document.getElementById("feed-btn").disabled = pet.cooldowns.feed > 0;
    document.getElementById("play-btn").disabled = pet.cooldowns.play > 0;
    document.getElementById("clean-btn").disabled = pet.cooldowns.clean > 0;
    document.getElementById("sleep-btn").disabled = pet.cooldowns.sleep > 0;

    // Start cooldown timers
    if (pet.cooldowns.feed > 0)
      startCooldownTimer("feed", Math.ceil(pet.cooldowns.feed));
    if (pet.cooldowns.play > 0)
      startCooldownTimer("play", Math.ceil(pet.cooldowns.play));
    if (pet.cooldowns.clean > 0)
      startCooldownTimer("clean", Math.ceil(pet.cooldowns.clean));
    if (pet.cooldowns.sleep > 0)
      startCooldownTimer("sleep", Math.ceil(pet.cooldowns.sleep));
  } else {
    console.error("pet.cooldowns is undefined");
  }

  // Update other UI elements
  document.getElementById("hunger-value").textContent = Math.round(pet.hunger);
  document.getElementById("happiness-value").textContent = Math.round(
    pet.happiness
  );
  document.getElementById("cleanliness-value").textContent = Math.round(
    pet.cleanliness
  );
  document.getElementById("energy-value").textContent = Math.round(pet.energy);
}

function checkForAttention() {
  if (
    pet.hunger < 30 ||
    pet.happiness < 30 ||
    pet.cleanliness < 30 ||
    pet.energy < 30
  ) {
    // Visual or audio cue that pet needs attention
    console.log("Pet needs attention!");
  }
}

// Action Queue System
function queueAction(action, duration, loopBack = false) {
  pet.actionQueue.push({ action, duration, loopBack });
  if (pet.actionQueue.length === 1) {
    executeNextAction();
  }
}

function executeNextAction() {
  if (pet.actionQueue.length > 0) {
    const { action, duration, loopBack } = pet.actionQueue[0];
    pet.currentAction = action;
    pet.currentFrame = 0;
    pet.animationDirection = 1; // Start with forward direction
    pet.loopBack = loopBack;

    // Calculate the total duration of non-looping animations
    const totalDuration = spriteMap[action].loop
      ? duration
      : spriteMap[action].frames * FRAME_INTERVAL * (loopBack ? 2 : 1);

    setTimeout(() => {
      pet.actionQueue.shift();
      if (pet.actionQueue.length > 0) {
        executeNextAction();
      } else {
        if (pet.currentAction !== "sleep" || !pet.isSleeping) {
          pet.currentAction = "idle";
        }
      }
    }, totalDuration);
  }
}

// Function to update pet sprite
function updatePetSprite(currentTime) {
  if (currentTime - lastFrameTime > FRAME_INTERVAL) {
    const spriteInfo = spriteMap[pet.currentAction];

    // Determine the next frame
    if (spriteInfo.loop) {
      pet.currentFrame =
        (pet.currentFrame + pet.animationDirection) % spriteInfo.frames;
    } else {
      if (pet.animationDirection === 1) {
        if (pet.currentFrame < spriteInfo.frames - 1) {
          pet.currentFrame += 1;
        } else if (pet.loopBack) {
          pet.animationDirection = -1; // Reverse the direction
        } else if (pet.currentAction === "sleep" && pet.isSleeping) {
          pet.currentFrame = spriteInfo.frames - 1; // Stay in the last frame
        } else {
          pet.currentAction = "idle";
        }
      } else {
        if (pet.currentFrame > 0) {
          pet.currentFrame -= 1;
        } else {
          pet.currentAction = "idle";
          pet.animationDirection = 1; // Reset to forward direction
        }
      }
    }

    lastFrameTime = currentTime;
  }
}

// Function to draw pet on canvas
function drawPet() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spriteInfo = spriteMap[pet.currentAction];
  const frameX = pet.currentFrame * spriteInfo.width;

  // Calculate scaling factor to fit the sprite in the canvas
  const scale = Math.min(
    canvas.width / spriteInfo.width,
    canvas.height / spriteInfo.height
  );

  // Calculate the scaled dimensions
  const scaledWidth = spriteInfo.width * scale;
  const scaledHeight = spriteInfo.height * scale;

  // Calculate the position to center the sprite
  const x = (canvas.width - scaledWidth) / 2;
  const y = (canvas.height - scaledHeight) / 2 - 10;

  ctx.drawImage(
    spriteSheet,
    frameX,
    spriteInfo.y,
    spriteInfo.width,
    spriteInfo.height,
    x,
    y,
    scaledWidth,
    scaledHeight
  );
}

// Main animation loop
function animatePet(currentTime) {
  updatePetSprite(currentTime);
  drawPet();
  requestAnimationFrame(animatePet);
}

// Interaction functions
function feed() {
  if (pet.cooldowns.feed === 0 && !pet.isSleeping) {
    pet.hunger = Math.min(100, pet.hunger + 20);
    queueAction("eat", spriteMap["eat"].frames * FRAME_INTERVAL, true);
    pet.cooldowns.feed = 10; // 10 second cooldown
    startCooldownTimer("feed", pet.cooldowns.feed);
    if (!achievements.firstFeed.earned) {
      achievements.firstFeed.earned = true;
      saveAchievements();
    }
    updateStats();
    checkAchievements();
  }
}

function play() {
  if (pet.cooldowns.play === 0 && !pet.isSleeping) {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 10);
    queueAction("walk", 3000, true);
    pet.cooldowns.play = 15; // 15 second cooldown
    startCooldownTimer("play", pet.cooldowns.play);
    if (!achievements.firstPlay.earned) {
      achievements.firstPlay.earned = true;
      saveAchievements();
    }
    updateStats();
    checkAchievements();
  }
}

function clean() {
  if (pet.cooldowns.clean === 0 && !pet.isSleeping) {
    pet.cleanliness = Math.min(100, pet.cleanliness + 20);
    queueAction("sit", 3000, true);
    pet.cooldowns.clean = 20; // 20 second cooldown
    startCooldownTimer("clean", pet.cooldowns.clean);
    if (!achievements.firstClean.earned) {
      achievements.firstClean.earned = true;
      saveAchievements();
    }
    updateStats();
    checkAchievements();
  }
}

function sleep() {
  if (pet.cooldowns.sleep === 0 && !pet.isSleeping) {
    pet.isSleeping = true;
    queueAction("sleep", spriteMap.sleep.frames * FRAME_INTERVAL, false); // No loop back for sleep
    pet.energy += 30;
    pet.cooldowns.sleep = 60;
    startCooldownTimer("sleep", pet.cooldowns.sleep, () => {
      pet.isSleeping = false;
      pet.currentAction = "idle";
      updateStats();
      updateUI(); // Ensure buttons are re-enabled
    });
    if (!achievements.firstSleep.earned) {
      achievements.firstSleep.earned = true;
      saveAchievements();
    }
    updateStats();
    checkAchievements();
  }
}

// Save and load functions
function savePet() {
  chrome.storage.local.set({ pet: pet });
}

function loadPet() {
  chrome.storage.local.get(["pet"], (result) => {
    if (result.pet) {
      pet = result.pet;
      // Ensure the pet wakes up if sleeping duration is over
      if (pet.isSleeping && pet.cooldowns.sleep <= 0) {
        pet.isSleeping = false;
        pet.currentAction = "idle";
      }
      updateStats();
      setupCanvas("pet-canvas-main"); // Setup canvas when pet is loaded
      requestAnimationFrame(animatePet); // Start animation after loading
    }
  });
}

function startCooldownTimer(action, duration, callback) {
  const timerElement = document.getElementById(`${action}-timer`);
  let remainingTime = duration;

  function updateTimer() {
    if (remainingTime > 0) {
      remainingTime -= 1;
      timerElement.textContent = `(${remainingTime}s)`;
      setTimeout(updateTimer, 1000);
    } else {
      timerElement.textContent = "";
      if (callback) {
        callback();
      }
    }
  }

  updateTimer();
}

// Initial call to display achievements
checkAchievements();

// Event listeners
document.getElementById("feed-btn").addEventListener("click", feed);
document.getElementById("play-btn").addEventListener("click", play);
document.getElementById("clean-btn").addEventListener("click", clean);
document.getElementById("sleep-btn").addEventListener("click", sleep);

// Initialize the game
spriteSheet.onload = () => {
  loadPet();
};

// Update stats periodically
setInterval(updateStats, 1000);

// Save pet state periodically
setInterval(savePet, 5000);

function checkDailyLogin() {
  const lastLogin = new Date(pet.lastLogin);
  const now = new Date();
  const daysBetween = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

  if (daysBetween >= 1) {
    pet.dailyLoginStreak += 1;
    pet.lastLogin = now;
    // Reward the user based on the login streak
    giveDailyReward(pet.dailyLoginStreak);
  }
}

function giveDailyReward(streak) {
  // Reward logic based on the streak
  if (streak === 1) {
    pet.coins += 10;
  } else if (streak === 7) {
    pet.coins += 100;
    // Give a special item or bonus for a 7-day streak
  }
  // Update UI to show the reward
}

function showNotification(message) {
  const banner = document.getElementById("notification-banner");
  banner.textContent = message;
  banner.classList.remove("hidden");
  setTimeout(() => banner.classList.add("hidden"), 5000); // Hide after 5 seconds
}

document.getElementById("trophy-icon").addEventListener("click", () => {
  // Open achievements modal or page
  showAchievements();
});

function showAchievements() {
  // Logic to display achievements
  alert("Displaying achievements...");
}

document.getElementById("expand-btn").addEventListener("click", () => {
  // Toggle visibility of additional features
  toggleAdditionalFeatures();
});

function toggleAdditionalFeatures() {
  // Logic to expand and show more features
  alert("Expanding for more features...");
}

document.addEventListener("DOMContentLoaded", function () {
  const onboardingScreens = document.querySelectorAll(".screen");
  let currentScreenIndex = 0;
  let selectedEggType = null;

  function showScreen(index) {
    onboardingScreens.forEach((screen, i) => {
      screen.classList.toggle("active", i === index);
    });
  }

  function nextScreen() {
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

  document
    .getElementById("get-started-btn")
    .addEventListener("click", nextScreen);
  document.getElementById("continue-btn").addEventListener("click", nextScreen);
  document
    .getElementById("finish-tutorial-btn")
    .addEventListener("click", nextScreen);
  document
    .getElementById("finish-onboarding-btn")
    .addEventListener("click", () => {
      chrome.storage.local.set({ onboardingCompleted: true }, nextScreen);
    });

  // Example egg options setup
  const eggOptionsContainer = document.getElementById("egg-options");
  const eggSprites = {
    cobra: "blueEgg.png",
    parrot: "redEgg.png",
    fox: "yellowEgg.png",
    turtle: "greenEgg.png",
    octopus: "violetEgg.png",
  };

  Object.keys(eggSprites).forEach((eggType) => {
    const img = document.createElement("img");
    img.src = `./images/${eggSprites[eggType]}`;
    img.addEventListener("click", () => {
      selectedEggType = eggType;
      document
        .querySelectorAll("#egg-options img")
        .forEach((eggImg) => eggImg.classList.remove("selected"));
      img.classList.add("selected");
    });
    eggOptionsContainer.appendChild(img);
  });

  document
    .getElementById("next-choose-egg-btn")
    .addEventListener("click", () => {
      if (!selectedEggType) {
        alert("Please select an egg.");
      } else {
        chrome.storage.local.set({ selectedEggType: selectedEggType });
        loadSpriteMap(selectedEggType); // Load the selected sprite map
        nextScreen();
      }
    });

  document.getElementById("next-name-egg-btn").addEventListener("click", () => {
    const eggName = document.getElementById("egg-name-input").value.trim();
    if (eggName === "") {
      alert("Please enter a name for your pet.");
    } else {
      chrome.storage.local.set({ petName: eggName });
      nextScreen();
      setTimeout(() => {
        nextScreen();
      }, 5000); // Simulate a 5-second hatching process
    }
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

  // Social sharing functionality
  //   function generateShareableImage() {
  //     const element = document.getElementById("shareable-content");
  //     html2canvas(element).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const generatedImage = document.getElementById("generated-image");
  //       generatedImage.src = imgData;
  //       generatedImage.classList.remove("hidden");

  //       const twitterShareBtn = document.getElementById("twitter-share-btn");
  //       const instagramShareBtn = document.getElementById("instagram-share-btn");
  //       const shareMessage = "Check out my virtual pet!";

  //       twitterShareBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  //         shareMessage
  //       )}&url=${encodeURIComponent(imgData)}`;
  //       instagramShareBtn.href = `https://www.instagram.com/share?text=${encodeURIComponent(
  //         shareMessage
  //       )}&url=${encodeURIComponent(imgData)}`;

  //       twitterShareBtn.classList.remove("hidden");
  //       instagramShareBtn.classList.remove("hidden");
  //     });
  //   }

  //   document
  //     .getElementById("share-btn")
  //     .addEventListener("click", generateShareableImage);

  initializeExtension();
});
