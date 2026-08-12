// ==========================================
// CAMPUS SKILLSWAP - FIREBASE CONFIG
// ==========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEQFQE5C47d-2iy3hgcMbPPMwoGFtdNbA",
    authDomain: "campusskillswap-b7a5d.firebaseapp.com",
    projectId: "campusskillswap-b7a5d",
    storageBucket: "campusskillswap-b7a5d.firebasestorage.app",
    messagingSenderId: "729251992860",
    appId: "1:729251992860:web:999c8d6a71058f897b96d9",
    measurementId: "G-DFKTCZPCJE"
};

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

// Make Firebase Auth available globally
window.firebaseAuth = auth;

console.log(
"Firebase initialized successfully"
);
