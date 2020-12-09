let currentDate = new Date();
let latestTaskId;
const dayHeading = document.querySelector('.todo__day');
const dateHeading = document.querySelector('.todo__date');
dayHeading.textContent = 
`${currentDate.toLocaleDateString('en-US', { weekday: 'long'})}`;
dateHeading.textContent = 
`${currentDate.toLocaleDateString('en-US', { day: '2-digit'})}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

const addTaskInput = document.querySelector('.input--add');
const addTaskBtn = document.querySelector('.btn--add');
const todoList = document.querySelector('.todo__pending .todoList');
const todoListCompleted = document.querySelector('.todo__completed .todoList');
const todoCompletedSection = document.querySelector('.todo__completed');

const pendigItems = document.querySelector('.pending__count');
const completedItems = document.querySelector('.completed__percent');
const showHideButton = document.querySelector('.btn--hide');
const clearButton = document.querySelector('.btn--clear');


const storageHandler = {
    addTask(taskName) { return addTask(taskName); },
    removeTask(taskId) { removeTask(taskId); },
    clear() { deleteTasks(); },
    getTasks() { return getTasks(); },
    getLatestTaskId() { return getLatestTaskId(); },
    setLatestTaskId(taskId) { setLatestTaskId(taskId); }
}

function addTask(taskName) {
    let newTaskId = 'dTask_' + String(latestTaskId + 1).padStart(3, '0');
    localStorage.setItem(newTaskId, taskName);
    storageHandler.setLatestTaskId(++latestTaskId);
    return newTaskId;
}

function removeTask(taskId) {
    localStorage.removeItem(taskId);
}

function deleteTasks() {
    Object.keys(localStorage)
        .filter(key => key.startsWith('dTask_'))
        .forEach( key => localStorage.removeItem(key));
}

function getTasks() {
    let taskKeys = Object.keys(localStorage).filter(key => key.startsWith('dTask_')).sort();
    let taskArray = [];
    taskKeys.forEach(key => taskArray.push([key, localStorage.getItem(key)]));
    return taskArray;
}

function getLatestTaskId() {
    return localStorage.getItem('latestTaskId');
}

function setLatestTaskId(taskId) {
    localStorage.setItem('latestTaskId', taskId);
}

function init() {
    latestTaskId = Number.parseInt(storageHandler.getLatestTaskId());
    if(!latestTaskId) { latestTaskId = 0; }
    updatePendingTasks();
    setDeleteHandlers();
    addTaskBtn.addEventListener('click', addNewTask);
    showHideButton.addEventListener('click', showHideCompleted);
    clearButton.addEventListener('click', deletePendingTasks);
}

function setDeleteHandlers() {
    let deleteSpans = document.querySelectorAll('.delete');
    deleteSpans.forEach(item => item.addEventListener('click', deletePendingTask));
}

function setTaskStatistics(pendingCount, completedCount = 0) {
    pendigItems.textContent = `You have ${pendingCount} pending item(s)`;
    let completedPercent = completedCount > 0 ? (completedCount / (pendingCount + completedCount)) * 100 : 0;
    completedItems.textContent = `Completed tasks: ${completedPercent.toFixed(2)}%`
}

function addNewTask() {
    if(addTaskInput.value.length > 0) {
        storageHandler.addTask(addTaskInput.value);
        addTaskInput.value = '';
        updatePendingTasks();
    }  
}

function addTaskToList(task, isNew = false) {
    let liInner = createTaskListItem(task[0], task[1]);
    let liItem = document.createElement('li');
    if(isNew) { liItem.classList.add('new') };
    liItem.innerHTML = liInner;
    todoList.appendChild(liItem);
}

function createTaskListItem(taskId, taskName) {
    let liItem = `<input class="todo-checkbox" type="checkbox" value="${taskId}">
        <span class="todo-text">${taskName}</span>
        <span class="delete">🗑</span>`
    return liItem;
}

function deletePendingTask(e) {
    let taskId = e.currentTarget.parentElement.firstChild.value;
    storageHandler.removeTask(taskId);
    updatePendingTasks();
}

function deletePendingTasks() {
    storageHandler.clear();
    storageHandler.setLatestTaskId(0);
    latestTaskId = 0;
    updatePendingTasks();
}

function updatePendingTasks() {
    todoList.innerHTML = '';
    let pendingTasks = storageHandler.getTasks();
    pendingTasks.forEach(task => addTaskToList(task));
    setDeleteHandlers();
    setTaskStatistics(pendingTasks.length, todoListCompleted.childElementCount);
}

function showHideCompleted(e) {
    let buttonLabel = e.currentTarget.labels[0];
    buttonLabel.textContent = todoCompletedSection.classList.toggle('show') ? 
        'Hide Completed' : 'Show Completed';
        
    setTaskStatistics(todoList.childElementCount, todoListCompleted.childElementCount);
}

init();