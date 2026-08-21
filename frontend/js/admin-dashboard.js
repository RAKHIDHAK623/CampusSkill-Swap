// CAMPUS SKILLSWAP - ADMIN DASHBOARD JS
// API CONFIGURATION

const API_BASE_URL = "http://localhost:8081";

// AUTH DATA

function getToken() {
    return localStorage.getItem("token");
}

function getUserEmail() {
    return localStorage.getItem("userEmail");
}

function getRole() {
    const role =
        localStorage.getItem("role") ||
        localStorage.getItem("userRole");

    return role
        ? role.trim().toUpperCase()
        : null;
}

// INITIAL AUTH CHECK

console.log("=================================");
console.log("CAMPUS SKILLSWAP ADMIN DASHBOARD");
console.log("EMAIL:", getUserEmail());
console.log("ROLE:", getRole());
console.log("TOKEN PRESENT:", !!getToken());
console.log(
    "TOKEN LENGTH:",
    getToken() ? getToken().length : 0
);
console.log("=================================");

// SECURITY CHECK

if (!getToken()) {

    console.warn("❌ No JWT token found.");

    window.location.replace("login.html");

} else if (getRole() !== "ADMIN") {

    console.warn(
        "❌ Invalid admin role:",
        getRole()
    );

    window.location.replace("dashboard.html");

} else {

    console.log(
        "✅ ADMIN AUTHENTICATION PASSED"
    );
}

// DOM READY

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "✅ ADMIN DASHBOARD DOM READY"
        );

        if (!getToken()) {
            return;
        }

        if (getRole() !== "ADMIN") {
            return;
        }

        setupAdminMenu();
        setupAdminNavigation();
        setupButtons();
        displayAdminProfile();

        loadAdminStats();

        startAdminRealtimeRefresh();
    }
);

// MOBILE MENU

function setupAdminMenu() {

    const button =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    if (!button || !sidebar) {

        console.warn(
            "⚠️ Menu elements not found."
        );

        return;
    }

    button.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");
        }
    );
}

// NAVIGATION

function setupAdminNavigation() {

    const items =
        document.querySelectorAll(".nav-item");

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

                    item.classList.add("active");

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


// BUTTONS

function setupButtons() {

    const studentsButton =
        document.getElementById(
            "studentsButton"
        );

    const skillsButton =
        document.getElementById(
            "skillsButton"
        );

    const exchangesButton =
        document.getElementById(
            "exchangesButton"
        );

    const refreshButton =
        document.getElementById(
            "refreshButton"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    
    // STUDENTS

    if (studentsButton) {

        studentsButton.addEventListener(
            "click",
            function () {

                setActiveNav("students");

                loadStudents();
            }
        );
    }

    // SKILLS

    if (skillsButton) {

        skillsButton.addEventListener(
            "click",
            function () {

                setActiveNav("skills");

                loadAdminSkills();
            }
        );
    }

    // EXCHANGES
    
    if (exchangesButton) {

        exchangesButton.addEventListener(
            "click",
            function () {

                setActiveNav("exchanges");

                loadAdminExchanges();
            }
        );
    }

    
    // REFRESH
    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                refreshCurrentData();
            }
        );
    }

    
    // LOGOUT
    

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                adminLogout();
            }
        );
    }
}


// ACTIVE NAVIGATION


function setActiveNav(section) {

    const items =
        document.querySelectorAll(".nav-item");

    items.forEach(
        function (item) {

            item.classList.remove("active");

            if (
                item.dataset.section ===
                section
            ) {

                item.classList.add("active");
            }
        }
    );
}


// ADMIN PROFILE

function displayAdminProfile() {

    const email =
        getUserEmail();

    const nameElement =
        document.getElementById(
            "adminName"
        );

    const avatarElement =
        document.getElementById(
            "adminAvatar"
        );

    if (!email) {
        return;
    }

    const username =
        email.split("@")[0];

    const displayName =
        username
            .charAt(0)
            .toUpperCase() +
        username.slice(1);

    if (nameElement) {

        nameElement.textContent =
            displayName;
    }

    if (avatarElement) {

        avatarElement.textContent =
            username
                .charAt(0)
                .toUpperCase();
    }
}


// AUTH HEADERS


function getAuthHeaders() {

    const currentToken =
        getToken();

    return {
        "Authorization":
            "Bearer " + currentToken,

        "Content-Type":
            "application/json"
    };
}


// HANDLE AUTH ERROR

