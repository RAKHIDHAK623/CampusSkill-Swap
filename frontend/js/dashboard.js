// ============================================================
// CAMPUS SKILLSWAP - STUDENT DASHBOARD
// COMPLETE VERSION
// ============================================================


// ============================================================
// API CONFIG
// ============================================================

const API_BASE_URL = "http://localhost:8081";


// ============================================================
// AUTH DATA
// ============================================================

const token =
    localStorage.getItem("token");

const userEmail =
    localStorage.getItem("userEmail");

let userRole =
    localStorage.getItem("role");

userRole =
    userRole
        ? userRole.trim().toUpperCase()
        : "STUDENT";

// ============================================================
// DEBUG
// ============================================================

console.log("=================================");
console.log("CAMPUS SKILLSWAP STUDENT DASHBOARD");
console.log("EMAIL:", userEmail);
console.log("ROLE:", userRole);
console.log("TOKEN PRESENT:", !!token);
console.log("=================================");


// ============================================================
// AUTH CHECK
// ============================================================

if (!token) {

    console.warn(
        "No JWT token found."
    );

    window.location.replace(
        "login.html"
    );

} else if (userRole === "ADMIN") {

    console.log(
        "Admin detected. Redirecting..."
    );

    window.location.replace(
        "admin-dashboard.html"
    );

}


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!token) {
            return;
        }

        if (userRole === "ADMIN") {
            return;
        }


        console.log(
            "Student dashboard initialized."
        );


        loadDashboardUser();

        setupMobileMenu();

        setupNavigation();

        setupSearch();

        setupNotifications();

        setupAddSkillForm();

        setupExchangeForm();

        setupProfileEdit();

        setupModalClose();

        loadDashboardData();

    }
);


// ============================================================
// LOAD ALL DASHBOARD DATA
// ============================================================

async function loadDashboardData() {

    await Promise.allSettled([
        loadSkills(),
        loadExchangeRequests()
    ]);

}


// ============================================================
// CURRENT USER
// ============================================================

function getCurrentUserId() {

    const userId =
        localStorage.getItem("userId");

    if (userId) {
        return userId;
    }

    return null;
}


// ============================================================
// USER PROFILE
// ============================================================

function loadDashboardUser() {

    const email =
        localStorage.getItem(
            "userEmail"
        );

    const username =
        email
            ? email.split("@")[0]
            : "Student";


    const role =
        (
            localStorage.getItem("role") ||
            "STUDENT"
        )
        .trim()
        .toUpperCase();


    const displayRole =
        role.charAt(0) +
        role.slice(1).toLowerCase();


    // ------------------------------------------
    // TOP USERNAME
    // ------------------------------------------

    const topUsername =
        document.getElementById(
            "topUsername"
        );

    if (topUsername) {

        topUsername.textContent =
            username;

    }


    // ------------------------------------------
    // WELCOME
    // ------------------------------------------

    const welcomeUsername =
        document.getElementById(
            "welcomeUsername"
        );

    if (welcomeUsername) {

        welcomeUsername.textContent =
            username;

    }


    // ------------------------------------------
    // PROFILE USERNAME
    // ------------------------------------------

    const profileUsername =
        document.getElementById(
            "profileUsername"
        );

    if (profileUsername) {

        profileUsername.textContent =
            username;

    }


    // ------------------------------------------
    // PROFILE EMAIL
    // ------------------------------------------

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    if (profileEmail) {

        profileEmail.textContent =
            email || "No email";

    }


    // ------------------------------------------
    // DETAIL EMAIL
    // ------------------------------------------

    const detailEmail =
        document.getElementById(
            "detailEmail"
        );

    if (detailEmail) {

        detailEmail.textContent =
            email || "No email";

    }


    // ------------------------------------------
    // ROLE
    // ------------------------------------------

    const profileRole =
        document.getElementById(
            "profileRole"
        );

    if (profileRole) {

        profileRole.textContent =
            displayRole;

    }


    const topRole =
        document.getElementById(
            "topRole"
        );

    if (topRole) {

        topRole.textContent =
            displayRole;

    }


    const accountType =
        document.getElementById(
            "accountType"
        );

    if (accountType) {

        accountType.textContent =
            displayRole;

    }


    // ------------------------------------------
    // AVATAR
    // ------------------------------------------

    const firstLetter =
        username
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


    document.body.classList.add(
        "student-user"
    );

}


// ============================================================
// API HELPER
// ============================================================

async function apiFetch(
    endpoint,
    options = {}
) {

    const headers = {
        ...(options.headers || {}),
        "Authorization":
            "Bearer " + token
    };


    if (
        !headers["Content-Type"] &&
        options.method &&
        options.method !== "GET"
    ) {

        headers["Content-Type"] =
            "application/json";

    }


    const response =
        await fetch(
            API_BASE_URL + endpoint,
            {
                ...options,
                headers
            }
        );

    
    // AUTH FAILURE
    
    if (
        response.status === 401 ||
        response.status === 403
    ) {

        console.error(
            "Authentication failed:",
            response.status
        );

        logout();

        throw new Error(
            "Authentication expired. Please login again."
        );

    }


    return response;

}



// LOAD SKILLS

