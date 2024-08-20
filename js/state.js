export let shopState = {
  currency: 100,
  foodAmount: 0,
  cleanAmount: 0,
};

export function updateCurrency(amount) {
  shopState.currency += amount;
}

export function getCurrency() {
  return shopState.currency;
}
