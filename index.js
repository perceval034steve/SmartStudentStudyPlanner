/* ================= DATA ================= */

let sessions =
    JSON.parse(localStorage.getItem("studySessions")) || [];

let goals =
    JSON.parse(localStorage.getItem("studyGoals")) || [];


/* ================= NAVIGATION ================= */

function showSection(id, button) {

    document.querySelectorAll(".section")
        .forEach(section =>
            section.classList.remove("active")
        );

    document.getElementById(id)
        .classList.add("active");

    document.querySelectorAll(".nav")
        .forEach(nav =>
            nav.classList.remove("active")
        );

    button.classList.add("active");
}


/* ================= DATE ================= */

document.getElementById("date").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });


/* ================= SESSIONS ================= */

function openSessionForm() {

    document.getElementById("sessionForm")
        .classList.remove("hidden");
}

document
    .getElementById("sessionFormElement")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const session = {

            id: Date.now(),

            subject:
                document.getElementById("sessionSubject")
                .value.trim(),

            topic:
                document.getElementById("sessionTopic")
                .value.trim(),

            date:
                document.getElementById("sessionDate")
                .value,

            time:
                document.getElementById("sessionTime")
                .value
        };

        sessions.push(session);

        saveSessions();

        renderSessions();

        updateDashboard();

        this.reset();

        document.getElementById("sessionForm")
            .classList.add("hidden");
    });


function saveSessions() {

    localStorage.setItem(
        "studySessions",
        JSON.stringify(sessions)
    );
}


function renderSessions() {

    const container =
        document.getElementById("sessionsList");

    if (sessions.length === 0) {

        container.innerHTML =
            `<div class="card">
                <p>No study sessions planned yet.</p>
            </div>`;

        return;
    }

    const sorted =
        [...sessions].sort((a, b) =>
            new Date(
                `${a.date}T${a.time}`
            ) -
            new Date(
                `${b.date}T${b.time}`
            )
        );

    container.innerHTML = sorted.map(session => {

        return `
            <div class="session-card">

                <div>
                    <h3>
                        ${escapeHTML(session.topic)}
                    </h3>

                    <small>
                        ${escapeHTML(session.subject)}
                        • ${formatDate(session.date)}
                        • ${session.time}
                    </small>
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteSession(${session.id})">
                    🗑
                </button>

            </div>
        `;

    }).join("");
}


function deleteSession(id) {

    sessions =
        sessions.filter(session =>
            session.id !== id
        );

    saveSessions();

    renderSessions();

    updateDashboard();
}


/* ================= GOALS ================= */

function openGoalForm() {

    document.getElementById("goalForm")
        .classList.remove("hidden");
}


document
    .getElementById("goalFormElement")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const goal = {

            id: Date.now(),

            name:
                document.getElementById("goalName")
                .value.trim(),

            subject:
                document.getElementById("goalSubject")
                .value.trim(),

            completed: false
        };

        goals.push(goal);

        saveGoals();

        renderGoals();

        updateDashboard();

        this.reset();

        document.getElementById("goalForm")
            .classList.add("hidden");
    });


function saveGoals() {

    localStorage.setItem(
        "studyGoals",
        JSON.stringify(goals)
    );
}


function renderGoals() {

    const container =
        document.getElementById("goalList");

    if (goals.length === 0) {

        container.innerHTML =
            `<div class="card">
                <p>No study goals yet.</p>
            </div>`;

        return;
    }

    container.innerHTML = goals.map(goal => {

        return `
            <div class="goal-card
                ${goal.completed ? "completed" : ""}">

                <input
                    class="goal-check"
                    type="checkbox"
                    ${goal.completed ? "checked" : ""}
                    onchange="toggleGoal(${goal.id})"
                >

                <div style="flex:1;margin-left:15px;">

                    <h3>
                        ${escapeHTML(goal.name)}
                    </h3>

                    <small>
                        ${escapeHTML(goal.subject)}
                    </small>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteGoal(${goal.id})">
                    🗑
                </button>

            </div>
        `;

    }).join("");
}


function toggleGoal(id) {

    goals = goals.map(goal => {

        if (goal.id === id) {
            goal.completed = !goal.completed;
        }

        return goal;
    });

    saveGoals();

    renderGoals();

    updateDashboard();
}


function deleteGoal(id) {

    goals =
        goals.filter(goal =>
            goal.id !== id
        );

    saveGoals();

    renderGoals();

    updateDashboard();
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const totalGoals = goals.length;

    const completed =
        goals.filter(goal =>
            goal.completed
        ).length;

    const percentage =
        totalGoals === 0
            ? 0
            : Math.round(
                (completed / totalGoals) * 100
            );


    document.getElementById("sessions")
        .textContent = sessions.length;

    document.getElementById("goalsCount")
        .textContent = totalGoals;

    document.getElementById("completedGoals")
        .textContent = completed;

    document.getElementById("progress")
        .textContent = percentage + "%";

    document.getElementById("progressText")
        .textContent = percentage + "%";

    document.getElementById("progressBar")
        .style.width = percentage + "%";


    let message;

    if (totalGoals === 0) {
        message = "Add your first study goal.";
    } else if (percentage === 100) {
        message = "Amazing! You completed all your goals 🎉";
    } else if (percentage >= 70) {
        message = "Excellent progress. Keep going!";
    } else if (percentage >= 40) {
        message = "You're making good progress.";
    } else {
        message = "Keep studying. Every step counts.";
    }

    document.getElementById("progressMessage")
        .textContent = message;


    updateUpcoming();
}


function updateUpcoming() {

    const container =
        document.getElementById("upcoming");

    const upcoming =
        [...sessions]
        .sort((a, b) =>
            new Date(
                `${a.date}T${a.time}`
            ) -
            new Date(
                `${b.date}T${b.time}`
            )
        )
        .slice(0, 4);


    if (upcoming.length === 0) {

        container.innerHTML =
            `<p>No upcoming sessions.</p>`;

        return;
    }


    container.innerHTML =
        upcoming.map(session => {

            return `
                <div class="upcoming-item">

                    <div>
                        <h4>
                            ${escapeHTML(session.topic)}
                        </h4>

                        <small>
                            ${escapeHTML(session.subject)}
                        </small>
                    </div>

                    <small>
                        ${formatDate(session.date)}
                    </small>

                </div>
            `;

        }).join("");
}


/* ================= HELPERS ================= */

function formatDate(date) {

    return new Date(date + "T00:00:00")
        .toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================= DARK MODE ================= */

const themeBtn =
    document.getElementById("themeBtn");

themeBtn.onclick = () => {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "studyDarkMode",
        dark
    );

    themeBtn.textContent =
        dark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
};


if (
    localStorage.getItem("studyDarkMode")
    === "true"
) {

    document.body.classList.add("dark");

    themeBtn.textContent =
        "☀️ Light Mode";
}


/* ================= START ================= */

renderSessions();
renderGoals();
updateDashboard();