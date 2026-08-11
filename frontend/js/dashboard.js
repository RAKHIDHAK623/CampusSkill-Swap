// ==========================================
// CAMPUS SKILLSWAP - DASHBOARD JS
// ==========================================


// ==========================================
// API
// ==========================================

const API_BASE_URL = "http://localhost:8081";


// ==========================================
// AUTH
// ==========================================

const token = localStorage.getItem("token");
const userEmail = localStorage.getItem("userEmail");

if (!token) {
    window.location.href = "login.html";
}


// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadDashboardUser();

    setupMobileMenu();

    setupNavigation();

    setupSearch();

    loadSkills();

    setupAddSkillForm();

    setupExchangeForm();

    loadExchangeRequests();

});


// ==========================================
// LOAD USER
// ==========================================

function loadDashboardUser() {

    const email = userEmail || "student@example.com";

    let username = "Student";

    if (email.includes("@")) {
        username = email.split("@")[0];
    }

    const displayName =
        username.charAt(0).toUpperCase() +
        username.slice(1);

    const firstLetter =
        displayName.charAt(0).toUpperCase();


    const welcomeUsername =
        document.getElementById("welcomeUsername");

    if (welcomeUsername) {
        welcomeUsername.textContent = displayName;
    }


    const topUsername =
        document.getElementById("topUsername");

    if (topUsername) {
        topUsername.textContent = displayName;
    }


    const profileUsername =
        document.getElementById("profileUsername");

    if (profileUsername) {
        profileUsername.textContent = displayName;
    }


    const profileEmail =
        document.getElementById("profileEmail");

    if (profileEmail) {
        profileEmail.textContent = email;
    }


    const detailEmail =
        document.getElementById("detailEmail");

    if (detailEmail) {
        detailEmail.textContent = email;
    }


    const avatarLetter =
        document.getElementById("avatarLetter");

    if (avatarLetter) {
        avatarLetter.textContent = firstLetter;
    }


    const profileLetter =
        document.getElementById("profileLetter");

    if (profileLetter) {
        profileLetter.textContent = firstLetter;
    }
}


// ==========================================
// LOAD SKILLS
// ==========================================

