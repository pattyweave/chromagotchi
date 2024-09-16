import { updatePet, fetchPet } from "./db.js";

// Sync pet data to the server
export async function syncPetData(pet) {
  try {
    const updatedPet = await updatePet(pet.id, pet);
    console.log("Pet data synced to server:", updatedPet);
    return updatedPet;
  } catch (error) {
    console.error("Error syncing pet data:", error);
  }
}

// Pull the latest pet data from the server
export async function pullPetData(userId) {
  try {
    const petData = await fetchPet(userId);
    console.log("Pet data pulled from server:", petData);
    return petData;
  } catch (error) {
    console.error("Error pulling pet data:", error);
  }
}

// Sync user items or purchases
export async function syncUserItems(userId, items) {
  try {
    // Assuming you have a user_items table
    const { data, error } = await supabase
      .from("user_items")
      .upsert(items.map((item) => ({ user_id: userId, ...item })));

    if (error) {
      console.error("Error syncing user items:", error);
      return null;
    }

    console.log("User items synced:", data);
    return data;
  } catch (error) {
    console.error("Error syncing user items:", error);
  }
}

// Pull the latest user items from the server
export async function pullUserItems(userId) {
  try {
    const { data, error } = await supabase
      .from("user_items")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error pulling user items:", error);
      return null;
    }

    console.log("User items pulled:", data);
    return data;
  } catch (error) {
    console.error("Error pulling user items:", error);
  }
}
