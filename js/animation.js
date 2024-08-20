import { drawPet } from "./canvas.js";
import { pet, spriteMap } from "./pet.js";

// animation.js
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

let lastFrameTime = 0;
const FRAME_INTERVAL = 200;

function updatePetSprite(currentTime) {
  if (currentTime - lastFrameTime > FRAME_INTERVAL) {
    const spriteInfo = spriteMap[pet.currentAction];

    if (spriteInfo.loop) {
      pet.currentFrame =
        (pet.currentFrame + pet.animationDirection) % spriteInfo.frames;
    } else {
      if (pet.animationDirection === 1) {
        if (pet.currentFrame < spriteInfo.frames - 1) {
          pet.currentFrame += 1;
        } else if (pet.loopBack) {
          pet.animationDirection = -1;
        } else if (pet.currentAction !== "idle") {
          pet.currentAction = "idle";
          pet.currentFrame = 0; // Reset to first frame of idle
        }
      } else {
        if (pet.currentFrame > 0) {
          pet.currentFrame -= 1;
        } else {
          pet.currentAction = "idle";
          pet.animationDirection = 1;
        }
      }
    }

    lastFrameTime = currentTime;
  }
}

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

    const totalDuration = spriteMap[action].loop
      ? duration
      : spriteMap[action].frames * FRAME_INTERVAL * (loopBack ? 2 : 1);

    setTimeout(() => {
      pet.actionQueue.shift();
      if (pet.actionQueue.length > 0) {
        executeNextAction();
      } else {
        // After completing all actions, return to idle animation
        pet.currentAction = "idle";
        requestAnimationFrame(animatePet);
      }
    }, totalDuration);

    // Ensure that the animation loop continues
    requestAnimationFrame(animatePet);
  } else {
    // If no actions in queue, make sure the pet is in idle state
    pet.currentAction = "idle";
    pet.currentFrame = 0;
    requestAnimationFrame(animatePet);
  }
}

function animatePet(currentTime) {
  updatePetSprite(currentTime);
  drawPet();

  // Continue animating if there are actions in the queue or if the current action is not idle
  if (pet.currentAction !== "idle" || pet.actionQueue.length > 0) {
    requestAnimationFrame(animatePet);
  } else {
    // If the action is idle, keep the pet animating in the idle state
    pet.currentAction = "idle";
    requestAnimationFrame(animatePet);
  }
}

export function loadHatchingAnimation() {
  const hatchingCanvas = document.getElementById("hatching-canvas");
  const ctx = hatchingCanvas.getContext("2d");

  const hatchingSprite = new Image();
  hatchingSprite.src = "../images/hatchingYellow.png"; // Path to your sprite sheet

  const frameWidth = 32; // Width of each frame
  const frameHeight = 32; // Height of each frame
  const totalFrames = 13; // Total number of frames in the animation
  let currentFrame = 0;

  return {
    ctx,
    hatchingSprite,
    frameWidth,
    frameHeight,
    totalFrames,
    currentFrame,
  };
}

export function startHatchingAnimation(offset, onAnimationComplete) {
  const hatchingCanvas = document.getElementById("hatching-canvas");
  const ctx = hatchingCanvas.getContext("2d");

  // Disable image smoothing for pixel art
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;

  const hatchingSprite = new Image();
  hatchingSprite.src = "../images/hatchingEggs.png"; // Path to your sprite sheet

  const frameWidth = 32; // Width of each frame in the sprite sheet
  const frameHeight = 32; // Height of each frame in the sprite sheet
  const totalFrames = 13; // Total number of frames in the animation
  let currentFrame = 0;

  const FRAME_INTERVAL = 200; // Time in milliseconds for each frame

  // Set the canvas size to match the frame size
  hatchingCanvas.width = frameWidth;
  hatchingCanvas.height = frameHeight;

  function drawFrame() {
    ctx.clearRect(0, 0, frameWidth, frameHeight);
    ctx.drawImage(
      hatchingSprite,
      currentFrame * frameWidth, // Source x position in the sprite sheet
      offset, // Source y position in the sprite sheet
      frameWidth, // Source width (frame width)
      frameHeight, // Source height (frame height)
      0, // Destination x position on the canvas
      0, // Destination y position on the canvas
      frameWidth, // Destination width on the canvas
      frameHeight // Destination height on the canvas
    );

    console.log(`Drawing frame ${currentFrame}`);
    currentFrame++;

    if (currentFrame < totalFrames) {
      setTimeout(() => {
        requestAnimationFrame(drawFrame);
      }, FRAME_INTERVAL); // Delay before drawing the next frame
    } else {
      console.log("Animation complete");
      if (typeof onAnimationComplete === "function") {
        onAnimationComplete(); // Move to the next screen after the animation is complete
      }
    }
  }

  hatchingSprite.onload = () => {
    console.log("Sprite loaded, starting animation");
    requestAnimationFrame(drawFrame); // Start the animation loop after the sprite is loaded
  };

  hatchingSprite.onerror = () => {
    console.error("Failed to load sprite");
  };
}

export { spriteMaps, animatePet, queueAction, FRAME_INTERVAL };
