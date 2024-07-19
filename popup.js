// Load the spritesheet
const spriteSheet = new Image();
spriteSheet.src = "./images/Cobra Sprite Sheet.png"; // Update this path to match your file structure

// Define the sprite map based on the new spritesheet
const spriteMap = {
  idle: { x: 0, y: 0, width: 32, height: 32, frames: 8, loop: true },
  walk: { x: 0, y: 32, width: 32, height: 32, frames: 8, loop: true },
  eat: {
    x: 0,
    y: 64,
    width: 32,
    height: 32,
    frames: 6,
    loop: true,
    duration: 750,
  },
  sit: { x: 0, y: 96, width: 32, height: 32, frames: 4, loop: true },
  layDown: { x: 0, y: 128, width: 32, height: 32, frames: 6, loop: false },
  sleep: { x: 0, y: 160, width: 32, height: 32, frames: 6, loop: false }, // Updated to match the new structure
};

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
const canvas = document.getElementById("pet-canvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 160;
canvas.height = 160;

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

// Action queue system
function queueAction(action, duration) {
  pet.actionQueue.push({ action, duration });
  if (pet.actionQueue.length === 1) {
    executeNextAction();
  }
}

function executeNextAction() {
  if (pet.actionQueue.length > 0) {
    const { action, duration } = pet.actionQueue[0];
    pet.currentAction = action;
    pet.currentFrame = 0;

    // Calculate the total duration of non-looping animations
    const totalDuration = spriteMap[action].loop
      ? duration
      : spriteMap[action].frames * FRAME_INTERVAL;

    setTimeout(() => {
      pet.actionQueue.shift();
      if (pet.actionQueue.length > 0) {
        executeNextAction();
      } else {
        if (pet.currentAction !== "layDown" || !pet.isSleeping) {
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
    if (spriteInfo.loop) {
      pet.currentFrame = (pet.currentFrame + 1) % spriteInfo.frames;
    } else {
      if (pet.currentFrame < spriteInfo.frames - 1) {
        pet.currentFrame += 1;
      } else if (pet.currentAction === "layDown" && pet.isSleeping) {
        pet.currentFrame = spriteInfo.frames - 1; // Hold on the last frame
      } else {
        pet.currentAction = "idle"; // Transition back to idle after animation
      }
    }
    lastFrameTime = currentTime;
  }
}

// Function to draw pet on canvas
function drawPet() {
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

// Function for random actions
// let randomActionTimeout;
// function randomAction() {
//   const actions = ["idle", "walk", "sit", "layDown", "sleep"];
//   const randomIndex = Math.floor(Math.random() * actions.length);
//   pet.currentAction = actions[randomIndex];

//   // Set a timeout for the next random action
//   randomActionTimeout = setTimeout(randomAction, Math.random() * 5000 + 3000);
// }

// Interaction functions
function feed() {
  if (pet.cooldowns.feed === 0 && !pet.isSleeping) {
    pet.hunger = Math.min(100, pet.hunger + 20);
    queueAction("eat", spriteMap["eat"].frames * FRAME_INTERVAL);
    pet.cooldowns.feed = 10; // 10 second cooldown
    startCooldownTimer("feed", pet.cooldowns.feed);
    updateStats();
  }
}

function play() {
  if (pet.cooldowns.play === 0 && !pet.isSleeping) {
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 10);
    queueAction("walk", 3000);
    pet.cooldowns.play = 15; // 15 second cooldown
    startCooldownTimer("play", pet.cooldowns.play);
    updateStats();
  }
}

function clean() {
  if (pet.cooldowns.clean === 0 && !pet.isSleeping) {
    pet.cleanliness = Math.min(100, pet.cleanliness + 20);
    queueAction("sit", 3000);
    pet.cooldowns.clean = 20; // 20 second cooldown
    startCooldownTimer("clean", pet.cooldowns.clean);
    updateStats();
  }
}

function sleep() {
  if (pet.cooldowns.sleep === 0 && !pet.isSleeping) {
    pet.isSleeping = true;
    queueAction("layDown", spriteMap.layDown.frames * FRAME_INTERVAL);
    pet.cooldowns.sleep = 60;
    startCooldownTimer("sleep", pet.cooldowns.sleep, () => {
      pet.isSleeping = false;
      pet.currentAction = "idle";
      updateStats();
    });
    updateStats();
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
      //   pet.currentAction = "idle"
      updateStats();
    }
    // Start random actions after loading
    // setTimeout(randomAction, 5000);
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

// Event listeners
document.getElementById("feed-btn").addEventListener("click", feed);
document.getElementById("play-btn").addEventListener("click", play);
document.getElementById("clean-btn").addEventListener("click", clean);
document.getElementById("sleep-btn").addEventListener("click", sleep);

// Initialize the game
spriteSheet.onload = () => {
  loadPet();
  requestAnimationFrame(animatePet);
};

// Update stats periodically
setInterval(updateStats, 1000);