async function handleAuthError(
    response,
    endpoint
) {

    if (
        response.status !== 401 &&
        response.status !== 403
    ) {

        return false;
    }

    let errorText = "";

    try {

        errorText =
            await response.text();

    } catch (error) {

        errorText =
            "Unable to read server response.";
    }

    console.error(
        "🚨 ADMIN API AUTH ERROR"
    );

    console.error(
        "Endpoint:",
        endpoint
    );

    console.error(
        "Status:",
        response.status
    );

    console.error(
        "Response:",
        errorText
    );

    if (response.status === 401) {

        console.warn(
            "JWT expired or invalid."
        );

        localStorage.removeItem("token");

        setTimeout(
            function () {
                window.location.replace(
                    "login.html"
                );
            },
            500
        );
    }

    if (response.status === 403) {

        console.warn(
            "Admin permission denied."
        );
    }

    return true;
}


// ADMIN STATS


async function loadAdminStats() {

    console.log(
        "📊 Loading admin statistics..."
    );

    await loadUserCount();

    await loadSkillCount();

    await loadExchangeCount();

    await loadPlatformRating();

    console.log(
        "✅ Admin statistics loaded."
    );
}


// USER COUNT

async function loadUserCount() {

    const endpoint =
        "/api/users";

    try {

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        console.log(
            "USERS STATUS:",
            response.status
        );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            setStat(
                "totalStudents",
                "—"
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Users API failed."
            );
        }

        const users =
            await response.json();

        const students =
            Array.isArray(users)
                ? users.filter(
                    function (user) {

                        const userRole =
                            user.role
                                ? String(
                                    user.role
                                )
                                    .trim()
                                    .toUpperCase()
                                : "STUDENT";

                        return (
                            userRole ===
                            "STUDENT"
                        );
                    }
                )
                : [];

        setStat(
            "totalStudents",
            students.length
        );

        console.log(
            "STUDENT COUNT:",
            students.length
        );

    } catch (error) {

        console.error(
            "User Count Error:",
            error
        );

        setStat(
            "totalStudents",
            "—"
        );
    }
}


// SKILL COUNT

async function loadSkillCount() {

    const endpoint =
        "/api/skills";

    try {

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        console.log(
            "SKILLS STATUS:",
            response.status
        );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            setStat(
                "totalSkills",
                "—"
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Skills API failed."
            );
        }

        const skills =
            await response.json();

        const count =
            Array.isArray(skills)
                ? skills.length
                : 0;

        setStat(
            "totalSkills",
            count
        );

        console.log(
            "TOTAL SKILLS:",
            count
        );

    } catch (error) {

        console.error(
            "Skill Count Error:",
            error
        );

        setStat(
            "totalSkills",
            "—"
        );
    }
}


// EXCHANGE COUNT

async function loadExchangeCount() {

    const endpoint =
        "/api/exchange/all";

    try {

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        console.log(
            "EXCHANGE STATUS:",
            response.status
        );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            setStat(
                "totalExchanges",
                "—"
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Exchange API failed."
            );
        }

        const exchanges =
            await response.json();

        const count =
            Array.isArray(exchanges)
                ? exchanges.length
                : 0;

        setStat(
            "totalExchanges",
            count
        );

        console.log(
            "TOTAL EXCHANGES:",
            count
        );

    } catch (error) {

        console.error(
            "Exchange Count Error:",
            error
        );

        setStat(
            "totalExchanges",
            "—"
        );
    }
}


// PLATFORM RATING

async function loadPlatformRating() {

    const endpoint =
        "/api/exchange/all";

    try {

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            setStat(
                "platformRating",
                "—"
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load ratings."
            );
        }

        const exchanges =
            await response.json();

        if (
            !Array.isArray(exchanges) ||
            exchanges.length === 0
        ) {

            setStat(
                "platformRating",
                "0.0"
            );

            return;
        }

        let totalRating = 0;

        let ratingCount = 0;

        exchanges.forEach(
            function (exchange) {

                const rating =
                    Number(
                        exchange.rating
                    );

                if (
                    !isNaN(rating) &&
                    rating >= 1 &&
                    rating <= 5
                ) {

                    totalRating +=
                        rating;

                    ratingCount++;
                }
            }
        );

        const averageRating =
            ratingCount > 0
                ? totalRating /
                  ratingCount
                : 0;

        setStat(
            "platformRating",
            averageRating.toFixed(1)
        );

    } catch (error) {

        console.error(
            "Platform Rating Error:",
            error
        );

        setStat(
            "platformRating",
            "0.0"
        );
    }
}


