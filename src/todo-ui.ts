import { TodoManager } from './todo-manager.js';
import { Todo, TodoStatus } from './types.js';

export class TodoUI {
  private todoManager: TodoManager;
  private container: HTMLElement;
  private form!: HTMLFormElement;
  private input!: HTMLInputElement;
  private todoList!: HTMLElement;
  private errorDisplay!: HTMLElement;

  constructor(container: HTMLElement, todoManager?: TodoManager) {
    this.container = container;
    this.todoManager = todoManager || new TodoManager();
    this.createUI();
    this.attachEventListeners();
    this.render();
  }

  private createUI(): void {
    this.container.innerHTML = `
      <div class="todo-app" role="main" aria-labelledby="todo-heading">
        <h1 id="todo-heading">Todo List</h1>
        
        <div class="error-display" role="alert" aria-live="polite"></div>
        
        <form class="todo-form" role="form" aria-labelledby="add-todo-label">
          <label id="add-todo-label" for="todo-input">Add new todo:</label>
          <div class="input-group">
            <input 
              type="text" 
              id="todo-input" 
              class="todo-input" 
              placeholder="Enter todo title..." 
              aria-describedby="todo-input-help"
              maxlength="500"
              required
            >
            <button type="submit" class="add-btn" aria-label="Add todo">Add</button>
          </div>
          <small id="todo-input-help">Enter a title for your todo item (max 500 characters)</small>
        </form>

        <div class="todo-controls">
          <button type="button" class="filter-btn active" data-filter="active">Active</button>
          <button type="button" class="filter-btn" data-filter="completed">Completed</button>
          <button type="button" class="filter-btn" data-filter="all">All</button>
        </div>
        
        <ul class="todo-list" role="list" aria-label="Todo items"></ul>
      </div>
    `;

    this.form = this.container.querySelector('.todo-form') as HTMLFormElement;
    this.input = this.container.querySelector('.todo-input') as HTMLInputElement;
    this.todoList = this.container.querySelector('.todo-list') as HTMLElement;
    this.errorDisplay = this.container.querySelector('.error-display') as HTMLElement;
  }

  private attachEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.todoList.addEventListener('click', this.handleTodoClick.bind(this));
    this.todoList.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    const filterButtons = this.container.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', this.handleFilterClick.bind(this));
    });
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    
    try {
      const title = this.input.value;
      this.todoManager.createTodo(title);
      this.input.value = '';
      this.clearError();
      this.render();
      this.input.focus();
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Failed to create todo');
    }
  }

  private handleTodoClick(event: Event): void {
    const target = event.target as HTMLElement;
    const todoItem = target.closest('.todo-item') as HTMLElement;
    
    if (!todoItem) return;
    
    const todoId = todoItem.dataset.id;
    if (!todoId) return;

    try {
      if (target.classList.contains('complete-btn') || target.classList.contains('todo-checkbox')) {
        this.todoManager.toggleTodo(todoId);
      } else if (target.classList.contains('delete-btn')) {
        this.confirmAndMarkDeleted(todoId);
      } else if (target.classList.contains('remove-btn')) {
        this.confirmAndRemove(todoId);
      } else if (target.classList.contains('restore-btn')) {
        this.todoManager.restoreTodo(todoId);
      }
      
      this.clearError();
      this.render();
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Operation failed');
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleTodoClick(event);
    }
  }

  private handleFilterClick(event: Event): void {
    const target = event.target as HTMLElement;
    const filter = target.dataset.filter;
    
    if (filter) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');
      this.render(filter as 'active' | 'completed' | 'all');
    }
  }

  private confirmAndMarkDeleted(todoId: string): void {
    if (confirm('Are you sure you want to delete this todo? It can be restored later.')) {
      this.todoManager.markAsDeleted(todoId);
    }
  }

  private confirmAndRemove(todoId: string): void {
    if (confirm('Are you sure you want to permanently remove this todo? This cannot be undone.')) {
      this.todoManager.removeTodo(todoId);
    }
  }

  private render(filter: 'active' | 'completed' | 'all' = 'active'): void {
    let todos: Todo[];
    
    switch (filter) {
      case 'completed':
        todos = this.todoManager.getCompletedTodos();
        break;
      case 'all':
        todos = this.todoManager.getAllTodos().filter(todo => todo.status !== TodoStatus.DELETED);
        break;
      default:
        todos = this.todoManager.getActiveTodos();
    }

    if (todos.length === 0) {
      this.todoList.innerHTML = `
        <li class="empty-state" role="listitem">
          <p>No todos found. ${filter === 'active' ? 'Add a new todo to get started!' : ''}</p>
        </li>
      `;
      return;
    }

    this.todoList.innerHTML = todos
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(todo => this.renderTodoItem(todo))
      .join('');
  }

  private renderTodoItem(todo: Todo): string {
    const isCompleted = todo.status === TodoStatus.COMPLETED;
    const isDeleted = todo.status === TodoStatus.DELETED;
    
    return `
      <li class="todo-item ${isCompleted ? 'completed' : ''} ${isDeleted ? 'deleted' : ''}" 
          data-id="${todo.id}" 
          role="listitem">
        <div class="todo-content">
          ${!isDeleted ? `
            <input 
              type="checkbox" 
              class="todo-checkbox" 
              ${isCompleted ? 'checked' : ''} 
              aria-label="Mark as ${isCompleted ? 'incomplete' : 'complete'}"
            >
          ` : ''}
          
          <span class="todo-title" ${isCompleted ? 'aria-label="Completed: ' + todo.title + '"' : ''}>${todo.title}</span>
          
          <time class="todo-date" datetime="${todo.createdAt.toISOString()}">
            ${todo.createdAt.toLocaleDateString()}
          </time>
        </div>
        
        <div class="todo-actions">
          ${!isDeleted ? `
            <button 
              type="button" 
              class="complete-btn" 
              aria-label="${isCompleted ? 'Mark as incomplete' : 'Mark as complete'}"
              title="${isCompleted ? 'Mark as incomplete' : 'Mark as complete'}"
            >
              ${isCompleted ? '↶' : '✓'}
            </button>
            
            <button 
              type="button" 
              class="delete-btn" 
              aria-label="Delete todo" 
              title="Delete todo"
            >
              🗑
            </button>
            
            <button 
              type="button" 
              class="remove-btn" 
              aria-label="Remove todo permanently" 
              title="Remove permanently"
            >
              ✕
            </button>
          ` : `
            <button 
              type="button" 
              class="restore-btn" 
              aria-label="Restore todo" 
              title="Restore todo"
            >
              ↶ Restore
            </button>
          `}
        </div>
      </li>
    `;
  }

  private showError(message: string): void {
    this.errorDisplay.textContent = message;
    this.errorDisplay.classList.add('visible');
    
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  private clearError(): void {
    this.errorDisplay.textContent = '';
    this.errorDisplay.classList.remove('visible');
  }

  refresh(): void {
    this.render();
  }
}