class ShoppingList {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderItems();
    }

    bindEvents() {
        const addBtn = document.getElementById('addBtn');
        const clearBtn = document.getElementById('clearBtn');
        const itemInput = document.getElementById('itemInput');

        addBtn.addEventListener('click', () => this.addItem());
        clearBtn.addEventListener('click', () => this.clearList());
        itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
    }

    addItem() {
        const itemInput = document.getElementById('itemInput');
        const itemText = itemInput.value.trim();

        if (!itemText) {
            this.showNotification('Por favor, digite um item!', 'warning');
            return;
        }

        const newItem = {
            id: Date.now(),
            name: itemText,
            date: new Date().toLocaleString('pt-BR'),
            completed: false
        };

        this.items.push(newItem);
        this.saveToLocalStorage();
        this.renderItems();
        itemInput.value = '';
        itemInput.focus();

        this.showNotification('Item adicionado com sucesso!', 'success');
    }

    toggleCompleted(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveToLocalStorage();
            this.renderItems();
            
            const message = item.completed ? 'Item marcado como comprado!' : 'Item desmarcado!';
            this.showNotification(message, 'success');
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.renderItems();
        this.showNotification('Item removido com sucesso!', 'error');
    }

    clearList() {
        if (this.items.length === 0) {
            this.showNotification('A lista já está vazia!', 'warning');
            return;
        }

        if (confirm('Tem certeza que deseja limpar toda a lista?')) {
            this.items = [];
            this.saveToLocalStorage();
            this.renderItems();
            this.showNotification('Lista limpa com sucesso!', 'success');
        }
    }

    renderItems() {
        const tableBody = document.getElementById('tableBody');
        
        if (this.items.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        <div class="empty-state">
                            <div>🛒</div>
                            <h3>Lista vazia</h3>
                            <p>Adicione itens à sua lista de compras para começar!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.items.map(item => `
            <tr>
                <td class="item-name ${item.completed ? 'completed' : ''}">${this.escapeHtml(item.name)}</td>
                <td class="item-date">${item.date}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-check ${item.completed ? 'completed' : ''}" 
                                onclick="shoppingList.toggleCompleted(${item.id})" 
                                title="${item.completed ? 'Desmarcar como comprado' : 'Marcar como comprado'}">
                            ${item.completed ? '✅' : '☐'}
                        </button>
                        <button class="btn-icon btn-delete" 
                                onclick="shoppingList.removeItem(${item.id})" 
                                title="Excluir item">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    saveToLocalStorage() {
        localStorage.setItem('shoppingList', JSON.stringify(this.items));
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
const shoppingList = new ShoppingList();