async function loadSkills() {

    const container =
        document.getElementById(
            "skillsContainer"
        );


    if (!container) {
        return;
    }


    showSkillsLoading(
        container
    );


    try {

        const response =
            await apiFetch(
                "/api/skills"
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Failed to load skills."
            );

        }


        const skills =
            await response.json();


        console.log(
            "Skills received:",
            skills
        );


        displaySkills(
            skills
        );


    } catch (error) {

        console.error(
            "Skills Error:",
            error
        );


        container.innerHTML = `

            <div class="skill-card error-card">

                <div class="skill-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load skills
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Please check backend connection."
                    )}
                </p>

                <button
                    type="button"
                    onclick="loadSkills()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}



// DISPLAY SKILLS


function displaySkills(
    skills
) {

    const container =
        document.getElementById(
            "skillsContainer"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(skills) ||
        skills.length === 0
    ) {

        container.innerHTML = `

            <div class="skill-card empty-card">

                <div class="skill-icon">
                    📚
                </div>

                <h3>
                    No Skills Available
                </h3>

                <p>
                    Be the first student to
                    share a skill!
                </p>

                <button
                    type="button"
                    onclick="openAddSkillModal()"
                >
                    Add Your Skill
                </button>

            </div>

        `;

        updateSkillCount(
            0
        );

        return;
    }


    
    // CURRENT USER
    

    const currentUserId =
        getCurrentUserId();


    // MY SKILLS
    
    const mySkills =
        skills.filter(
            function (skill) {

                const owner =
                    skill.user ||
                    skill.owner ||
                    {};


                if (!currentUserId) {
                    return false;
                }


                return String(
                    owner.id
                ) === String(
                    currentUserId
                );

            }
        );


    updateSkillCount(
        mySkills.length
    );


    
    // DISPLAY ALL SKILLS
   

    container.innerHTML = "";


    skills.forEach(
        function (skill) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "skill-card";


            const category =
                skill.category ||
                "General";


            const level =
                skill.level ||
                "BEGINNER";


            const name =
                skill.name ||
                "Unnamed Skill";


            const description =
                skill.description ||
                "No description available.";


            const skillId =
                skill.id || "";


            const owner =
                skill.user ||
                skill.owner ||
                {};


            const receiverId =
                owner.id || "";


            const username =
                owner.username ||
                owner.email ||
                "Student";


            const isMine =
                currentUserId &&
                String(
                    owner.id
                ) === String(
                    currentUserId
                );


            card.innerHTML = `

                <div class="skill-icon">

                    ${getSkillIcon(
                        category
                    )}

                </div>


                <h3>

                    ${escapeHTML(
                        name
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        description
                    )}

                </p>


                <div class="skill-meta">

                    <span>

                        📂
                        ${escapeHTML(
                            category
                        )}

                    </span>


                    <span class="skill-level">

                        🎯
                        ${escapeHTML(
                            level
                        )}

                    </span>

                </div>


                <div class="skill-footer">

                    <span>

                        👤
                        ${escapeHTML(
                            username
                        )}

                    </span>


                    ${
                        isMine

                        ?

                        `
                            <span
                                class="my-skill-badge"
                            >
                                My Skill
                            </span>
                        `

                        :

                        `
                            <button
                                type="button"
                                class="explore-btn"
                            >
                                Exchange
                            </button>
                        `
                    }

                </div>

            `;


            
            // EXCHANGE BUTTON
            
            const button =
                card.querySelector(
                    ".explore-btn"
                );


            if (button) {

                button.addEventListener(
                    "click",
                    function () {

                        startSkillExchange(
                            skillId,
                            receiverId
                        );

                    }
                );

            }


            container.appendChild(
                card
            );

        }
    );

}



// SKILL COUNT


function updateSkillCount(
    count
) {

    const element =
        document.getElementById(
            "mySkillsCount"
        );


    if (element) {

        element.textContent =
            count;

    }

}



// SKILL ICON

function getSkillIcon(
    category
) {

    const value =
        String(
            category || ""
        )
        .toLowerCase();


    if (
        value.includes("program") ||
        value.includes("web") ||
        value.includes("development")
    ) {

        return "💻";

    }


    if (
        value.includes("python") ||
        value.includes("data") ||
        value.includes("ai")
    ) {

        return "🐍";

    }


    if (
        value.includes("java") ||
        value.includes("backend")
    ) {

        return "☕";

    }


    if (
        value.includes("design") ||
        value.includes("ui") ||
        value.includes("ux")
    ) {

        return "🎨";

    }


    if (
        value.includes("music")
    ) {

        return "🎵";

    }


    if (
        value.includes("photo")
    ) {

        return "📸";

    }


    if (
        value.includes("video")
    ) {

        return "🎬";

    }


    if (
        value.includes("language") ||
        value.includes("english")
    ) {

        return "🌐";

    }


    if (
        value.includes("marketing")
    ) {

        return "📈";

    }


    return "📚";

}


// MOBILE MENU

function setupMobileMenu() {

    const button =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        !button ||
        !sidebar
    ) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}



// NAVIGATION


function setupNavigation() {

    const items =
        document.querySelectorAll(
            ".nav-item"
        );


    items.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    items.forEach(
                        function (nav) {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    const sidebar =
                        document.getElementById(
                            "sidebar"
                        );


                    if (sidebar) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }
    );

}


// SEARCH


function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    let searchTimer;

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                searchInput.value.trim();

            clearTimeout(searchTimer);

            searchTimer =
                setTimeout(
                    async function () {

                        if (!keyword) {
                            loadSkills();
                            return;
                        }

                        try {

                            const response =
                                await apiFetch(
                                    "/api/skills/search?name=" +
                                    encodeURIComponent(keyword)
                                );

                            if (!response.ok) {
                                throw new Error(
                                    "Search failed: " +
                                    response.status
                                );
                            }

                            const skills =
                                await response.json();

                            displaySkills(skills);

                        } catch (error) {

                            console.error(
                                "Search Error:",
                                error
                            );

                        }

                    },
                    300
                );
        }
    );
}



// ADD SKILL MODAL


function openAddSkillModal() {

    const modal =
        document.getElementById(
            "addSkillModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeAddSkillModal() {

    const modal =
        document.getElementById(
            "addSkillModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}



// ADD SKILL FORM


function setupAddSkillForm() {

    const form =
        document.getElementById(
            "addSkillForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const button =
                document.getElementById(
                    "addSkillButton"
                );


            const message =
                document.getElementById(
                    "skillMessage"
                );


            const name =
                document.getElementById(
                    "skillName"
                )
                .value
                .trim();


            const description =
                document.getElementById(
                    "skillDescription"
                )
                .value
                .trim();


            const category =
                document.getElementById(
                    "skillCategory"
                )
                .value
                .trim();


            const level =
                document.getElementById(
                    "skillLevel"
                )
                .value;


            if (
                !name ||
                !description ||
                !category ||
                !level
            ) {

                showMessage(
                    message,
                    "Please fill all fields.",
                    "error"
                );

                return;

            }


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Adding...";

            }


            try {

                const response =
                    await apiFetch(
                        "/api/skills",
                        {

                            method:
                                "POST",

                            body:
                                JSON.stringify({

                                    name,

                                    description,

                                    category,

                                    level

                                })

                        }
                    );


                const text =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        text ||
                        "Failed to add skill."
                    );

                }


                showMessage(
                    message,
                    "Skill added successfully! ✅",
                    "success"
                );


                form.reset();


                await loadSkills();


                setTimeout(
                    closeAddSkillModal,
                    800
                );


            } catch (error) {

                console.error(
                    "Add Skill Error:",
                    error
                );


                showMessage(
                    message,
                    error.message,
                    "error"
                );


            } finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Add Skill";

                }

            }

        }
    );

}



// EXCHANGE MODAL


function openExchangeModal() {

    const modal =
        document.getElementById(
            "exchangeModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeExchangeModal() {

    const modal =
        document.getElementById(
            "exchangeModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}



// START EXCHANGE

function startSkillExchange(
    skillId,
    receiverId
) {

    if (!skillId) {

        alert(
            "Skill ID is missing."
        );

        return;

    }


    if (!receiverId) {

        alert(
            "This skill does not have a valid owner."
        );

        return;

    }


    const skillInput =
        document.getElementById(
            "exchangeSkillId"
        );


    const receiverInput =
        document.getElementById(
            "receiverId"
        );


    if (
        !skillInput ||
        !receiverInput
    ) {

        alert(
            "Exchange form is missing."
        );

        return;

    }


    skillInput.value =
        skillId;


    receiverInput.value =
        receiverId;


    openExchangeModal();

}



// EXCHANGE FORM


function setupExchangeForm() {

    const form =
        document.getElementById(
            "exchangeForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const button =
                document.getElementById(
                    "exchangeButton"
                );


            const message =
                document.getElementById(
                    "exchangeMessage"
                );


            const receiverId =
                Number(
                    document.getElementById(
                        "receiverId"
                    ).value
                );


            const skillId =
                Number(
                    document.getElementById(
                        "exchangeSkillId"
                    ).value
                );


            if (
                !receiverId ||
                !skillId
            ) {

                showMessage(
                    message,
                    "Invalid exchange information.",
                    "error"
                );

                return;

            }


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "Sending...";

            }


            try {

                const response =
                    await apiFetch(
                        "/api/exchange",
                        {

                            method:
                                "POST",

                            body:
                                JSON.stringify({

                                    receiverId,

                                    skillId

                                })

                        }
                    );


                const text =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        text ||
                        "Failed to send exchange request."
                    );

                }


                showMessage(
                    message,
                    "Exchange request sent successfully! ✅",
                    "success"
                );


                form.reset();


                await loadExchangeRequests();


                setTimeout(
                    closeExchangeModal,
                    1000
                );


            } catch (error) {

                console.error(
                    "Exchange Error:",
                    error
                );


                showMessage(
                    message,
                    error.message,
                    "error"
                );


            } finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Send Exchange Request";

                }

            }

        }
    );

}


// LOAD EXCHANGE REQUESTS


async function loadExchangeRequests() {

    const container =
        document.getElementById(
            "exchangeRequestsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="empty-activity">

            <div class="activity-icon">
                ⏳
            </div>

            <h3>
                Loading requests...
            </h3>

            <p>
                Please wait.
            </p>

        </div>

    `;


    try {

        const response =
            await apiFetch(
                "/api/exchange"
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Failed to load exchanges."
            );

        }


        const requests =
            await response.json();


        const list =
            Array.isArray(requests)
                ? requests
                : [];


        console.log(
            "Exchange data:",
            list
        );


        updateExchangeCount(
            list
        );


        updateConnectionCount(
            list
        );


        updateRating(
            list
        );


        displayRecentActivity(
            list
        );


        displayExchangeRequests(
            list,
            container
        );


    } catch (error) {

        console.error(
            "Exchange Request Error:",
            error
        );


        container.innerHTML = `

            <div class="empty-activity">

                <div class="activity-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load requests
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}



// DISPLAY EXCHANGE REQUESTS

function displayExchangeRequests(
    list,
    container
) {

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-activity">

                <div class="activity-icon">
                    📭
                </div>

                <h3>
                    No Exchange Requests
                </h3>

                <p>
                    You don't have any exchange requests yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    list
        .slice()
        .reverse()
        .forEach(
            function (request) {

                const sender =
                    request.sender ||
                    {};


                const receiver =
                    request.receiver ||
                    {};


                const skill =
                    request.skill ||
                    {};


                const senderName =
                    sender.username ||
                    sender.email ||
                    "Student";


                const skillName =
                    skill.name ||
                    "Unknown Skill";


                const status =
                    String(
                        request.status ||
                        "PENDING"
                    )
                    .toUpperCase();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "exchange-request";


                let actions = "";


                
                // PENDING
                

                if (
                    status === "PENDING"
                ) {

                    actions = `

                        <div class="exchange-actions">

                            <button
                                type="button"
                                class="accept-btn"
                                onclick="acceptExchangeRequest(${request.id})"
                            >
                                ✓ Accept
                            </button>


                            <button
                                type="button"
                                class="reject-btn"
                                onclick="rejectExchangeRequest(${request.id})"
                            >
                                ✕ Reject
                            </button>

                        </div>

                    `;

                }


                // COMPLETED

                if (
                    status === "COMPLETED" ||
                    status === "ACCEPTED"
                ) {

                    actions = `

                        <div class="exchange-actions">

                            <button
                                type="button"
                                class="rate-btn"
                                onclick="openRatingModal(${request.id})"
                            >
                                ⭐ Rate
                            </button>

                        </div>

                    `;

                }


                card.innerHTML = `

                    <div class="exchange-request-info">

                        <div class="exchange-avatar">

                            ${escapeHTML(
                                senderName
                                    .charAt(0)
                                    .toUpperCase()
                            )}

                        </div>


                        <div>

                            <h3>
                                ${escapeHTML(
                                    senderName
                                )}
                            </h3>


                            <p>

                                Wants to exchange

                                <strong>
                                    ${escapeHTML(
                                        skillName
                                    )}
                                </strong>

                            </p>


                            <span
                                class="
                                    exchange-status
                                    ${status.toLowerCase()}
                                "
                            >
                                ${escapeHTML(
                                    status
                                )}
                            </span>

                        </div>

                    </div>


                    ${actions}

                `;


                container.appendChild(
                    card
                );

            }
        );

}


// ACCEPT EXCHANGE

async function acceptExchangeRequest(
    id
) {

    if (!id) {
        return;
    }


    try {

        const response =
            await apiFetch(
                `/api/exchange/${id}/accept`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Unable to accept request."
            );

        }


        alert(
            "Exchange request accepted! ✅"
        );


        await loadExchangeRequests();


    } catch (error) {

        console.error(
            "Accept Error:",
            error
        );


        alert(
            error.message
        );

    }

}



// REJECT EXCHANGE


async function rejectExchangeRequest(
    id
) {

    if (!id) {
        return;
    }


    try {

        const response =
            await apiFetch(
                `/api/exchange/${id}/reject`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Unable to reject request."
            );

        }


        alert(
            "Exchange request rejected. ❌"
        );


        await loadExchangeRequests();


    } catch (error) {

        console.error(
            "Reject Error:",
            error
        );


        alert(
            error.message
        );

    }

}


// EXCHANGE COUNT

function updateExchangeCount(
    exchanges
) {

    const element =
        document.getElementById(
            "exchangeCount"
        );


    if (!element) {
        return;
    }


    if (
        !Array.isArray(exchanges)
    ) {

        element.textContent =
            "0";

        return;

    }


    const count =
        exchanges.filter(
            function (exchange) {

                const status =
                    String(
                        exchange.status ||
                        ""
                    )
                    .toUpperCase();


                return (
                    status === "ACCEPTED" ||
                    status === "COMPLETED" ||
                    status === "ACTIVE"
                );

            }
        ).length;


    element.textContent =
        count;

}


// CONNECTION COUNT


function updateConnectionCount(
    exchanges
) {

    const element =
        document.getElementById(
            "connectionCount"
        );


    if (!element) {
        return;
    }


    if (
        !Array.isArray(exchanges)
    ) {

        element.textContent =
            "0";

        return;

    }


    const currentUserId =
        getCurrentUserId();


    const connectedUsers =
        new Set();


    exchanges.forEach(
        function (exchange) {

            const sender =
                exchange.sender ||
                {};


            const receiver =
                exchange.receiver ||
                {};


            const status =
                String(
                    exchange.status ||
                    ""
                )
                .toUpperCase();


            if (
                status !== "ACCEPTED" &&
                status !== "COMPLETED" &&
                status !== "ACTIVE"
            ) {

                return;

            }


            if (
                sender.id &&
                String(sender.id) !==
                String(currentUserId)
            ) {

                connectedUsers.add(
                    sender.id
                );

            }


            if (
                receiver.id &&
                String(receiver.id) !==
                String(currentUserId)
            ) {

                connectedUsers.add(
                    receiver.id
                );

            }

        }
    );


    element.textContent =
        connectedUsers.size;

}



// RATING

function updateRating(
    exchanges
) {

    const element =
        document.getElementById(
            "rating"
        );


    if (!element) {
        return;
    }


    if (
        !Array.isArray(exchanges)
    ) {

        element.textContent =
            "0.0";

        return;

    }


    let total =
        0;


    let count =
        0;


    exchanges.forEach(
        function (exchange) {

            const rating =
                Number(
                    exchange.rating
                );


            if (
                !Number.isNaN(rating) &&
                rating >= 1 &&
                rating <= 5
            ) {

                total +=
                    rating;

                count++;

            }


            // Support nested rating
            if (
                exchange.rating &&
                typeof exchange.rating ===
                "object"
            ) {

                const nestedRating =
                    Number(
                        exchange.rating.value
                    );


                if (
                    !Number.isNaN(
                        nestedRating
                    ) &&
                    nestedRating >= 1 &&
                    nestedRating <= 5
                ) {

                    total +=
                        nestedRating;

                    count++;

                }

            }

        }
    );


    const average =
        count > 0
            ? total / count
            : 0;


    element.textContent =
        average.toFixed(1);

}


// RATING MODAL


function openRatingModal(
    exchangeId
) {

    const modal =
        document.getElementById(
            "ratingModal"
        );


    const input =
        document.getElementById(
            "ratingExchangeId"
        );


    if (
        !modal ||
        !input
    ) {

        alert(
            "Rating form is not available."
        );

        return;

    }


    input.value =
        exchangeId;


    modal.classList.add(
        "show"
    );

}


function closeRatingModal() {

    const modal =
        document.getElementById(
            "ratingModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// RATING FORM


function setupRatingForm() {

    const form =
        document.getElementById(
            "ratingForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const exchangeId =
                Number(
                    document.getElementById(
                        "ratingExchangeId"
                    ).value
                );


            const rating =
                Number(
                    document.getElementById(
                        "ratingValue"
                    ).value
                );


            const review =
                document.getElementById(
                    "ratingReview"
                )
                .value
                .trim();


            const message =
                document.getElementById(
                    "ratingMessage"
                );


            const button =
                document.getElementById(
                    "ratingSubmitButton"
                );


            if (
                !exchangeId ||
                !rating ||
                rating < 1 ||
                rating > 5
            ) {

                showMessage(
                    message,
                    "Please select a rating between 1 and 5.",
                    "error"
                );

                return;

            }


            if (button) {

                button.disabled =
                    true;

                button.textContent =
                    "Submitting...";

            }


            try {

                /* IMPORTANT:
                 This endpoint must exist in Spring Boot */

                const response =
                    await apiFetch(
                        "/api/ratings",
                        {

                            method:
                                "POST",

                            body:
                                JSON.stringify({

                                    exchangeId,

                                    rating,

                                    review

                                })

                        }
                    );


                const text =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        text ||
                        "Unable to submit rating."
                    );

                }


                showMessage(
                    message,
                    "Rating submitted successfully! ⭐",
                    "success"
                );


                form.reset();


                await loadExchangeRequests();


                setTimeout(
                    closeRatingModal,
                    1000
                );


            } catch (error) {

                console.error(
                    "Rating Error:",
                    error
                );


                showMessage(
                    message,
                    error.message,
                    "error"
                );


            } finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        "Submit Rating";

                }

            }

        }
    );

}



// RECENT ACTIVITY

function displayRecentActivity(
    exchanges
) {

    const container =
        document.querySelector(
            "#activity .empty-activity"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(exchanges) ||
        exchanges.length === 0
    ) {

        container.innerHTML = `

            <div class="activity-icon">
                📋
            </div>

            <h3>
                No activity yet
            </h3>

            <p>
                Start learning or sharing skills
                to see your activity here.
            </p>

        `;

        return;

    }


    const recent =
        exchanges
            .slice()
            .reverse()
            .slice(
                0,
                5
            );


    let html =
        "";


    recent.forEach(
        function (exchange) {

            const skill =
                exchange.skill ||
                {};


            const status =
                String(
                    exchange.status ||
                    "PENDING"
                )
                .toUpperCase();


            const skillName =
                skill.name ||
                "Skill";


            html += `

                <div class="activity-item">

                    <div class="activity-icon">
                        🔄
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                skillName
                            )}
                        </strong>

                        <p>
                            Exchange status:
                            ${escapeHTML(
                                status
                            )}
                        </p>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


