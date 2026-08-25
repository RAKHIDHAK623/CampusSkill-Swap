
// CAMPUS SKILLSWAP - REALTIME NOTIFICATION SYSTEM
// Firebase Realtime Database

import {
    getDatabase,
    ref,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const db = getDatabase();



// CURRENT USER

const userId = localStorage.getItem("userId");

console.log("Realtime Notification User ID:", userId);


// START REALTIME NOTIFICATION

function startRealtimeNotifications() {

    if (!userId) {

        console.warn(
            "No userId found. Realtime notification disabled."
        );

        return;
    }


    // Firebase path
    const notificationRef =
        ref(
            db,
            "notifications/" + userId
        );


    console.log(
        "Listening for realtime notifications..."
    );


    // REALTIME LISTENER

    onValue(
        notificationRef,
        function(snapshot) {

            const data =
                snapshot.val();


            console.log(
                "Realtime notification data:",
                data
            );


            if (!data) {

                updateNotificationUI([]);

                return;
            }


            const notifications =
                Object.entries(data)
                .map(function([id, value]) {

                    return {
                        id: id,
                        ...value
                    };

                });


            updateNotificationUI(
                notifications
            );

        }
    );

}


// UPDATE UI

function updateNotificationUI(
    notifications
) {

    const button =
        document.querySelector(
            ".notification-btn"
        );


    if (!button) {
        return;
    }


    const unreadNotifications =
        notifications.filter(
            function(notification) {

                return (
                    notification.read === false ||
                    notification.read === undefined
                );

            }
        );


    // BADGE

    let badge =
        button.querySelector(
            ".notification-count"
        );


    if (
        unreadNotifications.length > 0
    ) {

        if (!badge) {

            badge =
                document.createElement(
                    "span"
                );

            badge.className =
                "notification-count";

            button.appendChild(
                badge
            );

        }


        badge.textContent =
            unreadNotifications.length > 99
                ? "99+"
                : unreadNotifications.length;


        badge.style.display =
            "flex";

    } else {

        if (badge) {

            badge.style.display =
                "none";

        }

    }


    // NOTIFICATION LIST

    const list =
        document.getElementById(
            "notificationList"
        );


    if (!list) {
        return;
    }


    if (
        notifications.length === 0
    ) {

        list.innerHTML = `

            <div class="notification-empty">

                <div>
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

        return;
    }


    list.innerHTML = "";


    notifications
        .reverse()
        .forEach(
            function(notification) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification-item";


                if (
                    notification.read === false ||
                    notification.read === undefined
                ) {

                    item.classList.add(
                        "unread"
                    );

                }


                item.innerHTML = `

                    <div class="notification-icon">

                        ${notification.icon || "🔔"}

                    </div>


                    <div class="notification-content">

                        <strong>

                            ${escapeHTML(
                                notification.title ||
                                "Notification"
                            )}

                        </strong>


                        <p>

                            ${escapeHTML(
                                notification.message ||
                                ""
                            )}

                        </p>


                        <span class="notification-time">

                            ${notification.time || "Just now"}

                        </span>

                    </div>

                `;


                // CLICK
                item.addEventListener(
                    "click",
                    function() {

                        markNotificationRead(
                            notification.id
                        );

                    }
                );


                list.appendChild(
                    item
                );

            }
        );

}



// MARK ONE NOTIFICATION READ


async function markNotificationRead(
    notificationId
) {

    if (!userId || !notificationId) {
        return;
    }


    try {

        const notificationRef =
            ref(
                db,
                "notifications/" +
                userId +
                "/" +
                notificationId
            );


        await update(
            notificationRef,
            {
                read: true
            }
        );


        console.log(
            "Notification marked as read:",
            notificationId
        );


    } catch(error) {

        console.error(
            "Unable to mark notification read:",
            error
        );

    }

}



// MARK ALL READ


async function markAllNotificationsRead() {

    if (!userId) {
        return;
    }


    const notificationRef =
        ref(
            db,
            "notifications/" +
            userId
        );


    try {

        const updates = {};


        const snapshotData =
            await new Promise(
                function(resolve) {

                    const unsubscribeNotifications = onValue(
                    notificationRef,
                    function(snapshot) {
                        // notification handling
                    }
                );

                }
            );


        const data =
            snapshotData.val();


        if (!data) {
            return;
        }


        Object.keys(data)
            .forEach(
                function(id) {

                    updates[
                        id + "/read"
                    ] = true;

                }
            );


        await update(
            notificationRef.parent,
            updates
        );


        console.log(
            "All notifications marked as read."
        );


    } catch(error) {

        console.error(
            "Mark all read error:",
            error
        );

    }

}


// ESCAPE HTML


function escapeHTML(value) {

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


// GLOBAL

window.startRealtimeNotifications =
    startRealtimeNotifications;

window.markNotificationRead =
    markNotificationRead;

window.markAllNotificationsRead =
    markAllNotificationsRead;


// START


document.addEventListener(
    "DOMContentLoaded",
    function() {

        startRealtimeNotifications();

    }
);
