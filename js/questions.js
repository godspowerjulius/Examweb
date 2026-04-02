/* ============================================
   QUESTIONS MODULE - FIREBASE INTEGRATION
   ============================================ */

import { 
    db, 
    collection, 
    getDocs, 
    query, 
    where, 
    doc, 
    getDoc 
} from './firebase-config.js';

const QUESTIONS_COLLECTION = "questions";

// GET QUESTIONS BY EXAM TYPE
async function getQuestionsByExam(examType) {
    try {
        const questionsRef = collection(db, QUESTIONS_COLLECTION);
        const q = query(questionsRef, where("examType", "==", examType.toLowerCase()));
        const snapshot = await getDocs(q);
        
        const questions = [];
        snapshot.forEach(doc => {
            questions.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`✅ Loaded ${questions.length} questions for ${examType}`);
        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

// GET QUESTIONS BY SUBJECT
async function getQuestionsBySubject(examType, subject) {
    try {
        const questionsRef = collection(db, QUESTIONS_COLLECTION);
        const q = query(
            questionsRef, 
            where("examType", "==", examType.toLowerCase()),
            where("subject", "==", subject.toLowerCase())
        );
        const snapshot = await getDocs(q);
        
        const questions = [];
        snapshot.forEach(doc => {
            questions.push({ id: doc.id, ...doc.data() });
        });
        
        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

// GET RANDOM QUESTIONS
async function getRandomQuestions(examType, count = 40) {
    try {
        const allQuestions = await getQuestionsByExam(examType);
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    } catch (error) {
        console.error('Error getting random questions:', error);
        return [];
    }
}

// VALIDATE ANSWER
function validateAnswer(question, userAnswer) {
    if (!question) return false;
    return userAnswer === question.correctAnswerIndex;
}

// CALCULATE SCORE
function calculateScore(questions, answers) {
    let correctCount = 0;
    
    Object.keys(answers).forEach(questionId => {
        const question = questions.find(q => q.id === questionId);
        if (question && validateAnswer(question, answers[questionId])) {
            correctCount++;
        }
    });
    
    const percentage = (correctCount / questions.length) * 100;
    return {
        correct: correctCount,
        total: questions.length,
        percentage: Math.round(percentage * 100) / 100
    };
}

export {
    getQuestionsByExam,
    getQuestionsBySubject,
    getRandomQuestions,
    validateAnswer,
    calculateScore
};
