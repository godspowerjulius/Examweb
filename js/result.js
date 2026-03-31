// js/result.js

const RESULTS_KEY = "examPortalResults";

function getAllResults() {
  return getFromStorage(RESULTS_KEY, []);
}

function saveAllResults(results) {
  saveToStorage(RESULTS_KEY, results);
}

function calculateScore(questions, userAnswers) {
  let score = 0;

  questions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      score++;
    }
  });

  const total = questions.length;
  const percentage = calculatePercentage(score, total);
  const status = getPerformanceStatus(percentage);

  return { score, total, percentage, status };
}

function calculatePercentage(score, total) {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

function getPerformanceStatus(percentage) {
  if (percentage >= 70) return "Excellent";
  if (percentage >= 50) return "Pass";
  return "Fail";
}

function saveExamResult(resultData) {
  const results = getAllResults();
  results.push(resultData);
  saveAllResults(results);
  saveToStorage("latestExamResult", resultData);
}

function getUserResults(userId) {
  return getAllResults().filter((result) => result.userId === userId);
}

function getLatestResult() {
  return getFromStorage("latestExamResult", null);
}

function renderResultPage() {
  const result = getLatestResult();
  if (!result) return;

  const studentNameEl = document.getElementById("studentName");
  const examTypeEl = document.getElementById("examType");
  const subjectEl = document.getElementById("subject");
  const scoreEl = document.getElementById("score");
  const totalEl = document.getElementById("total");
  const percentageEl = document.getElementById("percentage");
  const statusEl = document.getElementById("status");
  const dateEl = document.getElementById("examDate");

  if (studentNameEl) studentNameEl.textContent = getCurrentUser()?.fullName || "Student";
  if (examTypeEl) examTypeEl.textContent = result.examType.toUpperCase();
  if (subjectEl) subjectEl.textContent = result.subject.toUpperCase();
  if (scoreEl) scoreEl.textContent = result.score;
  if (totalEl) totalEl.textContent = result.total;
  if (percentageEl) percentageEl.textContent = `${result.percentage}%`;
  if (statusEl) statusEl.textContent = result.status;
  if (dateEl) dateEl.textContent = new Date(result.submittedAt).toLocaleString();
}

function renderReviewPage() {
  const result = getLatestResult();
  const reviewContainer = document.getElementById("reviewContainer");
  if (!result || !reviewContainer) return;

  reviewContainer.innerHTML = result.questions
    .map((question, index) => {
      const selected = result.answers[index];
      const correct = question.correctAnswer;
      const isCorrect = selected === correct;

      return `
        <div class="bg-white rounded-2xl shadow p-5 mb-5 border">
          <h3 class="font-semibold text-lg mb-3">Q${index + 1}: ${question.question}</h3>
          <p class="mb-2"><strong>Your Answer:</strong> 
            <span class="${isCorrect ? "text-green-600" : "text-red-600"}">
              ${selected || "Not Answered"}
            </span>
          </p>
          <p><strong>Correct Answer:</strong> <span class="text-green-600">${correct}</span></p>
        </div>
      `;
    })
    .join("");
}