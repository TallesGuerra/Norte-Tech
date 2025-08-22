class TodoList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoList')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
    }

    bindEvents() {
        const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('taskInput');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (!taskText) {
            this.showNotification('Por favor, digite uma tarefa!', 'warning');
            return;
        }

        const newTask = {
            id: Date.now(),
            name: this.capitalizeFirstLetter(taskText),
            date: new Date().toLocaleString('pt-BR'),
            completed: false
        };

        this.tasks.push(newTask);
        this.saveToLocalStorage();
        this.renderTasks();
        taskInput.value = '';
        taskInput.focus();

        this.showNotification('Tarefa adicionada com sucesso!', 'success');
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.renderTasks();
            
            const message = task.completed ? 'Tarefa marcada como concluída!' : 'Tarefa desmarcada!';
            this.showNotification(message, 'success');
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.renderTasks();
        this.showNotification('Tarefa removida com sucesso!', 'error');
    }

    renderTasks() {
        const tableBody = document.getElementById('tableBody');
        
        if (this.tasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <div>📝</div>
                            <h3>Nenhuma tarefa</h3>
                            <p>Adicione suas primeiras tarefas para começar!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.tasks.map(task => `
            <tr>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" 
                               class="task-checkbox" 
                               ${task.completed ? 'checked' : ''} 
                               onchange="todoList.toggleTask(${task.id})">
                    </div>
                </td>
                <td>
                    <span class="task-name ${task.completed ? 'completed' : ''}">
                        ${this.escapeHtml(task.name)}
                    </span>
                </td>
                <td class="task-date">${task.date}</td>
                <td>
                    <button class="btn-delete" 
                            onclick="todoList.deleteTask(${task.id})" 
                            title="Excluir tarefa">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    }

    saveToLocalStorage() {
        localStorage.setItem('todoList', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Inicializar a aplicação
const todoList = new TodoList();
