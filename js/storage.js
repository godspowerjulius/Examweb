// js/storage.js

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error parsing storage key "${key}":`, error);
    return fallback;
  }
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

function clearStorageKey(key) {
  localStorage.removeItem(key);
}