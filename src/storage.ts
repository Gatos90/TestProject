import { Todo, TodoStorage } from './types.js';

function getLocalStorage() {
  try {
    // Check for browser environment
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage;
    }
    // Check for global localStorage (like in tests)
    if (typeof global !== 'undefined' && (global as any).localStorage) {
      return (global as any).localStorage;
    }
    return null;
  } catch {
    return null;
  }
}

export class LocalStorage implements TodoStorage {
  private readonly STORAGE_KEY = 'todos';

  save(todos: Todo[]): void {
    try {
      const todosData = todos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString(),
        completedAt: todo.completedAt?.toISOString(),
        deletedAt: todo.deletedAt?.toISOString()
      }));
      
      const storage = getLocalStorage();
      if (storage) {
        storage.setItem(this.STORAGE_KEY, JSON.stringify(todosData));
      }
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  load(): Todo[] {
    try {
      const storage = getLocalStorage();
      if (!storage) {
        return [];
      }

      const data = storage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }

      const todosData = JSON.parse(data);
      if (!Array.isArray(todosData)) {
        throw new Error('Invalid data format');
      }

      return todosData.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        deletedAt: todo.deletedAt ? new Date(todo.deletedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return [];
    }
  }
}