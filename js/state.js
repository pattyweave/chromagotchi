export let shopState = {
  currency: 100,
  foodAmount: 0,
  cleanAmount: 0,
};

export let pet = {
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

export function updatePet(newPetState) {
  pet = { ...pet, ...newPetState };
  console.log("NEW PET STATES AFTER UPDATE::::::", pet);
}

export function updateCurrency(amount) {
  shopState.currency += amount;
}

export function getCurrency() {
  return shopState.currency;
}
