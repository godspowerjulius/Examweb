// js/dashboard.js

function getCompletedExams(userId) {
  return getUserResults(userId);
}

function getPendingExams(userId) {
  const results = getCompletedExams(userId);
  const completedPairs = results.map((r) => `${r.examType}-${r.subject}`);

  let allPairs = [];

  // Ensure examDatabase exists before looping
  if (typeof examDatabase !== 'undefined') {
    Object.keys(examDatabase).forEach((examType) => {
      Object.keys(examDatabase[examType].subjects).forEach((subject) => {
        allPairs.push(`${examType}-${subject}`);
      });
    });
  }

  return allPairs.filter((pair) => !completedPairs.includes(pair));
}

function getRecentActivity(userId) {
  const results = getUserResults(userId);
  return results.slice(-5).reverse();
}

// MAIN ENTRY POINT - Called after guard checks pass
function loadDashboard() {
  const user = getCurrentUser();
  if (!user) {
    console.error("Dashboard.js: No user found in session.");
    return;
  }

  console.log("Dashboard.js: Loading dashboard for", user.fullName);
  updateUserName(user);
  renderDashboardStats(user);
  renderRecentResults(user);
}

// Update welcome message with user's name
function updateUserName(user) {
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.textContent = user.fullName.split(' ')[0]; // Show first name
  }
}

// Render statistics cards
function renderDashboardStats(user) {
  const completed = getCompletedExams(user.id);
  const pending = getPendingExams(user.id);
  
  // Calculate average score
  const avgScore = completed.length
    ? Math.round(
        completed.reduce((sum, r) => sum + r.percentage, 0) / completed.length
      )
    : 0;
  
  // Get best score
  const bestScore = completed.length
    ? Math.max(...completed.map((r) => r.percentage))
    : 0;

  // Update stats cards
  const examsEl = document.getElementById('statExams');
  const avgEl = document.getElementById('statAverage');
  const bestEl = document.getElementById('statBest');
  const streakEl = document.getElementById('statStreak');

  if (examsEl) examsEl.textContent = completed.length;
  if (avgEl) avgEl.textContent = `${avgScore}%`;
  if (bestEl) bestEl.textContent = `${bestScore}%`;
  if (streakEl) {
    // Calculate study streak (days)
    const streak = calculateStudyStreak(completed);
    streakEl.innerHTML = `${streak}<span class="text-sm font-normal text-gray-500"> days</span>`;
  }
}

// Calculate study streak based on recent results
function calculateStudyStreak(results) {
  if (results.length === 0) return 0;

  // Sort results by date (most recent first)
  const sorted = results.sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let result of sorted) {
    const resultDate = new Date(result.submittedAt);
    resultDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate - resultDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Render recent exam results
function renderRecentResults(user) {
  const recent = getRecentActivity(user.id);
  const container = document.getElementById('resultsList');

  if (!container) return;

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 sm:py-8 text-gray-500">
        <i class="fas fa-clipboard-list text-3xl sm:text-4xl mb-2 sm:mb-3 text-gray-300"></i>
        <p class="text-sm">No exams taken yet</p>
        <a href="#exam-categories" class="inline-block mt-2 sm:mt-3 text-indigo-600 text-sm font-medium hover:underline">
          Start Your First Exam
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = recent
    .map((result) => {
      const resultDate = new Date(result.submittedAt).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      );

      // Determine score color
      let scoreColor = 'text-red-600';
      if (result.percentage >= 70) scoreColor = 'text-green-600';
      else if (result.percentage >= 50) scoreColor = 'text-yellow-600';

      return `
        <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition">
          <div class="flex-1">
            <p class="text-sm sm:text-base font-semibold text-gray-900">
              ${result.examType.toUpperCase()} - ${result.subject}
            </p>
            <p class="text-xs text-gray-500 mt-1">${resultDate}</p>
          </div>
          <div class="text-right">
            <p class="text-lg sm:text-xl font-bold ${scoreColor}">
              ${result.percentage}%
            </p>
            <p class="text-xs text-gray-500 mt-1">
              ${result.correctAnswers}/${result.totalQuestions}
            </p>
          </div>
        </div>
      `;
    })
    .join('');
}

// Alternative function name for compatibility
function loadDashboardData() {
  loadDashboard();
}