const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");
let tasks = [];

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
    createTask(newTask);
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
    span.classList.toggle("completed");
    saveTasks();
  });

  button.addEventListener("click", function () {
    taskItem.remove();
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach((element) => {
      createTask(element);
    });
  }
}
loadTasks();
