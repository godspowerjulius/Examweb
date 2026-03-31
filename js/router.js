// js/router.js

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function navigateToPage(page, params = {}) {
  const query = new URLSearchParams(params).toString();
  window.location.href = query ? `${page}?${query}` : page;
}

function getCurrentExamType() {
  return getQueryParam("exam");
}

function getCurrentSubject() {
  return getQueryParam("subject");
}

function redirectIfInvalidExam() {
  const exam = getCurrentExamType();
  const validExams = ["ijmb", "waec", "jamb", "neco", "post-utme", "other"];

  if (exam && !validExams.includes(exam)) {
    window.location.href = "dashboard.html";
  }
}