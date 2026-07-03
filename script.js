const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");
const allBtn = document.querySelector("#allBtn");
const activeBtn = document.querySelector("#activeBtn");
const completedBtn = document.querySelector("#completedBtn");

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

function createTask(task, index) {
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
    tasks.splice(index, 1);
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
  tasks.forEach((task, index) => {
    createTask(task, index);
  });
}

allBtn.addEventListener("click", function () {
  renderTasks();
});

activeBtn.addEventListener("click", function () {
  taskList.innerHTML = "";
  const filteredArray = tasks.filter((task) => task.completed === false);
  filteredArray.forEach((task, index) => {
    createTask(task, index);
  });
});
