const API_BASE = '/api/tasks';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');

let tasks = [];

// API helpers
async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function loadTasks() {
    try {
        const data = await apiFetch(API_BASE);
        tasks = Array.isArray(data) ? data : (data.tasks || []);
        render();
    } catch {
        // Fallback: load from localStorage
        const stored = localStorage.getItem('todo_tasks');
        tasks = stored ? JSON.parse(stored) : [];
        render();
    }
}

async function createTask(text) {
    try {
        const task = await apiFetch(API_BASE, {
            method: 'POST',
            body: JSON.stringify({ title: text }),
        });
        tasks.push(task);
    } catch {
        // Fallback: create locally
        const task = {
            id: Date.now().toString(),
            title: text,
            completed: false,
        };
        tasks.push(task);
        saveFallback();
    }
    render();
}

async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    try {
        await apiFetch(`${API_BASE}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ completed: newCompleted }),
        });
        task.completed = newCompleted;
    } catch {
        task.completed = newCompleted;
        saveFallback();
    }
    render();
}

async function deleteTask(id) {
    try {
        await apiFetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t.id !== id);
    } catch {
        tasks = tasks.filter(t => t.id !== id);
        saveFallback();
    }
    render();
}

function saveFallback() {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

function render() {
    taskList.innerHTML = '';
    emptyState.classList.toggle('visible', tasks.length === 0);

    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const text = document.createElement('span');
        text.className = `task-text${task.completed ? ' completed' : ''}`;
        text.textContent = task.title;

        const delBtn = document.createElement('button');
        delBtn.className = 'task-delete';
        delBtn.textContent = '🗑️';
        delBtn.title = 'Delete task';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(delBtn);
        taskList.appendChild(item);
    });

    const count = tasks.length;
    taskCount.textContent = `${count} task${count !== 1 ? 's' : ''}`;
}

// Event listeners
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) return;
    createTask(text);
    taskInput.value = '';
    taskInput.focus();
});

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const text = taskInput.value.trim();
        if (!text) return;
        createTask(text);
        taskInput.value = '';
    }
});

// Init
loadTasks();