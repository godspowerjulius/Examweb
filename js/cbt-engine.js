/* ============================================
   CBT EXAM ENGINE - COMPLETE SYSTEM
   ============================================ */

let examState = {
    examType: null,
    subject: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    flagged: [],
    timeLeft: 0,
    timerInterval: null,
    startedAt: null,
    duration: 0
};

// ============================================
// EXAM INITIALIZATION
// ============================================
function initializeExam(examType, subject, numQuestions = null) {
    // Get questions from admin-added questions
    let questions = getFromStorage("examPortalQuestions", [])
        .filter(q => q.examType === examType && q.subject.toLowerCase() === subject.toLowerCase());

    if (questions.length === 0) {
        showToast('No questions available for this exam/subject', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return false;
    }

    // Limit to numQuestions if specified
    if (numQuestions) {
        questions = questions.slice(0, numQuestions);
    }

    // Shuffle questions
    questions = shuffleArray(questions);

    // Initialize exam state
    examState.examType = examType;
    examState.subject = subject;
    examState.questions = questions;
    examState.currentQuestionIndex = 0;
    examState.answers = new Array(questions.length).fill(null);
    examState.flagged = new Array(questions.length).fill(false);
    
    // Set duration based on exam type
    examState.duration = getExamDuration(examType);
    examState.timeLeft = examState.duration * 60; // Convert to seconds
    examState.startedAt = new Date().toISOString();

    saveExamSession();
    renderQuestion();
    updateQuestionTracker();
    updateProgressBar();
    startExamTimer();

    return true;
}

// ============================================
// QUESTION RENDERING
// ============================================
function renderQuestion() {
    const questionBox = document.getElementById("questionBox");
    const optionsBox = document.getElementById("optionsBox");
    const questionNumber = document.getElementById("questionNumber");

    if (!questionBox || !optionsBox) return;

    const currentQuestion = examState.questions[examState.currentQuestionIndex];
    const isFlagged = examState.flagged[examState.currentQuestionIndex];

    if (questionNumber) {
        questionNumber.textContent = `Question ${examState.currentQuestionIndex + 1} of ${examState.questions.length}`;
    }

    // Display question text
    questionBox.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <p class="text-lg font-semibold text-gray-900">${currentQuestion.question}</p>
                <p class="text-sm text-gray-500 mt-2">Subject: ${currentQuestion.subject}</p>
            </div>
            <button onclick="flagQuestion()" class="ml-4 ${isFlagged ? 'text-red-600' : 'text-gray-400'} hover:text-red-600">
                <i class="fas fa-flag text-xl"></i>
            </button>
        </div>
    `;

    // Display options
    const options = [currentQuestion.optionA, currentQuestion.optionB, currentQuestion.optionC, currentQuestion.optionD];
    const selectedAnswer = examState.answers[examState.currentQuestionIndex];

    optionsBox.innerHTML = options
        .map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedAnswer === letter;
            return `
                <button
                    onclick="selectAnswer('${letter}')"
                    class="w-full text-left p-4 rounded-xl border-2 mb-3 transition font-semibold text-base ${
                        isSelected
                            ? 'bg-indigo-100 border-indigo-600 text-indigo-900'
                            : 'bg-white border-gray-300 text-gray-900 hover:border-indigo-400 hover:bg-indigo-50'
                    }"
                >
                    <span class="inline-block w-8 h-8 rounded-full mr-3 text-center leading-8 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                    }">${letter}</span>
                    ${option}
                </button>
            `;
        })
        .join("");
}

function selectAnswer(letter) {
    examState.answers[examState.currentQuestionIndex] = letter;
    saveExamSession();
    renderQuestion();
    updateQuestionTracker();
    updateProgressBar();
}

function flagQuestion() {
    examState.flagged[examState.currentQuestionIndex] = !examState.flagged[examState.currentQuestionIndex];
    saveExamSession();
    updateQuestionTracker();
}

// ============================================
// NAVIGATION
// ============================================
function goToNextQuestion() {
    if (examState.currentQuestionIndex < examState.questions.length - 1) {
        examState.currentQuestionIndex++;
        saveExamSession();
        renderQuestion();
        updateQuestionTracker();
        updateProgressBar();
        window.scrollTo(0, 0);
    }
}

function goToPreviousQuestion() {
    if (examState.currentQuestionIndex > 0) {
        examState.currentQuestionIndex--;
        saveExamSession();
        renderQuestion();
        updateQuestionTracker();
        updateProgressBar();
        window.scrollTo(0, 0);
    }
}

function jumpToQuestion(index) {
    examState.currentQuestionIndex = index;
    saveExamSession();
    renderQuestion();
    updateQuestionTracker();
    updateProgressBar();
    window.scrollTo(0, 0);
}

// ============================================
// TIMER
// ============================================
function startExamTimer() {
    updateTimer();
    examState.timerInterval = setInterval(() => {
        examState.timeLeft--;
        updateTimer();

        if (examState.timeLeft <= 0) {
            clearInterval(examState.timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimer() {
    const timerDisplay = document.getElementById("timerDisplay");
    if (!timerDisplay) return;

    const hours = Math.floor(examState.timeLeft / 3600);
    const minutes = Math.floor((examState.timeLeft % 3600) / 60);
    const seconds = examState.timeLeft % 60;

    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = timeString;

    // Color change when time is running out
    if (examState.timeLeft <= 300) { // 5 minutes
        timerDisplay.classList.remove('text-gray-700');
        timerDisplay.classList.add('text-red-600', 'font-bold');
    }
}

function pauseTimer() {
    clearInterval(examState.timerInterval);
    showToast('Timer paused', 'info');
}

function resumeTimer() {
    startExamTimer();
    showToast('Timer resumed', 'info');
}

// ============================================
// PROGRESS TRACKING
// ============================================
function updateQuestionTracker() {
    const tracker = document.getElementById("questionTracker");
    if (!tracker) return;

    tracker.innerHTML = examState.questions
        .map((_, index) => {
            const answered = examState.answers[index] !== null;
            const flagged = examState.flagged[index];
            const active = index === examState.currentQuestionIndex;

            let classes = "w-10 h-10 rounded-lg text-sm font-semibold cursor-pointer transition ";

            if (active) {
                classes += "bg-indigo-600 text-white ring-2 ring-indigo-400";
            } else if (flagged && answered) {
                classes += "bg-orange-500 text-white";
            } else if (flagged) {
                classes += "bg-orange-200 text-orange-700";
            } else if (answered) {
                classes += "bg-green-500 text-white";
            } else {
                classes += "bg-gray-300 text-gray-700 hover:bg-gray-400";
            }

            return `
                <button class="${classes}" onclick="jumpToQuestion(${index})" title="Question ${index + 1}">
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
    progressBar.textContent = `${answeredCount}/${examState.questions.length} Answered`;
}