// SET STAT

function setStat(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (element) {

        element.textContent =
            value;
    }
}


// LOAD STUDENTS


async function loadStudents() {

    const container =
        document.getElementById(
            "adminDataContainer"
        );

    const title =
        document.getElementById(
            "dataTitle"
        );

    const subtitle =
        document.getElementById(
            "dataSubtitle"
        );

    if (!container) {
        return;
    }

    if (title) {

        title.textContent =
            "Registered Students";
    }

    if (subtitle) {

        subtitle.textContent =
            "View all registered student accounts.";
    }

    showLoading(
        container,
        "Loading students..."
    );

    try {

        const endpoint =
            "/api/users";

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            showError(
                container,
                "Admin authorization failed."
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to load students."
            );
        }

        const users =
            await response.json();

        const students =
            Array.isArray(users)
                ? users.filter(
                    function (user) {

                        const userRole =
                            user.role
                                ? String(
                                    user.role
                                )
                                    .trim()
                                    .toUpperCase()
                                : "STUDENT";

                        return (
                            userRole ===
                            "STUDENT"
                        );
                    }
                )
                : [];

        if (
            students.length === 0
        ) {

            showEmpty(
                container,
                "👥",
                "No Students Found",
                "There are currently no registered student accounts."
            );

            return;
        }

        let rows = "";

        students.forEach(
            function (user) {

                rows += `
                    <tr>

                        <td>
                            ${user.id ?? "-"}
                        </td>

                        <td>
                            ${escapeHTML(
                                user.username ||
                                "User"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                user.email ||
                                "-"
                            )}
                        </td>

                        <td>
                            <span class="status-badge active">
                                STUDENT
                            </span>
                        </td>

                    </tr>
                `;
            }
        );

        container.innerHTML = `
            <div class="admin-table-wrapper">

                <table class="admin-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>

                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>

                </table>

            </div>
        `;

    } catch (error) {

        console.error(
            "Load Students Error:",
            error
        );

        showError(
            container,
            "Unable to load students."
        );
    }
}


// LOAD SKILLS


async function loadAdminSkills() {

    const container =
        document.getElementById(
            "adminDataContainer"
        );

    const title =
        document.getElementById(
            "dataTitle"
        );

    const subtitle =
        document.getElementById(
            "dataSubtitle"
        );

    if (!container) {
        return;
    }

    if (title) {

        title.textContent =
            "Platform Skills";
    }

    if (subtitle) {

        subtitle.textContent =
            "View all skills shared by students.";
    }

    showLoading(
        container,
        "Loading skills..."
    );

    try {

        const endpoint =
            "/api/skills";

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        console.log(
            "ADMIN SKILLS STATUS:",
            response.status
        );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            showError(
                container,
                "Admin authorization failed while loading skills."
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load skills."
            );
        }

        const skills =
            await response.json();

        console.log(
            "ADMIN SKILLS:",
            skills
        );

        if (
            !Array.isArray(skills) ||
            skills.length === 0
        ) {

            showEmpty(
                container,
                "📚",
                "No Skills Found",
                "No skills have been added yet."
            );

            return;
        }

        let cards = "";

        skills.forEach(
            function (skill) {

                const skillId =
                    skill.id ?? "-";

                const skillName =
                    skill.name ||
                    "Unnamed Skill";

                const description =
                    skill.description ||
                    "No description available.";

                const category =
                    skill.category ||
                    "General";

                const level =
                    skill.level ||
                    "BEGINNER";

                let ownerName =
                    "Unknown Student";

                let ownerEmail =
                    "";

                if (skill.user) {

                    ownerName =
                        skill.user.username ||
                        skill.user.name ||
                        "Student";

                    ownerEmail =
                        skill.user.email ||
                        "";

                } else if (skill.owner) {

                    ownerName =
                        skill.owner.username ||
                        skill.owner.name ||
                        "Student";

                    ownerEmail =
                        skill.owner.email ||
                        "";

                } else if (skill.createdBy) {

                    ownerName =
                        skill.createdBy.username ||
                        skill.createdBy.name ||
                        "Student";

                    ownerEmail =
                        skill.createdBy.email ||
                        "";
                }

                cards += `
                    <div class="skill-admin-card">

                        <div class="skill-admin-icon">
                            📚
                        </div>

                        <div class="skill-admin-content">

                            <div class="skill-admin-id">
                                Skill ID: ${skillId}
                            </div>

                            <h3>
                                ${escapeHTML(
                                    skillName
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

                                <span>
                                    🎯
                                    ${escapeHTML(
                                        level
                                    )}
                                </span>

                            </div>

                            <div class="skill-owner">

                                <strong>
                                    👤 Added By:
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        ownerName
                                    )}
                                </span>

                                ${
                                    ownerEmail
                                        ? `
                                            <small>
                                                ${escapeHTML(
                                                    ownerEmail
                                                )}
                                            </small>
                                          `
                                        : ""
                                }

                            </div>

                        </div>

                    </div>
                `;
            }
        );

        container.innerHTML = `
            <div class="skills-admin-header">

                <div>

                    <h3>
                        All Platform Skills
                    </h3>

                    <p>
                        Total Skills:
                        <strong>
                            ${skills.length}
                        </strong>
                    </p>

                </div>

            </div>

            <div class="skills-admin-grid">
                ${cards}
            </div>
        `;

    } catch (error) {

        console.error(
            "Admin Skills Error:",
            error
        );

        showError(
            container,
            "Unable to load skills. Please check the backend."
        );
    }
}


