// ==========================================
// CAMPUS SKILLSWAP - FIREBASE AUTH.JS
// Firebase Login + Firebase Register
// Spring Boot Backend Integration
// ==========================================

const API_BASE_URL = "http://localhost:8081/api";

// ==========================================
// MESSAGE HELPER
// ==========================================

function showMessage(elementId, message, type) {

    const element = document.getElementById(elementId);

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

    const input = document.getElementById(inputId);

    if (!input) {
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


// Make onclick="togglePassword()" work
window.togglePassword = togglePassword;


// ==========================================
// FIREBASE AUTH HELPER
// ==========================================

async function getFirebaseAuthFunctions() {

    const firebaseAuth = await import(
        "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
    );

    return firebaseAuth;
}


// ==========================================
// FIREBASE AUTH CHECK
// ==========================================

function checkFirebaseAuth() {

    if (!window.firebaseAuth) {

        throw new Error(
            "Firebase is not initialized."
        );
    }

    return window.firebaseAuth;
}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email = document
                .getElementById("loginEmail")
                .value
                .trim();

            const password = document
                .getElementById("loginPassword")
                .value;

            const button = document.getElementById(
                "loginButton"
            );


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


            button.disabled = true;

            button.textContent =
                "Logging in...";


            try {

                // ==================================
                // FIREBASE AUTH
                // ==================================

                const auth = checkFirebaseAuth();

                const {
                    signInWithEmailAndPassword
                } = await getFirebaseAuthFunctions();


                console.log(
                    "Starting Firebase login..."
                );


                const firebaseResult =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const firebaseUser =
                    firebaseResult.user;


                console.log(
                    "Firebase Login Successful:",
                    firebaseUser.email
                );


                // ==================================
                // FIREBASE ID TOKEN
                // ==================================

                const firebaseToken =
                    await firebaseUser.getIdToken();


                console.log(
                    "Firebase ID Token received."
                );


                // ==================================
                // SPRING BOOT LOGIN
                // ==================================

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })
                        }
                    );


                const responseText =
                    await response.text();


                console.log(
                    "Spring Boot Login Status:",
                    response.status
                );


                console.log(
                    "Spring Boot Login Response:",
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        "Firebase login succeeded, but backend login failed."
                    );
                }


                // ==================================
                // GET BACKEND JWT + ROLE
                // ==================================

                let token =
                    responseText.trim();

                let role = null;


                try {

                    const data =
                        JSON.parse(
                            responseText
                        );


                    console.log(
                        "Backend Login Data:",
                        data
                    );


                    // ----------------------------------
                    // BACKEND RETURNS STRING
                    // ----------------------------------

                    if (
                        typeof data === "string"
                    ) {

                        token = data;

                    }

                    // ----------------------------------
                    // BACKEND RETURNS OBJECT
                    // ----------------------------------

                    else {

                        // TOKEN

                        if (data.token) {

                            token =
                                data.token;

                        }

                        else if (data.accessToken) {

                            token =
                                data.accessToken;

                        }

                        else if (data.jwt) {

                            token =
                                data.jwt;

                        }


                        // ROLE

                        if (data.role) {

                            role =
                                data.role;

                        }

                        else if (data.userRole) {

                            role =
                                data.userRole;

                        }

                        else if (
                            data.user &&
                            data.user.role
                        ) {

                            role =
                                data.user.role;

                        }
                    }


                } catch (error) {

                    console.log(
                        "Backend returned plain JWT."
                    );
                }


                // ==================================
                // CLEAN TOKEN
                // ==================================

                token =
                    token
                        .trim()
                        .replace(
                            /^"|"$/g,
                            ""
                        );


                // ==================================
                // CHECK TOKEN
                // ==================================

                if (!token) {

                    throw new Error(
                        "Backend JWT token was not received."
                    );
                }


                // ==================================
                // SAVE AUTH DATA
                // ==================================

                localStorage.setItem(
                    "token",
                    token
                );


                localStorage.setItem(
                    "firebaseToken",
                    firebaseToken
                );


                localStorage.setItem(
                    "userEmail",
                    firebaseUser.email
                );


                // ==================================
                // SAVE ROLE
                // ==================================

                if (role) {

                    localStorage.setItem(
                        "role",
                        role
                    );

                    console.log(
                        "Role saved:",
                        role
                    );

                } else {

                    console.warn(
                        "Role was NOT returned by backend."
                    );

                    localStorage.removeItem(
                        "role"
                    );
                }


                // ==================================
                // DEBUG
                // ==================================

                console.log(
                    "Backend JWT saved."
                );

                console.log(
                    "Firebase authentication complete."
                );

                console.log(
                    "Logged in email:",
                    localStorage.getItem(
                        "userEmail"
                    )
                );

                console.log(
                    "Logged in role:",
                    localStorage.getItem(
                        "role"
                    )
                );


                // ==================================
                // SUCCESS
                // ==================================

                showMessage(
                    "loginMessage",
                    "Login successful! Redirecting...",
                    "success"
                );


                button.textContent =
                    "Login Successful ✓";


                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Firebase Login Error:",
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


                button.disabled = false;

                button.textContent =
                    "Login";
            }

        }
    );
}


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "registerUsername"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


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


            button.disabled = true;

            button.textContent =
                "Creating Account...";


            try {

                // ==================================
                // FIREBASE AUTH
                // ==================================

                const auth =
                    checkFirebaseAuth();

                const {
                    createUserWithEmailAndPassword
                } =
                    await getFirebaseAuthFunctions();


                console.log(
                    "Creating Firebase user..."
                );


                const firebaseResult =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const firebaseUser =
                    firebaseResult.user;


                console.log(
                    "Firebase Registration Successful:",
                    firebaseUser.email
                );


                // ==================================
                // FIREBASE ID TOKEN
                // ==================================

                const firebaseToken =
                    await firebaseUser.getIdToken();


                console.log(
                    "Firebase ID Token received."
                );


                // ==================================
                // SAVE FIREBASE DATA
                // ==================================

                localStorage.setItem(
                    "firebaseToken",
                    firebaseToken
                );


                localStorage.setItem(
                    "userEmail",
                    firebaseUser.email
                );


                // ==================================
                // REGISTER USER IN SPRING BOOT
                // ==================================

                console.log(
                    "Creating backend user..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                username:
                                    username,

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
                    "Backend Register Status:",
                    response.status
                );


                console.log(
                    "Backend Register Response:",
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Backend registration failed."
                    );
                }


                // ==================================
                // SUCCESS
                // ==================================

                showMessage(
                    "registerMessage",
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                button.textContent =
                    "Account Created ✓";


                // ==================================
                // FIREBASE SIGN OUT
                // ==================================

                const {
                    signOut
                } =
                    await getFirebaseAuthFunctions();


                await signOut(auth);


                // ==================================
                // CLEAR TEMP DATA
                // ==================================

                localStorage.removeItem(
                    "firebaseToken"
                );


                localStorage.removeItem(
                    "userEmail"
                );


                localStorage.removeItem(
                    "role"
                );


                // ==================================
                // REDIRECT
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Firebase Registration Error:",
                    error
                );


                let message =
                    "Unable to create account.";


                // ==================================
                // FIREBASE ERRORS
                // ==================================

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


                button.disabled = false;

                button.textContent =
                    "Create Account";
            }

        }
    );
}
