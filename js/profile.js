// js/profile.js

function getUserBestScore(userId) {
  const results = getUserResults(userId);
  if (!results.length) return 0;
  return Math.max(...results.map((r) => r.percentage));
}

function getUserExamCount(userId) {
  return getUserResults(userId).length;
}

function loadProfileData() {
  const user = getCurrentUser();
  if (!user) return;

  renderProfile();
}

function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const bestScore = getUserBestScore(user.id);
  const examCount = getUserExamCount(user.id);

  const fullNameEl = document.getElementById("profileFullName");
  const usernameEl = document.getElementById("profileUsername");
  const emailEl = document.getElementById("profileEmail");
  const levelEl = document.getElementById("profileLevel");
  const examsTakenEl = document.getElementById("profileExamsTaken");
  const bestScoreEl = document.getElementById("profileBestScore");

  if (fullNameEl) fullNameEl.textContent = user.fullName;
  if (usernameEl) usernameEl.textContent = user.username;
  if (emailEl) emailEl.textContent = user.email;
  if (levelEl) levelEl.textContent = user.level || "Not set";
  if (examsTakenEl) examsTakenEl.textContent = examCount;
  if (bestScoreEl) bestScoreEl.textContent = `${bestScore}%`;
}

function saveProfileChanges() {
  const fullName = document.getElementById("editFullName")?.value.trim();
  const username = document.getElementById("editUsername")?.value.trim();
  const email = document.getElementById("editEmail")?.value.trim();
  const level = document.getElementById("editLevel")?.value.trim();

  const result = updateUserProfile({
    fullName,
    username,
    email,
    level
  });

  alert(result.message);

  if (result.success) {
    renderProfile();
  }
}