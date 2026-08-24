/* =========================
   DATE
========================= */

const today = new Date();

const todayString =
  today.toISOString().split("T")[0];

document.getElementById("currentDate").textContent =
  today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });


/* =========================
   TASK DATA
========================= */

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "today";


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}


/* =========================
   ADD TASK
========================= */

function addTask() {

  const input =
    document.getElementById("taskInput");

  const dateInput =
    document.getElementById("taskDate");

  const priorityInput =
    document.getElementById("taskPriority");

  const text =
    input.value.trim();

  if (!text) {

    alert("Enter a task first.");

    return;

  }

  const date =
    dateInput.value || todayString;

  tasks.push({

    id: Date.now(),

    text: text,

    date: date,

    priority: priorityInput.value,

    completed: false

  });

  input.value = "";

  dateInput.value = "";

  priorityInput.value = "medium";

  saveTasks();

  renderTasks();

}


/* =========================
   COMPLETE TASK
========================= */

function toggleTask(id) {

  const task =
    tasks.find(task => task.id === id);

  if (task) {

    task.completed =
      !task.completed;

  }

  saveTasks();

  renderTasks();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

  tasks =
    tasks.filter(task => task.id !== id);

  saveTasks();

  renderTasks();

}


/* =========================
   FILTER
========================= */

function setFilter(filter) {

  currentFilter = filter;

  document
    .querySelectorAll(".filter-button")
    .forEach(button => {

      button.classList.remove("active");

    });

  if (filter === "today") {

    document
      .getElementById("todayFilter")
      .classList.add("active");

  }

  if (filter === "upcoming") {

    document
      .getElementById("upcomingFilter")
      .classList.add("active");

  }

  if (filter === "all") {

    document
      .getElementById("allFilter")
      .classList.add("active");

  }

  renderTasks();

}


/* =========================
   FILTER TASKS
========================= */

function getFilteredTasks() {

  if (currentFilter === "today") {

    return tasks.filter(
      task => task.date === todayString
    );

  }

  if (currentFilter === "upcoming") {

    return tasks.filter(
      task => task.date > todayString
    );

  }

  return tasks;

}


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

  const taskList =
    document.getElementById("taskList");

  taskList.innerHTML = "";

  const filteredTasks =
    getFilteredTasks();

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
      <div class="empty">
        No tasks here.
      </div>
    `;

    return;

  }

  filteredTasks.forEach(task => {

    const div =
      document.createElement("div");

    div.className = "task";

    const formattedDate =
      new Date(
        task.date + "T00:00:00"
      ).toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric"
        }
      );

    div.innerHTML = `

      <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${task.id})"
      >

      <div class="task-content">

        <div
          class="task-title
          ${task.completed ? "completed" : ""}"
        >
          ${escapeHTML(task.text)}
        </div>

        <div class="task-meta">

          ${formattedDate}

          &nbsp; • &nbsp;

          <span class="priority ${task.priority}">
            ${task.priority}
          </span>

        </div>

      </div>

      <button
        class="delete-button"
        onclick="deleteTask(${task.id})"
      >
        Delete
      </button>

    `;

    taskList.appendChild(div);

  });

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================
   NOTES
========================= */

const notes =
  document.getElementById("notes");

notes.value =
  localStorage.getItem("notes") || "";

notes.addEventListener(
  "input",
  function() {

    localStorage.setItem(
      "notes",
      notes.value
    );

    document.getElementById(
      "saveMessage"
    ).textContent =
      "Saved";

  }
);


/* =========================
   START APP
========================= */

renderTasks();