// PROFILE EDIT

function setupProfileEdit() {

    const buttons =
        document.querySelectorAll(
            ".profile-card .small-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    alert(
                        "Profile editing can be added here."
                    );

                }
            );

        }
    );

}


// MODAL CLOSE

function setupModalClose() {

    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList.contains(
                    "modal"
                )
            ) {

                event.target.classList.remove(
                    "show"
                );

            }

        }
    );

}



// MESSAGE

function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        "modal-message " +
        type;

}


// SKILL LOADING

function showSkillsLoading(
    container
) {

    container.innerHTML = `

        <div class="skill-card loading-card">

            <div class="skill-icon">
                ⏳
            </div>

            <h3>
                Loading skills...
            </h3>

            <p>
                Please wait
            </p>

        </div>

    `;

}


// LOGOUT


function logout() {

    console.log(
        "Logging out..."
    );


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


    window.location.replace(
        "login.html"
    );

}


// ESCAPE HTML


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// SCROLL TO SKILLS

function scrollToSkills() {

    const section =
        document.getElementById(
            "discover"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// GLOBAL FUNCTIONS

window.loadSkills =
    loadSkills;


window.openAddSkillModal =
    openAddSkillModal;


window.closeAddSkillModal =
    closeAddSkillModal;


window.openExchangeModal =
    openExchangeModal;


window.closeExchangeModal =
    closeExchangeModal;


window.startSkillExchange =
    startSkillExchange;


window.acceptExchangeRequest =
    acceptExchangeRequest;


window.rejectExchangeRequest =
    rejectExchangeRequest;


window.openRatingModal =
    openRatingModal;


window.closeRatingModal =
    closeRatingModal;


window.logout =
    logout;


window.scrollToSkills =
    scrollToSkills;


// INITIALIZE RATING FORM


document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupRatingForm();

    }
);


