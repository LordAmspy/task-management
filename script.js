// Show/hide sections based on the sectionId parameter
function showSection(sectionId) {
    // Hide all sections by setting display to 'none'
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section by setting its display to 'block'
    document.getElementById(sectionId).style.display = 'block';

    // Set background image based on section
    switch (sectionId) {
        case "dashboard":
            document.body.style.backgroundImage = "url('Dash.png')";
            break;
        case "kanban":
            document.body.style.backgroundImage = "url('Kanban.png')";
            break;
        case "todo":
            document.body.style.backgroundImage = "url('Todo.png')";
            break;
        case "reminders":
            document.body.style.backgroundImage = "url('Reminder.jpeg')";
            break;
        default:
            document.body.style.backgroundImage = "none";
    }

    // Ensure the background covers the entire page
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.transition = 'background-image 0.5s ease-in-out';
}


// Set default section visibility to only show the Dashboard section when the page loads
document.addEventListener("DOMContentLoaded", function() {
    showSection('dashboard');  // Show the dashboard section initially
});


// Add new Kanban task
function addTask(columnId) {
    const taskText = prompt('Enter task description:');
    if (taskText) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.textContent = taskText;
        taskElement.draggable = true;
        taskElement.addEventListener('dragstart', drag);

        // Create a checkbox for task completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        taskElement.insertBefore(checkbox, taskElement.firstChild); // Add checkbox before task text

        // Add task to the In Progress column (inprogress-tasks)
        const columnTasks = document.getElementById('inprogress-tasks');  // Ensure this matches the ID of the "In Progress" column
        columnTasks.appendChild(taskElement);

        // Increment relevant counters
        incrementTotalTasksCounter();
        incrementOngoingCounter();  // Task will be counted as ongoing
        incrementUpcomingCounter(); // Task will be counted as an upcoming task

        // Event listener for checkbox click to mark as completed
        checkbox.addEventListener('click', function() {
            handleKanbanCheckboxClick(checkbox, taskElement, taskText);
        });

        // Update dashboard counters
        updateDashboard();  // This will update all the counters, including the Upcoming Tasks
    }
}


// Create task element with a checkbox
function createTaskElement(taskText) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.textContent = taskText;
    taskElement.draggable = true;
    taskElement.addEventListener('dragstart', drag);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    taskElement.insertBefore(checkbox, taskElement.firstChild); // Add checkbox before task text

    return taskElement;
}

// Helper function to increment task counters
function incrementTaskCounters() {
    incrementTotalTasksCounter();
    incrementUpcomingCounter();
    incrementOngoingCounter();
}

// Increment Total Tasks counter
function incrementTotalTasksCounter() {
    updateCounter('totalTasks', 1);
}

// Increment Upcoming Tasks counter
function incrementUpcomingCounter() {
    updateCounter('upcomingTasks', 1);
}

// Increment Ongoing Tasks counter
function incrementOngoingCounter() {
    updateCounter('ongoingTasks', 1);
}

// Increment Completed Tasks counter
function incrementCompletedCounter() {
    updateCounter('completedTasks', 1);
}

// Update counter by ID and amount
function updateCounter(counterId, amount) {
    const counter = document.getElementById(counterId);
    counter.textContent = parseInt(counter.textContent) + amount;
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
}

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', allowDrop);
    column.addEventListener('drop', drop);
});

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedElement = document.getElementById(event.dataTransfer.getData('text'));
    event.target.closest('.column').querySelector('.task-list').appendChild(draggedElement);
    updateDashboard();
}

// Todo list functionality
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    
    if (todoText) {
        const li = createTodoElement(todoText);
        document.getElementById('todoList').appendChild(li);
        updateDashboard();

        li.querySelector('input').addEventListener('click', function () {
            handleTodoCheckboxClick(this, li, todoText);
        });

        todoInput.value = '';
    }
}

// Create todo element with a checkbox
function createTodoElement(todoText) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const taskText = document.createElement('span');
    taskText.textContent = todoText;
    
    li.appendChild(checkbox);
    li.appendChild(taskText);
    return li;
}

// Handle Todo checkbox click (mark as completed)
function handleTodoCheckboxClick(checkbox, li, taskText) {
    if (checkbox.checked && !li.classList.contains('completed')) {
        li.classList.add('completed');
        li.querySelector('span').style.textDecoration = 'line-through';
        checkbox.disabled = true;
        moveToCompleted(li, taskText, 'todo');
    }
}

// Move task to Completed section
function moveToCompleted(taskElement, taskTextContent, source) {
    taskElement.remove();
    const completedColumn = document.getElementById('done-tasks');
    const completedTaskElement = document.createElement('div');
    completedTaskElement.classList.add('task');
    completedTaskElement.textContent = taskTextContent;
    completedColumn.appendChild(completedTaskElement);
    updateCountersAfterMove(source);
    updateDashboard();
}

function updateCountersAfterMove(source) {
    if (source === 'todo') {
        decrementUpcomingCounter();
    } else if (source === 'inprogress') {
        decrementOngoingCounter();
    }
    incrementCompletedCounter();
}

function decrementUpcomingCounter() {
    updateCounter('upcomingTasks', -1);
}

function decrementOngoingCounter() {
    updateCounter('ongoingTasks', -1);
}

// Handle Kanban checkbox click (mark as completed)
function handleKanbanCheckboxClick(checkbox, taskElement, taskText) {
    if (checkbox.checked && !taskElement.classList.contains('completed')) {
        taskElement.classList.add('completed');
        taskElement.style.textDecoration = 'line-through';
        checkbox.disabled = true;
        moveToCompleted(taskElement, taskText, 'inprogress');
    }
}

// Reminders functionality
function addReminder() {
    const reminderInput = document.getElementById('reminderInput');
    const reminderDate = document.getElementById('reminderDate');
    const reminderText = reminderInput.value.trim();
    const date = reminderDate.value;

    if (reminderText && date) {
        const li = createReminderElement(reminderText, date);
        document.getElementById('reminderList').appendChild(li);
        updateDashboard();

        li.querySelector('input').addEventListener('click', function () {
            if (this.checked) {
                li.remove();
                updateDashboard();
            }
        });

        reminderInput.value = '';
        reminderDate.value = '';
    }
}

// Create reminder element
function createReminderElement(reminderText, date) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const reminderTextNode = document.createTextNode(`${reminderText} - ${new Date(date).toLocaleString()}`);
    
    li.appendChild(checkbox);
    li.appendChild(reminderTextNode);
    return li;
}

// Update dashboard counters
function updateDashboard() {
    // Total tasks: all tasks in all columns and Todo List items
    const totalTasks = document.querySelectorAll('.task').length + document.querySelectorAll('#todoList li').length;

    // Completed tasks: tasks in the completed column
    const completedTasks = document.querySelectorAll('#done-tasks .task').length;

    // Ongoing tasks: tasks in the Todo List section
    const ongoingTasks = document.querySelectorAll('#todoList li').length;

    // Upcoming tasks: tasks in the Kanban "In Progress" column
    const upcomingTasks = document.querySelectorAll('#inprogress-tasks .task').length;

    // Reminders: tasks in the reminder list
    const reminders = document.querySelectorAll('#reminderList li').length;

    // Update the counters for each section
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('ongoingTasks').textContent = ongoingTasks; // Ongoing Tasks now linked to Todo List
    document.getElementById('upcomingTasks').textContent = upcomingTasks; // This will now correctly show the number of upcoming tasks in the In Progress column
    document.getElementById('remindersCount').textContent = reminders;
}




