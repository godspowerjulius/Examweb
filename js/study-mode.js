/* ============================================
   STUDY MODE CONTROLLER
   ============================================ */

import { 
    getQuestionsByExam, 
    getQuestionsBySubject,
    calculateScore 
} from './questions.js';

class StudyMode {
    constructor(examType, subject = null) {
        this.examType = examType;
        this.subject = subject;
        this.questions = [];
        this.currentIndex = 0;
        this.studyNotes = {};
    }

    async loadQuestions() {
        if (this.subject) {
            this.questions = await getQuestionsBySubject(this.examType, this.subject);
        } else {
            this.questions = await getQuestionsByExam(this.examType);
        }
        console.log(`📚 Loaded ${this.questions.length} questions for study mode`);
        return this.questions;
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

    addNote(questionId, note) {
        this.studyNotes[questionId] = note;
        localStorage.setItem(`study-note-${questionId}`, note);
    }

    getNote(questionId) {
        return this.studyNotes[questionId] || localStorage.getItem(`study-note-${questionId}`) || '';
    }

    getProgress() {
        return {
            current: this.currentIndex + 1,
            total: this.questions.length,
            percentage: Math.round(((this.currentIndex + 1) / this.questions.length) * 100)
        };
    }
}

export { StudyMode };
