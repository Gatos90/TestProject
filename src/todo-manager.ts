import { v4 as uuidv4 } from 'uuid';
import { Todo, TodoStatus, TodoStorage } from './types.js';
import { LocalStorage } from './storage.js';

export class TodoManager {
  private todos: Todo[] = [];
  private storage: TodoStorage;

  constructor(storage?: TodoStorage) {
    this.storage = storage || new LocalStorage();
    this.loadTodos();
  }

  createTodo(title: string): Todo {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error('Title cannot be empty');
    }

    if (trimmedTitle.length > 500) {
      throw new Error('Title too long (maximum 500 characters)');
    }

    const sanitizedTitle = this.sanitizeTitle(trimmedTitle);
    
    const todo: Todo = {
      id: uuidv4(),
      title: sanitizedTitle,
      status: TodoStatus.ACTIVE,
      createdAt: new Date()
    };

    this.todos.push(todo);
    this.saveTodos();
    return todo;
  }

  getTodoById(id: string): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  getAllTodos(): Todo[] {
    return [...this.todos];
  }

  getActiveTodos(): Todo[] {
    return this.todos.filter(todo => todo.status === TodoStatus.ACTIVE);
  }

  getCompletedTodos(): Todo[] {
    return this.todos.filter(todo => todo.status === TodoStatus.COMPLETED);
  }

  getDeletedTodos(): Todo[] {
    return this.todos.filter(todo => todo.status === TodoStatus.DELETED);
  }

  completeTodo(id: string): void {
    const todo = this.getTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (todo.status === TodoStatus.DELETED) {
      throw new Error('Cannot complete a deleted todo');
    }

    todo.status = TodoStatus.COMPLETED;
    todo.completedAt = new Date();
    this.saveTodos();
  }

  toggleTodo(id: string): void {
    const todo = this.getTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (todo.status === TodoStatus.DELETED) {
      throw new Error('Cannot toggle a deleted todo');
    }

    if (todo.status === TodoStatus.COMPLETED) {
      todo.status = TodoStatus.ACTIVE;
      delete todo.completedAt;
    } else {
      todo.status = TodoStatus.COMPLETED;
      todo.completedAt = new Date();
    }

    this.saveTodos();
  }

  removeTodo(id: string): void {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    this.todos.splice(todoIndex, 1);
    this.saveTodos();
  }

  markAsDeleted(id: string): void {
    const todo = this.getTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.status = TodoStatus.DELETED;
    todo.deletedAt = new Date();
    this.saveTodos();
  }

  restoreTodo(id: string): void {
    const todo = this.getTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (todo.status !== TodoStatus.DELETED) {
      throw new Error('Todo is not deleted');
    }

    todo.status = TodoStatus.ACTIVE;
    delete todo.deletedAt;
    this.saveTodos();
  }

  private sanitizeTitle(title: string): string {
    return title
      .replace(/[<>]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  private loadTodos(): void {
    try {
      this.todos = this.storage.load();
    } catch (error) {
      console.error('Failed to load todos:', error);
      this.todos = [];
    }
  }

  private saveTodos(): void {
    try {
      this.storage.save(this.todos);
    } catch (error) {
      console.error('Failed to save todos:', error);
      throw error;
    }
  }
}