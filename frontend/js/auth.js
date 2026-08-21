// ==========================================
// CAMPUS SKILLSWAP - AUTH.JS
// Firebase Authentication
// Spring Boot Authentication
// JWT + Role Based Authentication
// ==========================================

import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ==========================================
// API
// ==========================================

const API_BASE_URL = "http://localhost:8081/api";


// ==========================================
// MESSAGE
// ==========================================

function showMessage(elementId, message, type) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = "message " + type;
}


// ==========================================
// PASSWORD TOGGLE
// ==========================================

function togglePassword(inputId, button) {

    const input =
        document.getElementById(inputId);

    if (!input || !button) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";

    } else {

        input.type = "password";
        button.textContent = "👁";

    }
}

window.togglePassword = togglePassword;


// ==========================================
// CHECK FIREBASE
// ==========================================

function checkFirebaseAuth() {

    if (!auth) {

        throw new Error(
            "Firebase is not initialized."
        );

    }

    return auth;
}


// ==========================================
// NORMALIZE ROLE
// ==========================================

function normalizeRole(role) {

    if (!role) {
        return "STUDENT";
    }

    return String(role)
        .trim()
        .toUpperCase();
}


// ==========================================
// SAVE LOGIN DATA
// ==========================================

function saveAuthData(
    token,
    firebaseToken,
    email,
    role,
    userId
) {

    const normalizedRole =
        normalizeRole(role);


    // ======================================
    // JWT TOKEN
    // ======================================

    localStorage.setItem(
        "token",
        token
    );


    // ======================================
    // FIREBASE TOKEN
    // ======================================

    localStorage.setItem(
        "firebaseToken",
        firebaseToken
    );


    // ======================================
    // EMAIL
    // ======================================

    localStorage.setItem(
        "userEmail",
        email
    );


    // ======================================
    // ROLE
    // ======================================

    localStorage.setItem(
        "role",
        normalizedRole
    );


    // Remove duplicate old role
    localStorage.removeItem(
        "userRole"
    );


    // ======================================
    // USER ID
    // ======================================

    if (
        userId !== null &&
        userId !== undefined &&
        userId !== ""
    ) {

        localStorage.setItem(
            "userId",
            String(userId)
        );

    }


    // ======================================
    // DEBUG
    // ======================================

    console.log(
        "================================="
    );

    console.log(
        "AUTH DATA SAVED"
    );

    console.log(
        "Email:",
        email
    );

    console.log(
        "User ID:",
        userId
    );

    console.log(
        "Role:",
        normalizedRole
    );

    console.log(
        "Token:",
        !!token
    );

    console.log(
        "Firebase Token:",
        !!firebaseToken
    );

    console.log(
        "================================="
    );
}