// ============================================
// SESSION MANAGEMENT
// ============================================
function saveExamSession() {
    saveToStorage("currentExamSession", examState);
}

function loadExamSession() {
    const session = getFromStorage("currentExamSession");
    if (session) {
        examState = session;
        return true;
    }
    return false;
}

function clearExamSession() {
    removeFromStorage("currentExamSession");
}

// ============================================
// EXAM SUBMISSION
// ============================================
function submitExam() {
    clearInterval(examState.timerInterval);

    const answeredCount = examState.answers.filter(a => a !== null).length;
    const confirmed = confirm(`You have answered ${answeredCount} out of ${examState.questions.length} questions.\n\nAre you sure you want to submit?`);

    if (!confirmed) {
        startExamTimer();
        return;
    }

    // Calculate score
    let score = 0;
    const results = [];

    examState.questions.forEach((question, index) => {
        const userAnswer = examState.answers[index];
        const correctAnswer = question.correctAnswer;
        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) score++;

        results.push({
            questionIndex: index + 1,
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            subject: question.subject
        });
    });

    const percentage = Math.round((score / examState.questions.length) * 100);
    const status = percentage >= 70 ? "Excellent" : percentage >= 50 ? "Pass" : "Fail";

    // Save result
    const result = {
        id: 'result_' + Date.now(),
        userId: getCurrentUser().id,
        examType: examState.examType,
        subject: examState.subject,
        questions: examState.questions,
        answers: examState.answers,
        score: score,
        total: examState.questions.length,
        percentage: percentage,
        status: status,
        results: results,
        submittedAt: new Date().toISOString(),
        duration: examState.duration,
        timeSpent: Math.floor((new Date() - new Date(examState.startedAt)) / 1000)
    };

    // Save to storage
    const allResults = getFromStorage("examPortalResults", []);
    allResults.push(result);
    saveToStorage("examPortalResults", allResults);
    saveToStorage("latestExamResult", result);

    clearExamSession();

    // Redirect to results page
    window.location.href = `exam-results.html?resultId=${result.id}`;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getExamDuration(examType) {
    const durations = {
        'jamb': 120,      // 2 hours
        'waec': 180,      // 3 hours
        'neco': 180,      // 3 hours
        'ijmb': 150,      // 2.5 hours
        'post-utme': 120, // 2 hours
        'other-exams': 120
    };
    return durations[examType] || 120;
}

function getQuestionsByExam(examType) {
    return getFromStorage("examPortalQuestions", [])
        .filter(q => q.examType === examType);
}

function getSubjectsByExam(examType) {
    const questions = getQuestionsByExam(examType);
    const subjects = [...new Set(questions.map(q => q.subject.toLowerCase()))];
    return subjects;
}