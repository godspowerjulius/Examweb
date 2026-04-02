/* ============================================
   EXAM MODE CONTROLLER
   ============================================ */

import { 
    getRandomQuestions,
    calculateScore 
} from './questions.js';

class ExamMode {
    constructor(examType, durationMinutes = 120, questionCount = 40) {
        this.examType = examType;
        this.durationMinutes = durationMinutes;
        this.questionCount = questionCount;
        this.questions = [];
        this.currentIndex = 0;
        this.answers = {};
        this.flaggedQuestions = new Set();
        this.startTime = null;
        this.endTime = null;
        this.isSubmitted = false;
    }

    async startExam() {
        this.questions = await getRandomQuestions(this.examType, this.questionCount);
        this.startTime = Date.now();
        this.endTime = this.startTime + (this.durationMinutes * 60 * 1000);
        console.log(`🎯 Exam started with ${this.questions.length} questions`);
        return this.questions;
    }

    recordAnswer(questionId, answerIndex) {
        this.answers[questionId] = answerIndex;
    }

    toggleFlag(questionId) {
        if (this.flaggedQuestions.has(questionId)) {
            this.flaggedQuestions.delete(questionId);
        } else {
            this.flaggedQuestions.add(questionId);
        }
    }

    getTimeRemaining() {
        if (!this.endTime) return 0;
        const remaining = Math.max(0, this.endTime - Date.now());
        return Math.ceil(remaining / 1000); // Return seconds
    }

    isTimeUp() {
        return this.getTimeRemaining() === 0;
    }

    submitExam() {
        if (this.isSubmitted) return null;
        
        this.isSubmitted = true;
        const result = calculateScore(this.questions, this.answers);
        
        console.log('📊 Exam Results:', result);
        return {
            ...result,
            examType: this.examType,
            timestamp: new Date().toISOString(),
            flaggedCount: this.flaggedQuestions.size,
            totalAttempted: Object.keys(this.answers).length
        };
    }

    getProgress() {
        return {
            current: this.currentIndex + 1,
            total: this.questions.length,
            answered: Object.keys(this.answers).length,
            flagged: this.flaggedQuestions.size
        };
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false;
    }

    jumpToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentIndex = index;
            return true;
        }
        return false;
    }
}

export { ExamMode };