// ============================================================
// CAMPUS SKILLSWAP - NOTIFICATION SYSTEM
// FIXED VERSION
// ============================================================

let notificationData = [];
let notificationUnreadCount = 0;


// ============================================================
// SETUP NOTIFICATIONS
// ============================================================

function setupNotifications() {

    const notificationButton =
        document.getElementById("notificationButton");

    const notificationDropdown =
        document.getElementById("notificationDropdown");

    if (!notificationButton) {

        console.warn(
            "Notification button not found."
        );

        return;
    }

    if (!notificationDropdown) {

        console.warn(
            "Notification dropdown not found."
        );

        return;
    }


    // ------------------------------------------
    // PREVENT DUPLICATE EVENT LISTENER
    // ------------------------------------------

    if (
        notificationButton.dataset.notificationReady === "true"
    ) {

        return;

    }


    notificationButton.dataset.notificationReady =
        "true";


    // ------------------------------------------
    // BUTTON CLICK
    // ------------------------------------------

    notificationButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleNotificationPanel();

        }
    );


    // ------------------------------------------
    // MARK ALL READ
    // ------------------------------------------

    const markButton =
        document.getElementById(
            "markNotificationsRead"
        );


    if (markButton) {

        markButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                markAllNotificationsRead();

            }
        );

    }


    // ------------------------------------------
    // INITIAL LOAD
    // ------------------------------------------

    loadNotifications();


    // ------------------------------------------
    // AUTO REFRESH
    // ------------------------------------------

    setInterval(
        function () {

            loadNotifications();

        },
        10000
    );


    console.log(
        "Notification system initialized successfully."
    );

}



