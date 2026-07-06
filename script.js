const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");
const allBtn = document.querySelector("#allBtn");
const activeBtn = document.querySelector("#activeBtn");
const completedBtn = document.querySelector("#completedBtn");
const totalTasks = document.querySelector("#totalAmnt");
const remainingTasks = document.querySelector("#remainingAmnt");
const completedTasks = document.querySelector("#completedAmnt");

let tasks = [];
let currentFilter = "all";

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (taskInput.value.trim().length !== 0) {
    //if (taskInput.value.trim()) { też zadziała, bo pusty string jest false
    const newTask = {
      text: taskInput.value,
      completed: false,
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
  const button = document.createElement("button");
  button.textContent = "Delete";
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("completed");
  }

  taskItem.appendChild(span);
  taskItem.appendChild(button);
  taskList.appendChild(taskItem);
  span.addEventListener("click", function () {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  button.addEventListener("click", function () {
    const removedList = tasks.findIndex((t) => t === task); //szuka objektu w liscie objektów który jest klikanym objektem

    tasks.splice(removedList, 1);
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

  filteredTasks.forEach((task) => {
    createTask(task, index);
  });
  renderStatistics();
}

allBtn.addEventListener("click", function () {
  currentFilter = "all";
  renderTasks();
});

activeBtn.addEventListener("click", function () {
  currentFilter = "active";
  renderTasks();
});

completedBtn.addEventListener("click", function () {
  currentFilter = "completed";
  renderTasks();
});

function renderStatistics() {
  totalTasks.textContent = tasks.length;
  remainingTasks.textContent = tasks.filter((task) => !task.completed).length;
  completedTasks.textContent = tasks.filter((task) => task.completed).length;
}
