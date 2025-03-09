class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.isRunning = false;
        this.interval = null;
        this.tasks = [];
        this.currentTaskId = null;

        // Timer elements
        this.timeDisplay = document.querySelector('.time-display');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modeBtns = document.querySelectorAll('.mode-btn');

        // Task elements
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskInput = document.getElementById('taskInput');
        this.saveTaskBtn = document.getElementById('saveTaskBtn');
        this.cancelTaskBtn = document.getElementById('cancelTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.taskInputContainer = document.querySelector('.task-input-container');

        // Notification elements
        this.notification = document.getElementById('notification');
        this.notificationMessage = document.getElementById('notificationMessage');
        this.closeNotification = document.getElementById('closeNotification');

        this.initializeEventListeners();
        this.loadTasks();
    }

    initializeEventListeners() {
        // Timer controls
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // Mode buttons
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.timeLeft = parseInt(btn.dataset.time) * 60;
                this.updateDisplay();
                this.resetTimer();
            });
        });

        // Task controls
        this.addTaskBtn.addEventListener('click', () => this.showTaskInput());
        this.saveTaskBtn.addEventListener('click', () => this.saveTask());
        this.cancelTaskBtn.addEventListener('click', () => this.hideTaskInput());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveTask();
        });

        // Notification
        this.closeNotification.addEventListener('click', () => this.hideNotification());
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.textContent = 'Pause';
        this.startBtn.style.backgroundColor = 'var(--danger-color)';

        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft === 0) {
                this.timerComplete();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.startBtn.style.backgroundColor = 'var(--primary-color)';
        clearInterval(this.interval);
    }

    resetTimer() {
        this.pauseTimer();
        const activeMode = document.querySelector('.mode-btn.active');
        this.timeLeft = parseInt(activeMode.dataset.time) * 60;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    timerComplete() {
        this.pauseTimer();
        this.showNotification('Time is up! Take a break.');
        const notification = new Notification('Pomodoro Timer', {
            body: 'Time is up! Take a break.',
            icon: 'favicon.ico'
        });
    }

    showTaskInput() {
        this.taskInputContainer.style.display = 'block';
        this.taskInput.focus();
    }

    hideTaskInput() {
        this.taskInputContainer.style.display = 'none';
        this.taskInput.value = '';
    }

    saveTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                timestamp: new Date().toISOString()
            };

            this.tasks.push(task);
            this.saveTasks();
            this.renderTask(task);
            this.hideTaskInput();
            this.showNotification('Task added successfully!');
        }
    }

    renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.id = task.id;

        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="task-delete">×</button>
        `;

        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTaskComplete(task.id));

        const deleteBtn = taskElement.querySelector('.task-delete');
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        this.taskList.insertBefore(taskElement, this.taskList.firstChild);
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            const taskElement = document.querySelector(`[data-id="${taskId}"]`);
            const taskText = taskElement.querySelector('.task-text');
            taskText.classList.toggle('completed');
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        taskElement.remove();
        this.showNotification('Task deleted!');
    }

    saveTasks() {
        localStorage.setItem('pomodoroTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('pomodoroTasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.tasks.forEach(task => this.renderTask(task));
        }
    }

    showNotification(message) {
        this.notificationMessage.textContent = message;
        this.notification.style.display = 'flex';
        setTimeout(() => this.hideNotification(), 3000);
    }

    hideNotification() {
        this.notification.style.display = 'none';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Create Pomodoro instance
    const pomodoro = new PomodoroTimer();
}); 