// ============================================================
// LOAD NOTIFICATIONS
// ============================================================

async function loadNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    if (!list) {

        console.warn(
            "notificationList not found."
        );

        return;

    }


    try {

        const response =
            await apiFetch(
                "/api/exchange"
            );


        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                text ||
                "Unable to load notifications."
            );

        }


        const exchanges =
            await response.json();


        const requests =
            Array.isArray(exchanges)
                ? exchanges
                : [];


        console.log(
            "Notification exchange data:",
            requests
        );


        // ------------------------------------------
        // CURRENT USER
        // ------------------------------------------

        const currentUserId =
            getCurrentUserId();


        if (!currentUserId) {

            console.warn(
                "userId not found in localStorage."
            );

            notificationData = [];

            renderNotifications();

            updateNotificationBadge();

            return;

        }


        // ------------------------------------------
        // SAVE OLD READ STATES
        // ------------------------------------------

        const oldNotifications =
            new Map();


        notificationData.forEach(
            function (notification) {

                oldNotifications.set(
                    notification.id,
                    notification.unread
                );

            }
        );


        // ------------------------------------------
        // CREATE NOTIFICATIONS
        // ------------------------------------------

        const newNotifications = [];


        requests.forEach(
            function (exchange) {

                if (!exchange) {

                    return;

                }


                const exchangeId =
                    exchange.id;


                const status =
                    String(
                        exchange.status ||
                        "PENDING"
                    )
                    .trim()
                    .toUpperCase();


                const sender =
                    exchange.sender ||
                    {};


                const receiver =
                    exchange.receiver ||
                    {};


                const skill =
                    exchange.skill ||
                    {};


                const senderId =
                    sender.id;


                const receiverId =
                    receiver.id;


                const senderName =
                    sender.username ||
                    sender.name ||
                    sender.email ||
                    "A student";


                const receiverName =
                    receiver.username ||
                    receiver.name ||
                    receiver.email ||
                    "A student";


                const skillName =
                    skill.name ||
                    "a skill";


                // ====================================================
                // 1. RECEIVED PENDING REQUEST
                // ====================================================

                if (
                    status === "PENDING" &&
                    receiverId &&
                    String(receiverId) ===
                    String(currentUserId)
                ) {

                    const notificationId =
                        "exchange-request-" +
                        exchangeId;


                    newNotifications.push({

                        id:
                            notificationId,

                        type:
                            "EXCHANGE_REQUEST",

                        title:
                            "New Exchange Request",

                        message:
                            senderName +
                            " wants to exchange " +
                            skillName +
                            " with you.",

                        icon:
                            "🔄",

                        time:
                            getNotificationTime(
                                exchange.createdAt
                            ),

                        unread:
                            oldNotifications.has(
                                notificationId
                            )
                                ? oldNotifications.get(
                                    notificationId
                                )
                                : true,

                        exchangeId:
                            exchangeId

                    });

                }


                // ====================================================
                // 2. SENT REQUEST ACCEPTED
                // ====================================================

                if (
                    status === "ACCEPTED" &&
                    senderId &&
                    String(senderId) ===
                    String(currentUserId)
                ) {

                    const notificationId =
                        "exchange-accepted-" +
                        exchangeId;


                    newNotifications.push({

                        id:
                            notificationId,

                        type:
                            "EXCHANGE_ACCEPTED",

                        title:
                            "Exchange Request Accepted",

                        message:
                            receiverName +
                            " accepted your exchange request for " +
                            skillName +
                            ".",

                        icon:
                            "✅",

                        time:
                            getNotificationTime(
                                exchange.updatedAt ||
                                exchange.createdAt
                            ),

                        unread:
                            oldNotifications.has(
                                notificationId
                            )
                                ? oldNotifications.get(
                                    notificationId
                                )
                                : true,

                        exchangeId:
                            exchangeId

                    });

                }


                // ====================================================
                // 3. SENT REQUEST REJECTED
                // ====================================================

                if (
                    status === "REJECTED" &&
                    senderId &&
                    String(senderId) ===
                    String(currentUserId)
                ) {

                    const notificationId =
                        "exchange-rejected-" +
                        exchangeId;


                    newNotifications.push({

                        id:
                            notificationId,

                        type:
                            "EXCHANGE_REJECTED",

                        title:
                            "Exchange Request Rejected",

                        message:
                            receiverName +
                            " rejected your exchange request for " +
                            skillName +
                            ".",

                        icon:
                            "❌",

                        time:
                            getNotificationTime(
                                exchange.updatedAt ||
                                exchange.createdAt
                            ),

                        unread:
                            oldNotifications.has(
                                notificationId
                            )
                                ? oldNotifications.get(
                                    notificationId
                                )
                                : true,

                        exchangeId:
                            exchangeId

                    });

                }


                // ====================================================
                // 4. COMPLETED EXCHANGE
                // ====================================================

                if (
                    status === "COMPLETED"
                ) {

                    const isSender =
                        senderId &&
                        String(senderId) ===
                        String(currentUserId);


                    const isReceiver =
                        receiverId &&
                        String(receiverId) ===
                        String(currentUserId);


                    if (
                        isSender ||
                        isReceiver
                    ) {

                        const notificationId =
                            "exchange-completed-" +
                            exchangeId;


                        newNotifications.push({

                            id:
                                notificationId,

                            type:
                                "EXCHANGE_COMPLETED",

                            title:
                                "Exchange Completed",

                            message:
                                "Your exchange for " +
                                skillName +
                                " has been completed.",

                            icon:
                                "🎉",

                            time:
                                getNotificationTime(
                                    exchange.updatedAt ||
                                    exchange.createdAt
                                ),

                            unread:
                                oldNotifications.has(
                                    notificationId
                                )
                                    ? oldNotifications.get(
                                        notificationId
                                    )
                                    : true,

                            exchangeId:
                                exchangeId

                        });

                    }

                }

            }
        );


        // ====================================================
        // SAVE NOTIFICATIONS
        // ====================================================

        notificationData =
            newNotifications;


        console.log(
            "Notifications generated:",
            notificationData
        );


        // ====================================================
        // RENDER
        // ====================================================

        renderNotifications();

        updateNotificationBadge();


    } catch (error) {

        console.error(
            "Notification Error:",
            error
        );


        list.innerHTML = `

            <div class="notification-empty">

                <div class="notification-empty-icon">
                    ⚠️
                </div>

                <h4>
                    Unable to load notifications
                </h4>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Please try again."
                    )}
                </p>

                <button
                    type="button"
                    onclick="loadNotifications()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}



// ============================================================
// RENDER NOTIFICATIONS
// ============================================================

function renderNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    if (!list) {

        return;

    }


    // ========================================================
    // NO NOTIFICATIONS
    // ========================================================

    if (
        !notificationData ||
        notificationData.length === 0
    ) {

        list.innerHTML = `

            <div class="notification-empty">

                <div class="notification-empty-icon">
                    🔔
                </div>

                <h4>
                    No notifications
                </h4>

                <p>
                    You're all caught up!
                </p>

            </div>

        `;


        updateNotificationCountText();

        return;

    }


    // ========================================================
    // NEWEST FIRST
    // ========================================================

    const sorted =
        notificationData
            .slice()
            .reverse();


    list.innerHTML = "";


    // ========================================================
    // CREATE EACH NOTIFICATION
    // ========================================================

    sorted.forEach(
        function (notification) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "notification-item" +
                (
                    notification.unread
                        ? " unread"
                        : ""
                );


            item.dataset.id =
                notification.id;


            item.innerHTML = `

                <div class="notification-icon">

                    ${notification.icon}

                </div>


                <div class="notification-content">

                    <strong>

                        ${escapeHTML(
                            notification.title
                        )}

                    </strong>


                    <p>

                        ${escapeHTML(
                            notification.message
                        )}

                    </p>


                    <span class="notification-time">

                        ${escapeHTML(
                            notification.time
                        )}

                    </span>

                </div>


                ${
                    notification.unread

                    ?

                    `
                        <span
                            class="notification-unread-dot"
                        ></span>
                    `

                    :

                    ""
                }

            `;


            // =================================================
            // CLICK NOTIFICATION
            // =================================================

            item.addEventListener(
                "click",
                function () {

                    notification.unread =
                        false;


                    item.classList.remove(
                        "unread"
                    );


                    updateNotificationBadge();

                    updateNotificationCountText();


                    // -----------------------------------------
                    // RECEIVED REQUEST
                    // -----------------------------------------

                    if (
                        notification.type ===
                        "EXCHANGE_REQUEST"
                    ) {

                        const section =
                            document.getElementById(
                                "exchangeRequests"
                            );


                        if (section) {

                            section.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                        }


                        loadExchangeRequests();

                    }

                }
            );


            list.appendChild(
                item
            );

        }
    );


    updateNotificationCountText();

}



// ============================================================
// NOTIFICATION BADGE
// ============================================================

function updateNotificationBadge() {

    const button =
        document.getElementById(
            "notificationButton"
        );


    if (!button) {

        return;

    }


    const unread =
        notificationData.filter(
            function (notification) {

                return (
                    notification.unread === true
                );

            }
        ).length;


    notificationUnreadCount =
        unread;


    // ========================================================
    // COUNT BADGE
    // ========================================================

    const badge =
        document.getElementById(
            "notificationCount"
        );


    if (badge) {

        if (unread > 0) {

            badge.textContent =
                unread > 99
                    ? "99+"
                    : unread;


            badge.style.display =
                "flex";

        } else {

            badge.textContent =
                "0";


            badge.style.display =
                "none";

        }

    }


    // ========================================================
    // DOT
    // ========================================================

    const dot =
        document.getElementById(
            "notificationDot"
        );


    if (dot) {

        dot.style.display =
            unread > 0
                ? "block"
                : "none";

    }

}



// ============================================================
// NOTIFICATION COUNT TEXT
// ============================================================

function updateNotificationCountText() {

    const element =
        document.getElementById(
            "notificationSubtitle"
        );


    if (!element) {

        return;

    }


    const unread =
        notificationData.filter(
            function (notification) {

                return (
                    notification.unread === true
                );

            }
        ).length;


    if (unread === 0) {

        element.textContent =
            "You're all caught up!";

    } else if (unread === 1) {

        element.textContent =
            "1 unread notification";

    } else {

        element.textContent =
            unread +
            " unread notifications";

    }

}



// ============================================================
// TOGGLE NOTIFICATION DROPDOWN
// ============================================================

function toggleNotificationPanel() {

    const dropdown =
        document.getElementById(
            "notificationDropdown"
        );


    if (!dropdown) {

        console.warn(
            "notificationDropdown not found."
        );

        return;

    }


    dropdown.classList.toggle(
        "show"
    );


    console.log(
        "Notification dropdown:",
        dropdown.className
    );


    // ------------------------------------------
    // LOAD AGAIN WHEN OPENED
    // ------------------------------------------

    if (
        dropdown.classList.contains(
            "show"
        )
    ) {

        loadNotifications();

    }

}



// ============================================================
// MARK ALL NOTIFICATIONS READ
// ============================================================

function markAllNotificationsRead() {

    notificationData.forEach(
        function (notification) {

            notification.unread =
                false;

        }
    );


    renderNotifications();

    updateNotificationBadge();


    console.log(
        "All notifications marked as read."
    );

}



// ============================================================
// NOTIFICATION TIME
// ============================================================

function getNotificationTime(
    dateValue
) {

    if (!dateValue) {

        return "Recently";

    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "Recently";

    }


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    // Future date
    if (
        difference < 0
    ) {

        return "Just now";

    }


    const minutes =
        Math.floor(
            difference /
            (1000 * 60)
        );


    if (
        minutes < 1
    ) {

        return "Just now";

    }


    if (
        minutes < 60
    ) {

        return (
            minutes +
            " min ago"
        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (
        hours < 24
    ) {

        return (
            hours +
            " hr ago"
        );

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (
        days < 7
    ) {

        return (
            days +
            (
                days === 1
                    ? " day ago"
                    : " days ago"
            )
        );

    }


    return date.toLocaleDateString();

}



// ============================================================
// CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const dropdown =
            document.getElementById(
                "notificationDropdown"
            );


        const button =
            document.getElementById(
                "notificationButton"
            );


        if (
            !dropdown ||
            !button
        ) {

            return;

        }


        if (
            dropdown.classList.contains(
                "show"
            ) &&
            !dropdown.contains(
                event.target
            ) &&
            !button.contains(
                event.target
            )
        ) {

            dropdown.classList.remove(
                "show"
            );

        }

    }
);



// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.loadNotifications =
    loadNotifications;


window.setupNotifications =
    setupNotifications;


window.toggleNotificationPanel =
    toggleNotificationPanel;


window.markAllNotificationsRead =
    markAllNotificationsRead;