// ==========================================
// LOGIN FORM
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "loginEmail"
                );


            const passwordInput =
                document.getElementById(
                    "loginPassword"
                );


            const button =
                document.getElementById(
                    "loginButton"
                );


            if (
                !emailInput ||
                !passwordInput
            ) {

                return;

            }


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!email || !password) {

                showMessage(
                    "loginMessage",
                    "Please enter email and password.",
                    "error"
                );

                return;

            }


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Logging in...";

            }


            try {

                // ==================================
                // FIREBASE LOGIN
                // ==================================

                const firebaseAuth =
                    checkFirebaseAuth();


                console.log(
                    "Firebase login started..."
                );


                const firebaseResult =
                    await signInWithEmailAndPassword(
                        firebaseAuth,
                        email,
                        password
                    );


                const firebaseUser =
                    firebaseResult.user;


                console.log(
                    "Firebase login successful:",
                    firebaseUser.email
                );


                // ==================================
                // FIREBASE TOKEN
                // ==================================

                const firebaseToken =
                    await firebaseUser.getIdToken(
                        true
                    );


                console.log(
                    "Firebase token received."
                );


                // ==================================
                // BACKEND LOGIN
                // ==================================

                console.log(
                    "Backend login started..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/login`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email:
                                        email,

                                    password:
                                        password

                                })

                        }
                    );


                const responseText =
                    await response.text();


                console.log(
                    "Backend Status:",
                    response.status
                );


                console.log(
                    "Backend Response:",
                    responseText
                );


                // ==================================
                // RESPONSE CHECK
                // ==================================

                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Backend login failed."
                    );

                }


                // ==================================
                // PARSE RESPONSE
                // ==================================

                let data;


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (error) {

                    data =
                        responseText;

                }


                console.log(
                    "Parsed login response:",
                    data
                );


                // ==================================
                // GET BACKEND TOKEN
                // ==================================

                let backendToken = null;


                if (
                    typeof data === "string"
                ) {

                    backendToken =
                        data;

                } else if (data) {

                    backendToken =
                        data.token ||
                        data.accessToken ||
                        data.jwt;

                }


                // ==================================
                // TOKEN VALIDATION
                // ==================================

                if (!backendToken) {

                    throw new Error(
                        "Backend JWT token was not received."
                    );

                }


                backendToken =
                    String(
                        backendToken
                    ).trim();


                // ==================================
                // GET ROLE
                // ==================================

                let role = null;


                if (
                    typeof data === "object" &&
                    data
                ) {

                    role =
                        data.role ||
                        data.userRole ||
                        data.user?.role;

                }


                if (!role) {

                    console.warn(
                        "Backend did not return role. Using STUDENT."
                    );

                    role =
                        "STUDENT";

                }


                role =
                    normalizeRole(
                        role
                    );


                // ==================================
                // GET USER ID
                // ==================================

                let userId = null;


                if (
                    typeof data === "object" &&
                    data
                ) {

                    userId =
                        data.userId ||
                        data.id ||
                        data.user?.id ||
                        data.user?.userId;

                }


                console.log(
                    "Backend User ID:",
                    userId
                );


                // ==================================
                // USER ID VALIDATION
                // ==================================

                if (
                    userId === null ||
                    userId === undefined ||
                    userId === ""
                ) {

                    console.error(
                        "Backend did not return userId."
                    );


                    throw new Error(
                        "Login successful but User ID was not received from backend."
                    );

                }


                // ==================================
                // SAVE AUTH DATA
                // ==================================

                saveAuthData(
                    backendToken,
                    firebaseToken,
                    firebaseUser.email,
                    role,
                    userId
                );


                // ==================================
                // SUCCESS MESSAGE
                // ==================================

                showMessage(
                    "loginMessage",
                    "Login successful! Redirecting...",
                    "success"
                );


                if (button) {

                    button.textContent =
                        "Login Successful ✓";

                }


                // ==================================
                // FINAL LOGIN CHECK
                // ==================================

                setTimeout(
                    function () {

                        const savedToken =
                            localStorage.getItem(
                                "token"
                            );


                        const savedRole =
                            (
                                localStorage.getItem(
                                    "role"
                                ) ||
                                "STUDENT"
                            )
                            .trim()
                            .toUpperCase();


                        const savedEmail =
                            localStorage.getItem(
                                "userEmail"
                            );


                        const savedUserId =
                            localStorage.getItem(
                                "userId"
                            );


                        console.log(
                            "========== FINAL LOGIN CHECK =========="
                        );

                        console.log(
                            "TOKEN:",
                            savedToken
                        );

                        console.log(
                            "ROLE:",
                            savedRole
                        );

                        console.log(
                            "EMAIL:",
                            savedEmail
                        );

                        console.log(
                            "USER ID:",
                            savedUserId
                        );

                        console.log(
                            "========================================"
                        );


                        // ==================================
                        // TOKEN CHECK
                        // ==================================

                        if (!savedToken) {

                            console.error(
                                "TOKEN NOT SAVED!"
                            );


                            showMessage(
                                "loginMessage",
                                "Login succeeded but token was not saved.",
                                "error"
                            );


                            if (button) {

                                button.disabled =
                                    false;

                                button.textContent =
                                    "Login";

                            }


                            return;

                        }


                        // ==================================
                        // USER ID CHECK
                        // ==================================

                        if (!savedUserId) {

                            console.error(
                                "USER ID NOT SAVED!"
                            );


                            showMessage(
                                "loginMessage",
                                "Login succeeded but User ID was not saved.",
                                "error"
                            );


                            if (button) {

                                button.disabled =
                                    false;

                                button.textContent =
                                    "Login";

                            }


                            return;

                        }


                        // ==================================
                        // ADMIN REDIRECT
                        // ==================================

                        if (
                            savedRole ===
                            "ADMIN"
                        ) {

                            console.log(
                                "ADMIN → admin-dashboard.html"
                            );


                            window.location.replace(
                                "admin-dashboard.html"
                            );


                        }

                        // ==================================
                        // STUDENT REDIRECT
                        // ==================================

                        else {

                            console.log(
                                "STUDENT → dashboard.html"
                            );


                            window.location.replace(
                                "dashboard.html"
                            );

                        }

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                let message =
                    "Unable to login.";


                // ==================================
                // FIREBASE ERRORS
                // ==================================

                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    message =
                        "Invalid email or password.";

                }

                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No account found with this email.";

                }

                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Incorrect password.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address.";

                }

                else if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    message =
                        "Too many login attempts. Try again later.";

                }

                else if (
                    error.message
                ) {

                    message =
                        error.message;

                }


                showMessage(
                    "loginMessage",
                    message,
                    "error"
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Login";

                }

            }

        }
    );

}


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "registerUsername"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value.trim();


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value.trim();


            const roleElement =
                document.getElementById(
                    "registerRole"
                );


            const role =
                roleElement
                    ? roleElement.value
                    : "";


            const button =
                document.getElementById(
                    "registerButton"
                );


            // ==================================
            // VALIDATION
            // ==================================

            if (
                !username ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "registerMessage",
                    "Please fill in all fields.",
                    "error"
                );

                return;

            }


            if (!role) {

                showMessage(
                    "registerMessage",
                    "Please select your role.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "registerMessage",
                    "Password must be at least 6 characters.",
                    "error"
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "registerMessage",
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "Creating Account...";

            }


            try {

                // ==================================
                // FIREBASE
                // ==================================

                const firebaseAuth =
                    checkFirebaseAuth();


                const firebaseResult =
                    await createUserWithEmailAndPassword(
                        firebaseAuth,
                        email,
                        password
                    );


                const firebaseUser =
                    firebaseResult.user;


                console.log(
                    "Firebase registration successful."
                );


                // ==================================
                // FIREBASE TOKEN
                // ==================================

                const firebaseToken =
                    await firebaseUser.getIdToken(
                        true
                    );


                // ==================================
                // BACKEND REGISTER
                // ==================================

                const normalizedRole =
                    normalizeRole(
                        role
                    );


                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/register`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username:
                                        username,

                                    email:
                                        email,

                                    password:
                                        password,

                                    role:
                                        normalizedRole

                                })

                        }
                    );


                const responseText =
                    await response.text();


                console.log(
                    "Register Status:",
                    response.status
                );


                console.log(
                    "Register Response:",
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Backend registration failed."
                    );

                }


                // ==================================
                // FIREBASE SIGN OUT
                // ==================================

                await signOut(
                    firebaseAuth
                );


                // ==================================
                // CLEAR AUTH DATA
                // ==================================

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "firebaseToken"
                );

                localStorage.removeItem(
                    "userEmail"
                );

                localStorage.removeItem(
                    "role"
                );

                localStorage.removeItem(
                    "userRole"
                );

                localStorage.removeItem(
                    "userId"
                );


                // ==================================
                // SUCCESS
                // ==================================

                showMessage(
                    "registerMessage",
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                if (button) {

                    button.textContent =
                        "Account Created ✓";

                }


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );


                let message =
                    "Unable to create account.";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "This email is already registered.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Invalid email address.";

                }

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Password is too weak.";

                }

                else if (
                    error.code ===
                    "auth/operation-not-allowed"
                ) {

                    message =
                        "Email/Password authentication is not enabled in Firebase.";

                }

                else if (
                    error.message
                ) {

                    message =
                        error.message;

                }


                showMessage(
                    "registerMessage",
                    message,
                    "error"
                );


                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Create Account";

                }

            }

        }
    );

}
