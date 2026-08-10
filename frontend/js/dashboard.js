// ==========================================
// CAMPUS SKILL SWAP - DASHBOARD
// ==========================================

const token = localStorage.getItem("token");
const userEmail = localStorage.getItem("userEmail");


// ==========================================
// AUTH CHECK
// ==========================================

if (!token) {

    window.location.href = "login.html";

}


// ==========================================
// USER DATA
// ==========================================

function loadDashboardUser() {

    const email =
        userEmail || "Student";


    // Get username from email
    const username =
        email.includes("@")
            ? email.split("@")[0]
            : "Student";


    const displayName =
        username.charAt(0).toUpperCase() +
        username.slice(1);


    // Username
    const welcomeUsername =
        document.getElementById(
            "welcomeUsername"
        );

    if (welcomeUsername) {
        welcomeUsername.textContent =
            displayName;
    }


    const topUsername =
        document.getElementById(
            "topUsername"
        );

    if (topUsername) {
        topUsername.textContent =
            displayName;
    }


    const profileUsername =
        document.getElementById(
            "profileUsername"
        );

    if (profileUsername) {
        profileUsername.textContent =
            displayName;
    }


    const userUsername =
        document.getElementById(
            "userUsername"
        );

    if (userUsername) {
        userUsername.textContent =
            displayName;
    }


    // Email
    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    if (profileEmail) {
        profileEmail.textContent =
            email;
    }


    const detailEmail =
        document.getElementById(
            "detailEmail"
        );

    if (detailEmail) {
        detailEmail.textContent =
            email;
    }


    // Avatar
    const firstLetter =
        displayName
            .charAt(0)
            .toUpperCase();


    const avatarLetter =
        document.getElementById(
            "avatarLetter"
        );

    if (avatarLetter) {
        avatarLetter.textContent =
            firstLetter;
    }


    const profileLetter =
        document.getElementById(
            "profileLetter"
        );

    if (profileLetter) {
        profileLetter.textContent =
            firstLetter;
    }

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "userEmail"
    );

    window.location.href =
        "login.html";

}


// ==========================================
// MOBILE SIDEBAR
// ==========================================

const menuButton =
    document.getElementById(
        "menuButton"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );


if (menuButton && sidebar) {

    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


// ==========================================
// START
// ==========================================

if (token) {

    loadDashboardUser();

}
