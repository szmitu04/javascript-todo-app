const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");
const allBtn = document.querySelector("#allBtn");
const activeBtn = document.querySelector("#activeBtn");
const completedBtn = document.querySelector("#completedBtn");
const totalTasks = document.querySelector("#totalAmnt");
const remainingTasks = document.querySelector("#remainingAmnt");
const completedTasks = document.querySelector("#completedAmnt");
const filterButtons = document.querySelectorAll(".filter-btn");
const dueDate = document.querySelector("#taskDate");

let tasks = [];
let currentFilter = "all";
const today = new Date();

dueDate.value = today.toISOString().split("T")[0];

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (taskInput.value.trim().length !== 0) {
    //if (taskInput.value.trim()) { też zadziała, bo pusty string jest false
    const newTask = {
      text: taskInput.value,
      completed: false,
      dueDate: dueDate.value,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }
  taskInput.value = "";
});

function createTask(task) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  const span = document.createElement("span");

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");
  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const button = document.createElement("button");
  button.textContent = "Delete";
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("completed");
  }

  const dueDateElement = document.createElement("small");
  dueDateElement.classList.add("due-date");

  dueDateElement.textContent = new Date(task.dueDate).toLocaleDateString(
    "en-GB",
  );

  taskContent.appendChild(span);
  //taskContent.appendChild(dueDateElement); //usunołem dla estetyki, nie trzeba dwa razy pisać daty zadania, bo jest już w tytule grupy zadań
  taskActions.appendChild(button);
  taskActions.appendChild(editButton);

  taskItem.appendChild(taskContent);
  taskItem.appendChild(taskActions);

  taskList.appendChild(taskItem);
  span.addEventListener("click", function () {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  button.addEventListener("click", function () {
    const taskIndex = tasks.findIndex((t) => t === task); //szuka objektu w liscie objektów który jest klikanym objektem

    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
  });

  editButton.addEventListener("click", function () {
    editTask(task, span, taskContent, editButton, taskActions);
    //editTask(taskItem, task.text);
  });
}

function editTask(task, span, taskContent, editButton, taskActions) {
  const field = document.createElement("input");
  field.value = task.text;
  field.focus();

  taskContent.replaceChild(field, span);
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";

  taskActions.replaceChild(saveButton, editButton);

  field.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      task.text = field.value;
      saveTasks();
      renderTasks();
    }
  });
  saveButton.addEventListener("click", function () {
    task.text = field.value;
    saveTasks();
    renderTasks();
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    renderTasks();
  }
}
loadTasks();

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const groupedTasks = Object.groupBy(filteredTasks, ({ dueDate }) => dueDate); // Fajnie działa ale zwraca objekt

  Object.entries(groupedTasks).forEach(([date, tasks]) => {
    createTitle(date);

    tasks.forEach((task) => {
      createTask(task);
    });
  });

  renderStatistics();
  updateFilterButtons();
}

function createTitle(tasksDate) {
  const titleDate = document.createElement("h3");
  titleDate.classList.add("task-date");

  const dateOfTask = new Date(tasksDate);
  dateOfTask.setHours(0, 0, 0, 0);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setHours(0, 0, 0, 0);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  if (dateOfTask.getTime() === todayDate.getTime()) {
    titleDate.textContent = "Today";
  } else if (dateOfTask.getTime() < todayDate.getTime()) {
    titleDate.textContent = "Overdue";
  } else if (dateOfTask.getTime() === tomorrowDate.getTime()) {
    titleDate.textContent = "Tomorrow";
  } else {
    titleDate.textContent = new Date(tasksDate).toLocaleDateString("pl-PL");
  }

  taskList.appendChild(titleDate);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

function renderStatistics() {
  totalTasks.textContent = tasks.length;
  remainingTasks.textContent = tasks.filter((task) => !task.completed).length;
  completedTasks.textContent = tasks.filter((task) => task.completed).length;
}

function updateFilterButtons() {
  filterButtons.forEach((button) => button.classList.remove("active"));

  if (currentFilter === "all") {
    allBtn.classList.add("active");
  } else if (currentFilter === "active") {
    activeBtn.classList.add("active");
  } else {
    // wiem że można by było użyć else if, ale w tym przypadku else wystarczy, bo mamy tylko 3 opcje
    completedBtn.classList.add("active");
  }
}
