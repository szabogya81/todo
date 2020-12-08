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
const todoList = document.querySelector('.todoList');

const storageHandler = {
    addTask(taskName) { addTask(taskName) },
    removeTask(taskId) {},
    getTasks() { return getTasks() },
    getLatestTaskId() { return getLatestTaskId(); },
    setLatestTaskId(taskId) { setLatestTaskId(taskId); }
}

function addTask(taskName) {
    localStorage.setItem('dTask_' + (latestTaskId + 1), taskName);
    storageHandler.setLatestTaskId(++latestTaskId);
}

function removeTask(taskId) {
    localStorage.removeItem(taskId);
}

function getTasks() {
    let taskKeys = Object.keys(localStorage).filter(key => key.startsWith('dTask_'));
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
    if(!latestTaskId) { latestTaskId = 1; }
    let tasks = storageHandler.getTasks();
    fillTaskList(tasks);
    addTaskBtn.addEventListener('click', addNewTask);

}

function addNewTask(){
    if(addTaskInput.value.length > 0) {
        storageHandler.addTask(addTaskInput.value);
    }
}

function fillTaskList(taskArray) {
    taskArray.forEach(task => addTaskToList(task));
}

function addTaskToList(task) {
    let liInner = createTaskListItem(task[0], task[1]);
    let liItem = document.createElement('li');
    liItem.innerHTML = liInner;

    todoList.appendChild(liItem);
}

function createTaskListItem(taskId, taskName) {
    let liItem = `<input class="todo-checkbox" type="checkbox" value="${taskId}">
        <span class="todo-text">${taskName}</span>
        <span class="delete">🗑</span>`
    // let li = document.createElement('li');
    // let input = document.createElement('input', { type: 'checkbox', class: 'todo-checkbox', value: taskId});
    // let nameSpan = document.createElement('span', { class: 'todo-text', textContent: taskName});
    // let deleteSpan = document.createElement('span', { class: 'delete', textContent: '🗑'});

    // li.appendChild(input);
    // li.appendChild(nameSpan);
    // li.appendChild(deleteSpan);

    return liItem;
}

/*<li>
                    <input class="todo-checkbox" type="checkbox" value="1">
                    <span class="todo-text">do it</span>
                    <span class="delete">🗑</span>
                </li>

*/

init();