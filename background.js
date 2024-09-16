// background.js

// Load the Supabase library dynamically

self.importScripts(
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/dist/supabase-js.min.js"
);

// Initialize Supabase after the script is loaded
const supabaseUrl = "https://ftcdspasmjupvnrdqlmh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Y2RzcGFzbWp1cHZucmRxbG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2OTg1ODAsImV4cCI6MjA0MDI3NDU4MH0.RVvXNVTRnQERM31wwS03aE0C9CdxuCd8zVpt2qS9HL4";

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase initialized in the background service worker.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);

  // Example message handling
  if (message.type === "SIGN_IN") {
    // Your sign-in logic with Supabase
    supabase.auth
      .signIn({ email: message.email, password: message.password })
      .then(({ user, session, error }) => {
        if (error) {
          sendResponse({ status: "error", data: error.message });
        } else {
          sendResponse({ status: "success", data: user });
        }
      });
  } else {
    sendResponse({ status: "error", data: "Unknown request type" });
  }

  return true; // Keeps the message channel open for the asynchronous response
});

console.log("Background service worker is running...");