// LOAD ALL EXCHANGES

async function loadAdminExchanges() {

    const container =
        document.getElementById(
            "adminDataContainer"
        );

    const title =
        document.getElementById(
            "dataTitle"
        );

    const subtitle =
        document.getElementById(
            "dataSubtitle"
        );

    if (!container) {
        return;
    }

    if (title) {

        title.textContent =
            "Skill Exchanges";
    }

    if (subtitle) {

        subtitle.textContent =
            "Monitor skill exchange activities and ratings.";
    }

    showLoading(
        container,
        "Loading exchanges..."
    );

    try {

        const endpoint =
            "/api/exchange/all";

        const response =
            await fetch(
                API_BASE_URL + endpoint,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );

        console.log(
            "LOAD ALL EXCHANGES STATUS:",
            response.status
        );

        const authError =
            await handleAuthError(
                response,
                endpoint
            );

        if (authError) {

            showError(
                container,
                "Admin authorization failed."
            );

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Unable to load exchanges."
            );
        }

        const exchanges =
            await response.json();

        if (
            !Array.isArray(exchanges) ||
            exchanges.length === 0
        ) {

            setStat(
                "platformRating",
                "0.0"
            );

            showEmpty(
                container,
                "🔄",
                "No Exchanges Found",
                "No skill exchanges are available."
            );

            return;
        }

        
        // CALCULATE PLATFORM RATING
        
        let totalRating = 0;

        let ratingCount = 0;

        exchanges.forEach(
            function (exchange) {

                const rating =
                    Number(
                        exchange.rating
                    );

                if (
                    !isNaN(rating) &&
                    rating >= 1 &&
                    rating <= 5
                ) {

                    totalRating +=
                        rating;

                    ratingCount++;
                }
            }
        );

        const averageRating =
            ratingCount > 0
                ? (
                    totalRating /
                    ratingCount
                ).toFixed(1)
                : "0.0";

        setStat(
            "platformRating",
            averageRating
        );

        
        // CREATE TABLE
        
        let rows = "";

        exchanges.forEach(
            function (exchange) {

                const sender =
                    exchange.sender || {};

                const receiver =
                    exchange.receiver || {};

                const skill =
                    exchange.skill || {};

                const status =
                    String(
                        exchange.status ||
                        "PENDING"
                    ).toUpperCase();

                const statusClass =
                    getStatusClass(status);

                const rating =
                    Number(
                        exchange.rating
                    );

                const ratingDisplay =
                    !isNaN(rating) &&
                    rating >= 1 &&
                    rating <= 5
                        ? "⭐ " +
                          rating.toFixed(1)
                        : "Not Rated";

                rows += `
                    <tr>

                        <td>
                            ${exchange.id ?? "-"}
                        </td>

                        <td>
                            ${escapeHTML(
                                sender.username ||
                                sender.email ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                receiver.username ||
                                receiver.email ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                skill.name ||
                                "-"
                            )}
                        </td>

                        <td>

                            <span
                                class="status-badge ${statusClass}"
                            >
                                ${escapeHTML(
                                    status
                                )}
                            </span>

                        </td>

                        <td>

                            <span class="rating-value">
                                ${escapeHTML(
                                    ratingDisplay
                                )}
                            </span>

                        </td>

                    </tr>
                `;
            }
        );

        container.innerHTML = `
            <div class="admin-rating-summary">

                <div class="rating-summary-icon">
                    ⭐
                </div>

                <div>

                    <span>
                        Platform Rating
                    </span>

                    <strong>
                        ${averageRating}
                    </strong>

                    <small>
                        ${ratingCount}
                        rating${ratingCount === 1 ? "" : "s"}
                    </small>

                </div>

            </div>

            <div class="admin-table-wrapper">

                <table class="admin-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Skill</th>
                            <th>Status</th>
                            <th>Rating</th>
                        </tr>

                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>

                </table>

            </div>
        `;

    } catch (error) {

        console.error(
            "Admin Exchange Error:",
            error
        );

        showError(
            container,
            "Unable to load exchanges."
        );
    }
}


