// Control of JS 
console.log("JavaScript is loaded!");


// Get elements
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const filterStatus = document.getElementById("filter-status");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add new task
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("task-name").value.trim();
  const category = document.getElementById("task-category").value.trim();
  const deadline = document.getElementById("task-deadline").value;
  const status = document.getElementById("task-status").value;

  if (!name || !deadline) return;

  const task = { name, category, deadline, status };
  tasks.push(task);
  saveAndRender();
  taskForm.reset();
});

// Save to localStorage and re-render
function saveAndRender() {
  updateOverdueTasks();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Update tasks based on filter
filterStatus.addEventListener("change", renderTasks);

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  const currentDate = new Date().toISOString().split("T")[0];
  const filter = filterStatus.value;

  tasks.forEach((task, index) => {
    if (filter && task.status !== filter) return;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row";

    const content = document.createElement("div");
    content.innerHTML = `<strong>${task.name}</strong><br>
        Category: ${task.category || "N/A"}<br>
        Deadline: ${task.deadline}<br>
        Status: `;

    const statusSelect = document.createElement("select");
    statusSelect.className = "form-select form-select-sm mt-1 mt-md-0 w-auto";
    ["Not Started", "In Progress", "Completed", "Overdue"].forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      if (task.status === option) opt.selected = true;
      statusSelect.appendChild(opt);
    });

    statusSelect.addEventListener("change", () => {
      task.status = statusSelect.value;
      saveAndRender();
    });

    li.appendChild(content);
    li.appendChild(statusSelect);
    taskList.appendChild(li);
  });
}

// Mark overdue tasks
function updateOverdueTasks() {
  const today = new Date().toISOString().split("T")[0];
  tasks.forEach((task) => {
    if (task.status !== "Completed" && task.deadline < today) {
      task.status = "Overdue";
    }
  });
}

// Initialize
saveAndRender();



  