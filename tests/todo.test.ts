import { TodoManager } from '../src/todo-manager.js';
import { Todo, TodoStatus } from '../src/types.js';

describe('TodoManager', () => {
  let todoManager: TodoManager;

  beforeEach(() => {
    todoManager = new TodoManager();
  });

  describe('Core Functionality', () => {
    test('should create a todo with valid title and auto-assign ID', () => {
      const todo = todoManager.createTodo('Buy groceries');
      
      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('Buy groceries');
      expect(todo.status).toBe(TodoStatus.ACTIVE);
      expect(todo.createdAt).toBeInstanceOf(Date);
    });

    test('should reject empty title and throw error', () => {
      expect(() => todoManager.createTodo('')).toThrow('Title cannot be empty');
      expect(() => todoManager.createTodo('   ')).toThrow('Title cannot be empty');
    });

    test('should mark todo as completed and toggle back to active', () => {
      const todo = todoManager.createTodo('Complete project');
      
      todoManager.completeTodo(todo.id);
      const completedTodo = todoManager.getTodoById(todo.id);
      expect(completedTodo?.status).toBe(TodoStatus.COMPLETED);

      todoManager.toggleTodo(todo.id);
      const toggledTodo = todoManager.getTodoById(todo.id);
      expect(toggledTodo?.status).toBe(TodoStatus.ACTIVE);
    });

    test('should distinguish between hard delete (remove) and soft delete (mark as deleted)', () => {
      const todo1 = todoManager.createTodo('Todo to remove');
      const todo2 = todoManager.createTodo('Todo to mark deleted');
      
      // Hard delete - permanent removal
      todoManager.removeTodo(todo1.id);
      expect(todoManager.getTodoById(todo1.id)).toBeUndefined();
      expect(todoManager.getAllTodos()).not.toContainEqual(expect.objectContaining({ id: todo1.id }));
      
      // Soft delete - mark as deleted but keep in data store
      todoManager.markAsDeleted(todo2.id);
      const deletedTodo = todoManager.getTodoById(todo2.id);
      expect(deletedTodo?.status).toBe(TodoStatus.DELETED);
      expect(todoManager.getActiveTodos()).not.toContainEqual(expect.objectContaining({ id: todo2.id }));
      expect(todoManager.getAllTodos()).toContainEqual(expect.objectContaining({ id: todo2.id }));
    });

    test('should persist todos to localStorage and restore on load', () => {
      const todo1 = todoManager.createTodo('Persistent todo 1');
      const todo2 = todoManager.createTodo('Persistent todo 2');
      todoManager.completeTodo(todo2.id);
      
      // Create new manager instance to simulate page reload
      const newTodoManager = new TodoManager();
      
      const loadedTodos = newTodoManager.getActiveTodos();
      expect(loadedTodos).toHaveLength(1);
      expect(loadedTodos[0]?.title).toBe('Persistent todo 1');
      
      const allTodos = newTodoManager.getAllTodos();
      expect(allTodos).toHaveLength(2);
      expect(allTodos.find(t => t.title === 'Persistent todo 2')?.status).toBe(TodoStatus.COMPLETED);
    });
  });
});