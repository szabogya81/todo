const addTaskBtn = document.querySelector('.btn--add');
const addTaskInput = document.querySelector('.input--add');
const clearButton = document.querySelector('.btn--clear');
const completedItems = document.querySelector('.completed__percent');
const dateHeading = document.querySelector('.todo__date');
const dayHeading = document.querySelector('.todo__day');
const pendigItems = document.querySelector('.pending__count');
const showHideButton = document.querySelector('.btn--hide');
const todoCompletedSection = document.querySelector('.todo__completed');
const todoList = document.querySelector('.todo__pending .todoList');
const todoListCompleted = document.querySelector('.todo__completed .todoList');
const zeroTaskParagraph = document.querySelector('.zeroTask');

let latestTaskId;

const storageHandler = {
    addTask(taskName) { return addTask(this, taskName); },
    removeTask(taskId) { removeTask(taskId); },
    clear() { deleteTasks(); },
    getTasks() { return getTasks(); },
    getLatestTaskId() { return getLatestTaskId(); },
    setLatestTaskId(taskId) { setLatestTaskId(taskId); }
}

function addTask(handler, taskName) {
    let newTaskId = 'dTask_' + String(latestTaskId + 1).padStart(3, '0');
    localStorage.setItem(newTaskId, taskName);
    handler.setLatestTaskId(++latestTaskId);
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
    let taskKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('dTask_')).sort().reverse();
    return taskKeys.map(key => [key, localStorage.getItem(key)]);
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
    setButtonEvenetHandlers();
    setCompleteHandlers();
    setDateHeadings();
}

function setCompleteHandlers() {
    let completeCheckBoxes = document.querySelectorAll('.todoList__checkbox');
    completeCheckBoxes.forEach(item => item.addEventListener('change', completePendingTask));
}

function setDeleteHandlers() {
    let deleteSpans = document.querySelectorAll('.todoList__delete');
    deleteSpans.forEach(item => item.addEventListener('click', deletePendingTask));
}

function setButtonEvenetHandlers() {
    setDeleteHandlers();
    addTaskBtn.addEventListener('click', addNewTask);
    showHideButton.addEventListener('click', showHideCompleted);
    clearButton.addEventListener('click', deletePendingTasks);
}

function setDateHeadings() {
    let currentDate = new Date();
    dayHeading.textContent = 
        `${currentDate.toLocaleDateString('en-US', { weekday: 'long'})}`;
    dateHeading.textContent = 
        `${currentDate.toLocaleDateString('en-US', 
        { day: '2-digit'})}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
}

function setTaskStatistics(pendingCount, completedCount = 0) {
    pendigItems.textContent = `You have ${pendingCount} pending item(s)`;
    let completedPercent = completedCount > 0 ? 
        (completedCount / (pendingCount + completedCount)) * 100 : 0;
    completedItems.textContent = `Completed tasks: ${completedPercent.toFixed(2)}%`
}

function addNewTask() {
    if(addTaskInput.value.length > 0) {
        let newTaskId = storageHandler.addTask(addTaskInput.value);
        addTaskInput.value = '';
        updatePendingTasks();
        document.querySelector(`input[value=${newTaskId}]`)
        .parentElement.classList.add('new');
    }  
}

function addTaskToList(task, isNew = true) {
    let liItem = createTaskListItem(task[0], task[1], isNew);
    if(isNew) { 
        todoList.appendChild(liItem); 
    } else {
        if(todoListCompleted.hasChildNodes) {
            todoListCompleted.insertBefore(liItem, todoListCompleted.childNodes[0]);
        } else {
            todoListCompleted.appendChild(liItem);
        }
    }
}

function createTaskListItem(taskId, taskName, isNew = true) {
    let liItem = document.createElement('li');
    liItem.innerHTML = createTaskListItemInner(taskId, taskName, isNew);
    if(!isNew) { liItem.classList.add('completed'); }
    return liItem;
}

function createTaskListItemInner(taskId, taskName, isNew) {
    let liInner= `<input class="todoList__checkbox" type="checkbox" value="${taskId}">
        <span class="todoList__text">${taskName}</span>`
        liInner += isNew ? '<span class="todoList__delete">🗑</span>' : '';
    return liInner;
}

function completePendingTask(e) {
    if(this.checked) {
        let taskId = e.currentTarget.value;
        let taskName = e.currentTarget.parentElement.children[1].textContent;
        storageHandler.removeTask(taskId);
        addTaskToList([taskId, taskName], false);
        updatePendingTasks();
        checkCompleted();
    }
}

function checkCompleted() {
    let completeCheckBoxes = document.querySelectorAll('li.completed .todoList__checkbox');
    completeCheckBoxes.forEach(checkBox => checkBox.checked = 'checked');
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
    setCompleteHandlers();
    setTaskStatistics(pendingTasks.length, todoListCompleted.childElementCount);
    checkTaskList(!pendingTasks.length);
}

function checkTaskList(noTask) {
    if(noTask) {
        zeroTaskParagraph.classList.add('show');
    } else {
        zeroTaskParagraph.classList.remove('show');
    }
}

function showHideCompleted(e) {
    let buttonLabel = e.currentTarget.labels[0];
    buttonLabel.textContent = todoCompletedSection.classList.toggle('show') ? 
        'Hide Completed' : 'Show Completed';

    setTaskStatistics(todoList.childElementCount, todoListCompleted.childElementCount);
}

init(); 