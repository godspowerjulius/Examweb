/* ============================================
   ADMIN DASHBOARD - MAIN LOGIC
   ============================================ */

const ADMIN_KEY = "examPortalAdmin";
const USERS_KEY = "examPortalUsers";
const QUESTIONS_KEY = "examPortalQuestions";
const PAYMENTS_KEY = "examPortalPayments";

// ============================================
// ADMIN AUTHENTICATION
// ============================================
function isAdmin() {
    const user = getCurrentUser();
    if (!user) return false;
    return user.isAdmin === true || user.role === 'admin';
}

function checkAdminAccess() {
    if (!isAdmin()) {
        showToast('Admin access required', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    return true;
}

// ============================================
// USER MANAGEMENT
// ============================================
function getAllUsers() {
    return getFromStorage(USERS_KEY, []);
}

function getUserStats() {
    const users = getAllUsers();
    const results = getFromStorage("examPortalResults", []);
    
    return {
        totalUsers: users.length,
        activeToday: users.filter(u => {
            const lastActive = new Date(u.lastActive || u.createdAt);
            const today = new Date();
            return lastActive.toDateString() === today.toDateString();
        }).length,
        totalExamsTaken: results.length,
        averageScore: results.length > 0 
            ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
            : 0
    };
}

function getUserLoginHistory() {
    const users = getAllUsers();
    return users.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        level: user.level,
        registeredAt: new Date(user.createdAt).toLocaleDateString(),
        lastLogin: new Date(user.lastActive || user.createdAt).toLocaleDateString()
    }));
}

// ============================================
// QUESTION MANAGEMENT
// ============================================
function getAllQuestions() {
    return getFromStorage(QUESTIONS_KEY, []);
}

function addQuestion(questionData) {
    const questions = getAllQuestions();
    const newQuestion = {
        id: "q_" + Date.now(),
        ...questionData,
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser().id
    };
    questions.push(newQuestion);
    saveToStorage(QUESTIONS_KEY, questions);
    return { success: true, message: "Question added successfully", data: newQuestion };
}

function updateQuestion(questionId, updates) {
    const questions = getAllQuestions();
    const index = questions.findIndex(q => q.id === questionId);
    
    if (index === -1) {
        return { success: false, message: "Question not found" };
    }
    
    questions[index] = { ...questions[index], ...updates, updatedAt: new Date().toISOString() };
    saveToStorage(QUESTIONS_KEY, questions);
    return { success: true, message: "Question updated successfully" };
}

function deleteQuestion(questionId) {
    let questions = getAllQuestions();
    questions = questions.filter(q => q.id !== questionId);
    saveToStorage(QUESTIONS_KEY, questions);
    return { success: true, message: "Question deleted successfully" };
}

function getQuestionsByExam(examType) {
    const questions = getAllQuestions();
    return questions.filter(q => q.examType === examType);
}

function getQuestionStats() {
    const questions = getAllQuestions();
    const exams = ['jamb', 'waec', 'neco', 'ijmb', 'post-utme', 'other-exams'];
    
    let stats = {
        total: questions.length,
        byExam: {}
    };
    
    exams.forEach(exam => {
        stats.byExam[exam] = questions.filter(q => q.examType === exam).length;
    });
    
    return stats;
}

// ============================================
// PAYMENT TRACKING
// ============================================
function getAllPayments() {
    return getFromStorage(PAYMENTS_KEY, []);
}

function addPayment(paymentData) {
    const payments = getAllPayments();
    const newPayment = {
        id: "pay_" + Date.now(),
        ...paymentData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    saveToStorage(PAYMENTS_KEY, payments);
    return { success: true, message: "Payment recorded", data: newPayment };
}

function updatePaymentStatus(paymentId, status) {
    const payments = getAllPayments();
    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) {
        return { success: false, message: "Payment not found" };
    }
    
    payment.status = status;
    payment.updatedAt = new Date().toISOString();
    saveToStorage(PAYMENTS_KEY, payments);
    return { success: true, message: "Payment status updated" };
}

function getPaymentStats() {
    const payments = getAllPayments();
    
    return {
        total: payments.length,
        pending: payments.filter(p => p.status === 'pending').length,
        completed: payments.filter(p => p.status === 'completed').length,
        failed: payments.filter(p => p.status === 'failed').length,
        totalRevenue: payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + (p.amount || 0), 0)
    };
}

// ============================================
// ACTIVITY LOGGING
// ============================================
function logActivity(action, details) {
    const logs = getFromStorage("adminActivityLogs", []);
    logs.push({
        id: "log_" + Date.now(),
        action,
        details,
        admin: getCurrentUser().fullName,
        timestamp: new Date().toISOString()
    });
    saveToStorage("adminActivityLogs", logs);
}

function getActivityLogs(limit = 20) {
    const logs = getFromStorage("adminActivityLogs", []);
    return logs.slice(-limit).reverse();
}