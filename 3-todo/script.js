const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const errorEl = document.getElementById("error");
const clearBtn = document.getElementById("clear-completed");
const filters = document.querySelector(".filters");
const fragment = document.createDocumentFragment();

let tasks = [];
let currentFilter = "all";
let nextId = 1;

function addTask() {
  const text = input.value.trim();
  if (text.length === 0) {
    errorEl.hidden = false;
    errorEl.textContent = 'Введите текст задачи';
    return;  
  }
  errorEl.hidden = true;
  tasks.push({ id: nextId++, text: text, done: false });
  input.value = "";
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = !task.done;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

function getActiveTasks() {
  return tasks.filter(task => !task.done);
}

function getDoneTasks() {
  return tasks.filter(task => task.done);
}

function clearCompleted() {
  tasks = getActiveTasks();
  render();
}

function getVisibleTasks() {
  let visibleTasks = tasks;
  if (currentFilter === 'done') {
    visibleTasks = getDoneTasks();
  }
  if (currentFilter === 'active') {
    visibleTasks = getActiveTasks();
  }
  return visibleTasks;
}

function updateCounter() {
  counter.textContent = "Активных задач: " + getActiveTasks().length;
}

function render() {
  const visible = getVisibleTasks();
  list.innerHTML = '';
  updateCounter();
  if (visible.length === 0) {
    return;
  }
  for (let i = 0; i < visible.length; i += 1) {
    const task = visible[i];
  
    const li = document.createElement("li");
    li.className = "task";
    li.dataset.taskId = task.id;
    if (task.done) {
      li.classList.add('completed');
    }

    const span = document.createElement("span");
    span.className = "task__text";
    span.textContent = task.text;

    const del = document.createElement("button");
    del.className = "task__del";
    del.textContent = "✕";

    li.appendChild(span);
    li.appendChild(del);
    fragment.appendChild(li);
  }
  list.appendChild(fragment);
}

addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);

filters.addEventListener("click", (e) => {
  if (e.target.closest('.filter')) {
    const filter = e.target.closest('.filter');
    [...filters.children].forEach((element) => element.classList.remove("active"));
    filter.classList.add("active");
    currentFilter = filter.dataset.filter;
    render();
  }
});

list.addEventListener('click', (e) => {
  if (e.target.closest('.task')) {
    const target = e.target.closest('.task');
    toggleTask(Number(target.dataset.taskId));
    target.classList.toggle('completed');
  } 
  if (e.target.closest('.task__del')) {
    const target = e.target.closest('.task__del').parentElement;
    deleteTask(Number(target.dataset.taskId));
  }  
});

render();
