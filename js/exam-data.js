/* ============================================\n   NIGERIAN EXAM PORTAL - QUESTION DATABASE\n   ============================================ */

const examDatabase = {
    jamb: {
        subjects: {
            english: [
                {
                    question: "Choose the option nearest in meaning to the underlined word: The student's performance was <u>exemplary</u>.",
                    options: ["Poor", "Commendable", "Average", "Deplorable"],
                    correctAnswer: "Commendable"
                },
                {
                    question: "Which of these is a synonym for 'Abundant'?",
                    options: ["Scarce", "Plentiful", "Minimal", "Limited"],
                    correctAnswer: "Plentiful"
                }
            ],
            mathematics: [
                {
                    question: "Solve for x: 2x + 5 = 15",
                    options: ["5", "10", "15", "20"],
                    correctAnswer: "5"
                }
            ]
        }
    },
    waec: {
        subjects: {
            physics: [
                {
                    question: "What is the SI unit of force?",
                    options: ["Joule", "Newton", "Watt", "Pascal"],
                    correctAnswer: "Newton"
                }
            ]
        }
    }
};

/**
 * Retrieves questions based on exam type and subject
 */
function getQuestions(examType, subject) {
    if (!examType || !subject) return [];
    const type = examType.toLowerCase();
    const sub = subject.toLowerCase();
    return examDatabase[type]?.subjects[sub] || [];
}

/**
 * Returns exam duration in seconds
 */
function getExamDuration(examType, subject) {
    const durations = {
        jamb: 3600, // 1 hour
        waec: 5400, // 1.5 hours
        neco: 5400,
        default: 3600
    };
    return durations[examType.toLowerCase()] || durations.default;
}

/**
 * Randomizes order of questions
 */
function shuffleQuestions(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

/**
 * Randomizes order of options within a question
 */
function shuffleOptions(questionObj) {
    const shuffledOptions = [...questionObj.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return { ...questionObj, options: shuffledOptions };
}