// STATUS CLASS

function getStatusClass(status) {

    const normalized =
        String(status)
            .toLowerCase();

    if (
        normalized === "accepted" ||
        normalized === "active" ||
        normalized === "completed"
    ) {

        return "accepted";
    }

    if (
        normalized === "rejected" ||
        normalized === "cancelled"
    ) {

        return "rejected";
    }

    return "pending";
}


// REFRESH CURRENT DATA


function refreshCurrentData() {

    const title =
        document.getElementById(
            "dataTitle"
        );

    if (!title) {

        loadAdminStats();

        return;
    }

    const currentTitle =
        title.textContent.trim();

    if (
        currentTitle ===
        "Registered Students"
    ) {

        loadStudents();

    } else if (
        currentTitle ===
        "Platform Skills"
    ) {

        loadAdminSkills();

    } else if (
        currentTitle ===
        "Skill Exchanges"
    ) {

        loadAdminExchanges();

    } else {

        loadAdminStats();
    }
}


// LOADING UI


function showLoading(
    container,
    message
) {

    container.innerHTML = `
        <div class="admin-loading">

            <div class="loading-spinner"></div>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


// EMPTY UI

function showEmpty(
    container,
    icon,
    title,
    message
) {

    container.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


// ERROR UI

function showError(
    container,
    message
) {

    container.innerHTML = `
        <div class="admin-error">

            <div>
                ⚠️
            </div>

            <h3>
                Unable to load data
            </h3>

            <p>
                ${escapeHTML(
                    message ||
                    "Something went wrong."
                )}
            </p>

        </div>
    `;
}


// HTML ESCAPE


function escapeHTML(value) {

    return String(value)

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


// LOGOUT

function adminLogout() {

    console.log(
        "🔴 ADMIN LOGOUT"
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

    window.location.replace(
        "login.html"
    );
}


// REAL-TIME ADMIN REFRESH

let adminRefreshInterval = null;

function startAdminRealtimeRefresh() {

    if (adminRefreshInterval) {

        clearInterval(
            adminRefreshInterval
        );
    }

    adminRefreshInterval =
        setInterval(
            async function () {

                const currentToken =
                    getToken();

                const currentRole =
                    getRole();

                if (
                    !currentToken ||
                    currentRole !== "ADMIN"
                ) {

                    clearInterval(
                        adminRefreshInterval
                    );

                    adminRefreshInterval =
                        null;

                    return;
                }

                console.log(
                    "🔄 Admin dashboard refreshing..."
                );

                
                // UPDATE STATISTICS
                
                await loadUserCount();

                await loadSkillCount();

                await loadExchangeCount();

                await loadPlatformRating();

                
                // UPDATE OPEN SECTION
                
                const title =
                    document.getElementById(
                        "dataTitle"
                    );

                if (!title) {
                    return;
                }

                const currentTitle =
                    title.textContent.trim();

                if (
                    currentTitle ===
                    "Platform Skills"
                ) {

                    await loadAdminSkills();

                } else if (
                    currentTitle ===
                    "Skill Exchanges"
                ) {

                    await loadAdminExchanges();

                } else if (
                    currentTitle ===
                    "Registered Students"
                ) {

                    await loadStudents();
                }

            },
            5000
        );
}

// GLOBAL FUNCTIONS


window.adminLogout =
    adminLogout;

window.loadAdminStats =
    loadAdminStats;

window.loadStudents =
    loadStudents;

window.loadAdminSkills =
    loadAdminSkills;

window.loadAdminExchanges =
    loadAdminExchanges;

window.refreshCurrentData =
    refreshCurrentData;
