import { TodoManager } from "./TodoManager";
import { Todo } from "./types";

export class TodoUI {
  private todoManager: TodoManager;
  private todoInput!: HTMLInputElement;
  private addBtn!: HTMLButtonElement;
  private activeTodoList!: HTMLUListElement;
  private deletedTodoList!: HTMLUListElement;
  private totalCountEl!: HTMLElement;
  private activeCountEl!: HTMLElement;
  private deletedCountEl!: HTMLElement;
  private errorMessageEl!: HTMLElement;

  constructor() {
    this.todoManager = new TodoManager();
    this.initializeElements();
    this.attachEventListeners();
    this.render();
    this.todoInput.focus();
  }

  private initializeElements(): void {
    this.todoInput = document.getElementById("todo-input") as HTMLInputElement;
    this.addBtn = document.getElementById("add-btn") as HTMLButtonElement;
    this.activeTodoList = document.getElementById(
      "active-todo-list",
    ) as HTMLUListElement;
    this.deletedTodoList = document.getElementById(
      "deleted-todo-list",
    ) as HTMLUListElement;
    this.totalCountEl = document.getElementById("total-count") as HTMLElement;
    this.activeCountEl = document.getElementById("active-count") as HTMLElement;
    this.deletedCountEl = document.getElementById(
      "deleted-count",
    ) as HTMLElement;
    this.errorMessageEl = document.getElementById(
      "error-message",
    ) as HTMLElement;

    if (
      !this.todoInput ||
      !this.addBtn ||
      !this.activeTodoList ||
      !this.deletedTodoList ||
      !this.totalCountEl ||
      !this.activeCountEl ||
      !this.deletedCountEl ||
      !this.errorMessageEl
    ) {
      throw new Error("Required DOM elements not found");
    }
  }

  private attachEventListeners(): void {
    this.addBtn.addEventListener("click", () => this.handleAddTodo());

    this.todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAddTodo();
      }
    });

    this.todoInput.addEventListener("input", () => {
      this.clearErrorMessage();
      this.updateAddButtonState();
    });

    this.activeTodoList.addEventListener("click", (e) =>
      this.handleTodoAction(e),
    );
    this.deletedTodoList.addEventListener("click", (e) =>
      this.handleTodoAction(e),
    );
  }

  private handleAddTodo(): void {
    const text = this.todoInput.value.trim();

    try {
      this.todoManager.addTodo(text);
      this.todoInput.value = "";
      this.clearErrorMessage();
      this.render();
      this.todoInput.focus();
    } catch (error) {
      this.showErrorMessage(
        error instanceof Error ? error.message : "Failed to add todo",
      );
    }
  }

  private handleTodoAction(e: Event): void {
    const target = e.target as HTMLElement;
    if (!target.matches("button")) return;

    const todoId = target.dataset.todoId;
    if (!todoId) return;

    const action = target.dataset.action;

    switch (action) {
      case "delete":
        this.todoManager.markAsDeleted(todoId);
        break;
      case "remove":
        this.todoManager.removeTodo(todoId);
        break;
      case "restore":
        this.todoManager.restoreTodo(todoId);
        break;
    }

    this.render();
  }

  private showErrorMessage(message: string): void {
    this.errorMessageEl.textContent = message;
    this.errorMessageEl.setAttribute("aria-live", "assertive");
  }

  private clearErrorMessage(): void {
    this.errorMessageEl.textContent = "";
  }

  private updateAddButtonState(): void {
    const hasValidText = this.todoInput.value.trim().length > 0;
    this.addBtn.disabled = !hasValidText;
  }

  private createTodoElement(todo: Todo): HTMLLIElement {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.status}`;
    li.setAttribute("role", "listitem");

    const todoText = document.createElement("span");
    todoText.className = `todo-text ${todo.status}`;
    todoText.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    if (todo.status === "active") {
      const deleteBtn = this.createActionButton(
        "Mark as Deleted",
        "delete",
        todo.id,
        "btn-delete",
      );
      const removeBtn = this.createActionButton(
        "Remove",
        "remove",
        todo.id,
        "btn-remove",
      );
      actions.appendChild(deleteBtn);
      actions.appendChild(removeBtn);
    } else {
      const restoreBtn = this.createActionButton(
        "Restore",
        "restore",
        todo.id,
        "btn-restore",
      );
      const removeBtn = this.createActionButton(
        "Remove",
        "remove",
        todo.id,
        "btn-remove",
      );
      actions.appendChild(restoreBtn);
      actions.appendChild(removeBtn);
    }

    li.appendChild(todoText);
    li.appendChild(actions);

    return li;
  }

  private createActionButton(
    text: string,
    action: string,
    todoId: string,
    className: string,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = `btn ${className}`;
    button.dataset.action = action;
    button.dataset.todoId = todoId;
    button.setAttribute(
      "aria-label",
      `${text} todo: ${this.todoManager.getTodoById(todoId)?.text || ""}`,
    );
    return button;
  }

  private renderTodoList(todos: Todo[], container: HTMLUListElement): void {
    container.innerHTML = "";

    if (todos.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "empty-state";
      emptyState.textContent = "No todos yet";
      container.appendChild(emptyState);
    } else {
      todos.forEach((todo) => {
        const todoElement = this.createTodoElement(todo);
        container.appendChild(todoElement);
      });
    }
  }

  private updateStats(): void {
    const stats = this.todoManager.getStats();
    this.totalCountEl.textContent = `Total: ${stats.total}`;
    this.activeCountEl.textContent = `Active: ${stats.active}`;
    this.deletedCountEl.textContent = `Deleted: ${stats.deleted}`;
  }

  private render(): void {
    const activeTodos = this.todoManager.getActiveTodos();
    const deletedTodos = this.todoManager.getDeletedTodos();

    this.renderTodoList(activeTodos, this.activeTodoList);
    this.renderTodoList(deletedTodos, this.deletedTodoList);
    this.updateStats();
    this.updateAddButtonState();
  }

  // Public methods for testing
  public getTodoManager(): TodoManager {
    return this.todoManager;
  }

  public refresh(): void {
    this.render();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TodoUI();
});