async function loadSkills() {

    const skillsContainer =
        document.getElementById("skillsContainer");

    if (!skillsContainer) {
        return;
    }


    skillsContainer.innerHTML = `

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


    try {

        const response =
            await fetch(
                API_BASE_URL + "/api/skills",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        console.log(
            "Skills Status:",
            response.status
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Authentication failed. Please login again."
            );

            logout();

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load skills: " +
                response.status
            );

        }


        const skills =
            await response.json();


        console.log(
            "Skills:",
            skills
        );


        displaySkills(skills);


    } catch (error) {

        console.error(
            "Load Skills Error:",
            error
        );


        skillsContainer.innerHTML = `

            <div class="skill-card error-card">

                <div class="skill-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load skills
                </h3>

                <p>
                    Please check the backend.
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


// ==========================================
// DISPLAY SKILLS
// ==========================================

function displaySkills(skills) {

    const skillsContainer =
        document.getElementById(
            "skillsContainer"
        );


    if (!skillsContainer) {
        return;
    }


    if (
        !Array.isArray(skills) ||
        skills.length === 0
    ) {

        skillsContainer.innerHTML = `

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


        updateSkillCount(0);

        return;
    }


    updateSkillCount(skills.length);


    skillsContainer.innerHTML = "";


    skills.forEach(
        function (skill) {

            const card =
                document.createElement("div");


            card.className =
                "skill-card";


            const category =
                skill.category || "General";


            const level =
                skill.level || "BEGINNER";


            const description =
                skill.description ||
                "No description available.";


            const name =
                skill.name ||
                "Unnamed Skill";


            const skillId =
                skill.id || "";


            const receiverId =
                skill.user &&
                skill.user.id
                    ? skill.user.id
                    : "";


            const username =
                skill.user &&
                skill.user.username
                    ? skill.user.username
                    : "Student";


            const icon =
                getSkillIcon(category);


            card.innerHTML = `

                <div class="skill-icon">
                    ${icon}
                </div>

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                <div class="skill-meta">

                    <span>
                        📂
                        ${escapeHTML(category)}
                    </span>

                    <span>
                        🎯
                        ${escapeHTML(level)}
                    </span>

                </div>


                <div class="skill-footer">

                    <span>
                        👤
                        ${escapeHTML(username)}
                    </span>


                    <button
                        type="button"
                        class="explore-btn"
                        data-skill-id="${skillId}"
                        data-receiver-id="${receiverId}"
                    >
                        Explore
                    </button>

                </div>

            `;


            const exploreButton =
                card.querySelector(
                    ".explore-btn"
                );


            if (exploreButton) {

                exploreButton.addEventListener(
                    "click",
                    function () {

                        startSkillExchange(
                            skillId,
                            receiverId
                        );

                    }
                );

            }


            skillsContainer.appendChild(
                card
            );

        }
    );
}


// ==========================================
// UPDATE SKILL COUNT
// ==========================================

function updateSkillCount(count) {

    const countElement =
        document.getElementById(
            "mySkillsCount"
        );


    if (countElement) {

        countElement.textContent =
            count;

    }
}


// ==========================================
// SKILL ICON
// ==========================================

function getSkillIcon(category) {

    if (!category) {
        return "📚";
    }


    const value =
        category.toLowerCase();


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


    return "📚";
}


// ==========================================
// MOBILE MENU
// ==========================================

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        !menuButton ||
        !sidebar
    ) {

        return;

    }


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
// NAVIGATION
// ==========================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    navItems.forEach(
                        function (nav) {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );

                }
            );

        }
    );
}


// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    "#skillsContainer .skill-card"
                );


            cards.forEach(
                function (card) {

                    const text =
                        card.textContent
                            .toLowerCase();


                    if (
                        searchValue === "" ||
                        text.includes(searchValue)
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );
}


// ==========================================
// ADD SKILL MODAL
// ==========================================

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


// ==========================================
// ADD SKILL FORM
// ==========================================

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


            const name =
                document.getElementById(
                    "skillName"
                ).value.trim();


            const description =
                document.getElementById(
                    "skillDescription"
                ).value.trim();


            const category =
                document.getElementById(
                    "skillCategory"
                ).value.trim();


            const level =
                document.getElementById(
                    "skillLevel"
                ).value;


            const message =
                document.getElementById(
                    "skillMessage"
                );


            button.disabled = true;

            button.textContent =
                "Adding...";


            message.textContent =
                "";


            try {

                const response =
                    await fetch(
                        API_BASE_URL +
                        "/api/skills",
                        {

                            method: "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    token,

                                "Content-Type":
                                    "application/json"

                            },


                            body:
                                JSON.stringify({

                                    name:
                                        name,

                                    description:
                                        description,

                                    category:
                                        category,

                                    level:
                                        level

                                })

                        }
                    );


                const responseText =
                    await response.text();


                console.log(
                    "Add Skill Status:",
                    response.status
                );


                console.log(
                    "Add Skill Response:",
                    responseText
                );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    alert(
                        "Authentication failed. Please login again."
                    );

                    logout();

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Failed to add skill."
                    );

                }


                message.textContent =
                    "Skill added successfully!";


                message.className =
                    "modal-message success";


                form.reset();


                await loadSkills();


                setTimeout(
                    function () {

                        closeAddSkillModal();

                        message.textContent =
                            "";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Add Skill Error:",
                    error
                );


                message.textContent =
                    error.message;


                message.className =
                    "modal-message error";


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Add Skill";

            }

        }
    );
}


// ==========================================
// SCROLL TO SKILLS
// ==========================================

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


// ==========================================
// EXCHANGE MODAL
// ==========================================

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


// ==========================================
// START EXCHANGE FROM SKILL
// ==========================================

function startSkillExchange(
    skillId,
    receiverId
) {

    console.log(
        "Selected Skill ID:",
        skillId
    );


    console.log(
        "Receiver ID:",
        receiverId
    );


    if (!skillId) {

        alert(
            "Skill ID is missing."
        );

        return;

    }


    if (!receiverId) {

        alert(
            "This skill does not have a valid student owner."
        );

        return;

    }


    const exchangeSkillId =
        document.getElementById(
            "exchangeSkillId"
        );


    const receiverInput =
        document.getElementById(
            "receiverId"
        );


    if (
        !exchangeSkillId ||
        !receiverInput
    ) {

        alert(
            "Exchange form is missing from the page."
        );

        return;

    }


    exchangeSkillId.value =
        skillId;


    receiverInput.value =
        receiverId;


    openExchangeModal();
}


// ==========================================
// EXCHANGE FORM
// ==========================================

function setupExchangeForm() {

    const form =
        document.getElementById(
            "exchangeForm"
        );


    if (!form) {

        console.warn(
            "Exchange form not found."
        );

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


            const receiverInput =
                document.getElementById(
                    "receiverId"
                );


            const skillInput =
                document.getElementById(
                    "exchangeSkillId"
                );


            const receiverId =
                Number(
                    receiverInput.value
                );


            const skillId =
                Number(
                    skillInput.value
                );


            console.log(
                "Sending Exchange:",
                {
                    receiverId:
                        receiverId,

                    skillId:
                        skillId
                }
            );


            if (
                !receiverId ||
                !skillId
            ) {

                message.textContent =
                    "Receiver ID and Skill ID are required.";

                message.className =
                    "modal-message error";

                return;

            }


            button.disabled =
                true;


            button.textContent =
                "Sending...";


            message.textContent =
                "";


            try {

                const response =
                    await fetch(
                        API_BASE_URL +
                        "/api/exchange",
                        {

                            method: "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    token,

                                "Content-Type":
                                    "application/json"

                            },


                            body:
                                JSON.stringify({

                                    receiverId:
                                        receiverId,

                                    skillId:
                                        skillId

                                })

                        }
                    );


                const responseText =
                    await response.text();


                console.log(
                    "Exchange Status:",
                    response.status
                );


                console.log(
                    "Exchange Response:",
                    responseText
                );


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    throw new Error(
                        "Authentication failed. Token invalid or expired."
                    );

                }


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Failed to send exchange request."
                    );

                }


                message.textContent =
                    "Exchange request sent successfully!";


                message.className =
                    "modal-message success";


                form.reset();


                await loadExchangeRequests();


                setTimeout(
                    function () {

                        closeExchangeModal();

                        message.textContent =
                            "";

                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Exchange Error:",
                    error
                );


                message.textContent =
                    error.message;


                message.className =
                    "modal-message error";


            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Send Exchange Request";

            }

        }
    );
}


// ==========================================
// LOAD RECEIVED EXCHANGE REQUESTS
// ==========================================

async function loadExchangeRequests() {

    const container =
        document.getElementById(
            "exchangeRequestsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/exchange",
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"

                    }
                }
            );


        console.log(
            "Exchange GET Status:",
            response.status
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            console.error(
                "Authentication failed"
            );

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load exchange requests"
            );

        }


        const requests =
            await response.json();


        console.log(
            "Received Exchange Requests:",
            requests
        );


        // ==================================
        // UPDATE EXCHANGE COUNT
        // ==================================

        updateExchangeCount(
            Array.isArray(requests)
                ? requests.length
                : 0
        );


        // ==================================
        // NO REQUESTS
        // ==================================

        if (
            !Array.isArray(requests) ||
            requests.length === 0
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
                        You don't have any
                        pending exchange requests.
                    </p>

                </div>

            `;

            return;

        }


        // ==================================
        // DISPLAY REQUESTS
        // ==================================

        container.innerHTML = "";


        requests.forEach(
            function (request) {

                const sender =
                    request.sender || {};


                const receiver =
                    request.receiver || {};


                const skill =
                    request.skill || {};


                const senderName =
                    sender.username ||
                    sender.email ||
                    "Student";


                const skillName =
                    skill.name ||
                    "Unknown Skill";


                const status =
                    request.status ||
                    "PENDING";


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "exchange-request";


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
                                class="exchange-status ${status.toLowerCase()}"
                            >
                                ${escapeHTML(status)}
                            </span>

                        </div>

                    </div>


                    ${
                        status === "PENDING"
                        ?

                        `

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

                        `

                        :

                        ""
                    }

                `;


                container.appendChild(
                    card
                );

            }
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
                    Please try again.
                </p>

                <button
                    type="button"
                    onclick="loadExchangeRequests()"
                >
                    Try Again
                </button>

            </div>

        `;

    }
}


// ==========================================
// ACCEPT EXCHANGE REQUEST
// ==========================================

async function acceptExchangeRequest(id) {

    if (!id) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/exchange/" +
                id +
                "/accept",
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        const responseText =
            await response.text();


        console.log(
            "Accept Status:",
            response.status
        );


        console.log(
            "Accept Response:",
            responseText
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Authentication failed. Please login again."
            );

            return;

        }


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Unable to accept request."
            );

        }


        alert(
            "Exchange request accepted! ✅"
        );


        await loadExchangeRequests();


    } catch (error) {

        console.error(
            "Accept Exchange Error:",
            error
        );


        alert(
            error.message
        );

    }
}


// ==========================================
// REJECT EXCHANGE REQUEST
// ==========================================

async function rejectExchangeRequest(id) {

    if (!id) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/exchange/" +
                id +
                "/reject",
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        const responseText =
            await response.text();


        console.log(
            "Reject Status:",
            response.status
        );


        console.log(
            "Reject Response:",
            responseText
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Authentication failed. Please login again."
            );

            return;

        }


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Unable to reject request."
            );

        }


        alert(
            "Exchange request rejected. ❌"
        );


        await loadExchangeRequests();


    } catch (error) {

        console.error(
            "Reject Exchange Error:",
            error
        );


        alert(
            error.message
        );

    }
}


// ==========================================
// UPDATE EXCHANGE COUNT
// ==========================================

function updateExchangeCount(count) {

    const exchangeCount =
        document.getElementById(
            "exchangeCount"
        );


    if (exchangeCount) {

        exchangeCount.textContent =
            count;

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
// HTML ESCAPE
// ==========================================

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
