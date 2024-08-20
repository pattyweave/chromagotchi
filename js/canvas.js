import { pet, spriteMap, spriteSheet } from "./pet.js";

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

function drawPet() {
  if (!ctx || !spriteMap || !spriteSheet) return;

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

export { setupCanvas, drawPet };
