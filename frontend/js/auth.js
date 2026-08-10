// ==========================================
// CAMPUS SKILL SWAP API
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


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value
                .trim();

        const password =
            document.getElementById("loginPassword")
                .value;


        const button =
            document.getElementById("loginButton");


        // Basic validation

        if (!email || !password) {

            showMessage(
                "loginMessage",
                "Please enter email and password.",
                "error"
            );

            return;
        }


        button.disabled = true;

        button.textContent = "Logging in...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const responseText =
                await response.text();


            if (!response.ok) {

                let errorMessage =
                    "Login failed.";

                try {

                    const errorData =
                        JSON.parse(responseText);

                    errorMessage =
                        errorData.message ||
                        errorData.error ||
                        errorMessage;

                } catch (error) {

                    if (responseText) {
                        errorMessage =
                            responseText;
                    }
                }


                throw new Error(errorMessage);
            }


            // ==================================
            // YOUR AUTH SERVICE RETURNS STRING
            // ==================================

            let token =
                responseText.trim();


            // If backend returns JSON instead
            // of plain String, handle that too.

            try {

                const data =
                    JSON.parse(responseText);

                if (typeof data === "string") {

                    token = data;

                } else if (data.token) {

                    token = data.token;

                } else if (data.accessToken) {

                    token = data.accessToken;
                }

            } catch (error) {

                // Plain JWT string.
            }


            // Remove quotes if necessary

            token =
                token.replace(/^"|"$/g, "");


            if (!token) {

                throw new Error(
                    "Login successful but JWT token was not received."
                );
            }


            // ==================================
            // SAVE JWT
            // ==================================

            localStorage.setItem(
                "token",
                token
            );


            localStorage.setItem(
                "userEmail",
                email
            );


            showMessage(
                "loginMessage",
                "Login successful! Redirecting...",
                "success"
            );


            // Redirect

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 700);


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            showMessage(
                "loginMessage",
                error.message ||
                "Unable to login. Please try again.",
                "error"
            );

        } finally {

            button.disabled = false;

            button.textContent = "Login";
        }

    });
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
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


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


            if (password !== confirmPassword) {

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
                                username: username,
                                email: email,
                                password: password
                            })
                        }
                    );


                const responseText =
                    await response.text();


                if (!response.ok) {

                    let errorMessage =
                        "Registration failed.";

                    try {

                        const errorData =
                            JSON.parse(responseText);

                        errorMessage =
                            errorData.message ||
                            errorData.error ||
                            errorMessage;

                    } catch (error) {

                        if (responseText) {
                            errorMessage =
                                responseText;
                        }
                    }


                    throw new Error(
                        errorMessage
                    );
                }


                showMessage(
                    "registerMessage",
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                // Redirect to login

                setTimeout(function () {

                    showLogin();

                }, 1000);


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );


                showMessage(
                    "registerMessage",
                    error.message ||
                    "Unable to register. Please try again.",
                    "error"
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "Create Account";
            }

        }
    );
}
