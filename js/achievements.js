// achievements.js

const achievements = {
    firstFeed: { name: "First Feed", description: "Feed your pet for the first time.", earned: false },
    firstPlay: { name: "First Play", description: "Play with your pet for the first time.", earned: false },
    // Add more achievements here
  };
  
  export function checkAchievements() {
    const achievementsList = document.getElementById("achievements-list");
    achievementsList.innerHTML = "";
  
    for (const key in achievements) {
      const achievement = achievements[key];
      const li = document.createElement("li");
      li.textContent = `${achievement.name} - ${achievement.description}`;
      li.classList.add(achievement.earned ? "achievement-earned" : "achievement-pending");
      achievementsList.appendChild(li);
    }
  }
  
  function saveAchievements() {
    chrome.storage.local.set({ achievements });
  }
  
  chrome.storage.local.get("achievements", function (result) {
    if (result.achievements) {
      Object.assign(achievements, result.achievements);
      checkAchievements();
    }
  });
  