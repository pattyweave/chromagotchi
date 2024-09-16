document
  .getElementById("auth-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const isSignUpMode =
      document.getElementById("auth-title").textContent === "Sign Up";

    if (isSignUpMode) {
      const confirmPassword = document.getElementById("confirm-password").value;
      if (password !== confirmPassword) {
        displayAuthError("Passwords do not match");
        return;
      }
      await signupUser(email, password);
    } else {
      await loginUser(email, password);
    }
  });

const createPet = async (petData) => {
  try {
    const response = await fetch("http://localhost:5001/api/pet/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure the token is set
      },
      body: JSON.stringify(petData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create pet");
    }

    console.log("Pet created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating pet:", error);
  }
};

async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    const data = await response.json();

    // Store tokens in localStorage and cookies
    localStorage.setItem("token", data.accessToken);
    document.cookie = `refreshToken=${data.refreshToken}; HttpOnly; Path=/; SameSite=Strict; Secure`;

    // Decode token to get user data
    const decodedToken = jwt_decode(data.accessToken);
    console.log("User logged in:", decodedToken.user);

    // Set user data in local storage or state
    localStorage.setItem("user", JSON.stringify(decodedToken.user));

    closeAuthModal();

    // Sync user profile or pet data if needed
    await syncUserProfile(decodedToken.user);
  } catch (error) {
    console.error("Error logging in:", error);
    displayAuthError(error.message);
  }
}

async function signupUser(email, password) {
  try {
    const response = await fetch("http://localhost:5001/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sign up");
    }

    closeAuthModal();
  } catch (error) {
    console.error("Error signing up:", error);
    displayAuthError(error.message);
  }
}

function displayAuthError(message) {
  const authError = document.getElementById("auth-error");
  authError.textContent = message;
  authError.classList.remove("hidden");
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  modal.classList.add("hidden");
}

document
  .getElementById("switch-auth-mode")
  .addEventListener("click", (event) => {
    event.preventDefault();

    const isSignUpMode =
      document.getElementById("auth-title").textContent === "Sign Up";
    document.getElementById("auth-title").textContent = isSignUpMode
      ? "Sign In"
      : "Sign Up";
    document.getElementById("auth-submit-btn").textContent = isSignUpMode
      ? "Sign In"
      : "Sign Up";
    document.getElementById("switch-auth-mode").textContent = isSignUpMode
      ? "Sign Up"
      : "Sign In";
    document.getElementById("auth-switch-text").textContent = isSignUpMode
      ? "Don't have an account?"
      : "Already have an account?";

    document
      .getElementById("confirm-password-container")
      .classList.toggle("hidden");
  });

export function openAuthModal() {
  const modal = document.getElementById("auth-modal");
  modal.classList.remove("hidden");
}

document
  .getElementById("close-modal")
  .addEventListener("click", closeAuthModal);

async function syncUserProfile(user) {
  // Fetch or update the user's profile, including currency, items, etc.
  // This can be done by calling your backend and storing the response in local storage or state
}
