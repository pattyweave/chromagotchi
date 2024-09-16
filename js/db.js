import { supabase } from "../supabase.js";

// Create a new pet entry in the database
export async function createPet(petData) {
  const { data, error } = await supabase.from("pets").insert([petData]);

  if (error) {
    console.error("Error creating pet:", error);
    return null;
  }

  return data;
}

// Fetch pet data for a specific user
export async function fetchPet(userId) {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching pet:", error);
    return null;
  }

  return data;
}

// Update an existing pet entry in the database
export async function updatePet(petId, updateData) {
  const { data, error } = await supabase
    .from("pets")
    .update(updateData)
    .eq("id", petId);

  if (error) {
    console.error("Error updating pet:", error);
    return null;
  }

  return data;
}

// Delete a pet entry from the database
export async function deletePet(petId) {
  const { data, error } = await supabase.from("pets").delete().eq("id", petId);

  if (error) {
    console.error("Error deleting pet:", error);
    return null;
  }

  return data;
}

// Additional CRUD operations for other tables (e.g., user items, purchases) can be added here.
