// js/cbt-engine.js

let examState = {
  examType: null,
  subject: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeLeft: 0,
  timerInterval: null,
  startedAt: null
};

function initializeExam(examType, subject) {
  const questions = getQuestions(examType, subject).map(shuffleOptions);

  if (!questions.length) {
    alert("No questions found for this exam/subject.");
    window.location.href = "dashboard.html";
    return;
  }

  examState.examType = examType;
  examState.subject = subject;
  examState.questions = shuffleQuestions(questions);
  examState.currentQuestionIndex = 0;
  examState.answers = new Array(questions.length).fill(null);
  examState.timeLeft = getExamDuration(examType, subject);
  examState.startedAt = new Date().toISOString();

  saveExamSession();
  renderQuestion();
  updateQuestionTracker();
  updateProgressBar();
  startExamTimer(examState.timeLeft);
}

function renderQuestion() {
  const questionBox = document.getElementById("questionBox");
  const optionsBox = document.getElementById("optionsBox");
  const questionNumber = document.getElementById("questionNumber");
  const examTitle = document.getElementById("examTitle");

  if (!questionBox || !optionsBox) return;

  const currentQuestion = examState.questions[examState.currentQuestionIndex];

  if (questionNumber) {
    questionNumber.textContent = `Question ${examState.currentQuestionIndex + 1} of ${examState.questions.length}`;
  }

  if (examTitle) {
    examTitle.textContent = `${examState.examType.toUpperCase()} - ${examState.subject.toUpperCase()}`;
  }

  questionBox.textContent = currentQuestion.question;

  optionsBox.innerHTML = currentQuestion.options
    .map((option, index) => {
      const isSelected = examState.answers[examState.currentQuestionIndex] === option;
      return `
        <button
          class="w-full text-left p-4 rounded-xl border mb-3 transition ${
            isSelected ? "bg-indigo-100 border-indigo-500" : "bg-white border-gray-300 hover:bg-gray-50"
          }"
          onclick="selectAnswer('${option.replace(/'/g, "\\'")}')"
        >
          <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
        </button>
      `;
    })
    .join("");
}

function selectAnswer(option) {
  examState.answers[examState.currentQuestionIndex] = option;
  saveExamSession();
  renderQuestion();
  updateQuestionTracker();
  updateProgressBar();
}

function goToNextQuestion() {
  if (examState.currentQuestionIndex < examState.questions.length - 1) {
    examState.currentQuestionIndex++;
    saveExamSession();
    renderQuestion();
    updateQuestionTracker();
    updateProgressBar();
  }
}

function goToPreviousQuestion() {
  if (examState.currentQuestionIndex > 0) {
    examState.currentQuestionIndex--;
    saveExamSession();
    renderQuestion();
    updateQuestionTracker();
    updateProgressBar();
  }
}

function jumpToQuestion(index) {
  examState.currentQuestionIndex = index;
  saveExamSession();
  renderQuestion();
  updateQuestionTracker();
  updateProgressBar();
}

function updateQuestionTracker() {
  const tracker = document.getElementById("questionTracker");
  if (!tracker) return;

  tracker.innerHTML = examState.questions
    .map((_, index) => {
      const answered = examState.answers[index] !== null;
      const active = index === examState.currentQuestionIndex;

      let classes = "w-10 h-10 rounded-lg text-sm font-semibold ";

      if (active) {
        classes += "bg-indigo-600 text-white ";
      } else if (answered) {
        classes += "bg-green-100 text-green-700 ";
      } else {
        classes += "bg-gray-200 text-gray-700 ";
      }

      return `
        <button class="${classes}" onclick="jumpToQuestion(${index})">
          ${index + 1}
        </button>
      `;
    })
    .join("");
}

function updateProgressBar() {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;

  const answeredCount = examState.answers.filter((a) => a !== null).length;
  const percentage = (answeredCount / examState.questions.length) * 100;
  progressBar.style.width = `${percentage}%`;
}

function confirmSubmission() {
  const confirmed = confirm