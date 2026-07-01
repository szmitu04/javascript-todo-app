const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (taskInput.value.trim().length !== 0) {
    //if (taskInput.value.trim()) { też zadziała, bo pusty string jest false

    createTask(taskInput.value);
  }
  taskInput.value = "";
});

function createTask(text) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  const span = document.createElement("span");
  const button = document.createElement("button");
  button.textContent = "Delete";
  span.textContent = text;
  taskItem.appendChild(span);
  taskItem.appendChild(button);
  taskList.appendChild(taskItem);

  button.addEventListener("click", function () {
    taskItem.remove();
  });
}
