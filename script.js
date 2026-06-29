const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#task");

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (taskInput.value.trim().length !== 0) {
    //if (taskInput.value.trim()) { też zadziała, bo pusty string jest false
    const taskItem = document.createElement("li");
    taskItem.textContent = taskInput.value;
    taskList.appendChild(taskItem);
  }
  taskInput.value = "";
});
