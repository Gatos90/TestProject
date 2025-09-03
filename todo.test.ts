import { describe, it, expect, beforeEach } from 'vitest';
import { Todo, TodoStatus } from './todo.js';

describe('Basic Todo Model', () => {
  describe('Todo Creation', () => {
    it('should create a todo with required title', () => {
      const todo = new Todo('Buy groceries');
      
      expect(todo.title).toBe('Buy groceries');
      expect(todo.id).toBeDefined();
      expect(typeof todo.id).toBe('string');
      expect(todo.id.length).toBeGreaterThan(0);
    });

    it('should create a todo with title and description', () => {
      const todo = new Todo('Buy groceries', 'Need milk, bread, and eggs');
      
      expect(todo.title).toBe('Buy groceries');
      expect(todo.description).toBe('Need milk, bread, and eggs');
    });

    it('should assign default status as pending', () => {
      const todo = new Todo('Task');
      
      expect(todo.status).toBe(TodoStatus.PENDING);
    });

    it('should generate unique IDs for different todos', () => {
      const todo1 = new Todo('Task 1');
      const todo2 = new Todo('Task 2');
      
      expect(todo1.id).not.toBe(todo2.id);
    });

    it('should set creation timestamp', () => {
      const beforeCreation = new Date();
      const todo = new Todo('Task');
      const afterCreation = new Date();
      
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(todo.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should throw error for empty title', () => {
      expect(() => new Todo('')).toThrow('Todo title cannot be empty');
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => new Todo('   ')).toThrow('Todo title cannot be empty');
    });

    it('should throw error for null title', () => {
      expect(() => new Todo(null as any)).toThrow('Todo title cannot be empty');
    });

    it('should throw error for undefined title', () => {
      expect(() => new Todo(undefined as any)).toThrow('Todo title cannot be empty');
    });
  });

  describe('Todo Properties', () => {
    let todo: Todo;

    beforeEach(() => {
      todo = new Todo('Test task', 'Test description');
    });

    it('should have immutable id after creation', () => {
      const originalId = todo.id;
      
      expect(() => {
        (todo as any).id = 'new-id';
      }).toThrow();
      
      expect(todo.id).toBe(originalId);
    });

    it('should have immutable createdAt after creation', () => {
      const originalCreatedAt = todo.createdAt;
      
      expect(() => {
        (todo as any).createdAt = new Date();
      }).toThrow();
      
      expect(todo.createdAt).toBe(originalCreatedAt);
    });

    it('should allow title updates', () => {
      todo.title = 'Updated title';
      
      expect(todo.title).toBe('Updated title');
    });

    it('should allow description updates', () => {
      todo.description = 'Updated description';
      
      expect(todo.description).toBe('Updated description');
    });

    it('should allow setting description to undefined', () => {
      todo.description = undefined;
      
      expect(todo.description).toBeUndefined();
    });

    it('should throw error when setting empty title', () => {
      expect(() => {
        todo.title = '';
      }).toThrow('Todo title cannot be empty');
    });

    it('should throw error when setting whitespace-only title', () => {
      expect(() => {
        todo.title = '   ';
      }).toThrow('Todo title cannot be empty');
    });
  });

  describe('Todo Status Management', () => {
    let todo: Todo;

    beforeEach(() => {
      todo = new Todo('Test task');
    });

    it('should allow status change to completed', () => {
      todo.status = TodoStatus.COMPLETED;
      
      expect(todo.status).toBe(TodoStatus.COMPLETED);
    });

    it('should allow status change to in_progress', () => {
      todo.status = TodoStatus.IN_PROGRESS;
      
      expect(todo.status).toBe(TodoStatus.IN_PROGRESS);
    });

    it('should allow status change back to pending', () => {
      todo.status = TodoStatus.COMPLETED;
      todo.status = TodoStatus.PENDING;
      
      expect(todo.status).toBe(TodoStatus.PENDING);
    });

    it('should set completedAt when status changes to completed', () => {
      const beforeCompletion = new Date();
      todo.status = TodoStatus.COMPLETED;
      const afterCompletion = new Date();
      
      expect(todo.completedAt).toBeInstanceOf(Date);
      expect(todo.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeCompletion.getTime());
      expect(todo.completedAt!.getTime()).toBeLessThanOrEqual(afterCompletion.getTime());
    });

    it('should clear completedAt when status changes from completed to pending', () => {
      todo.status = TodoStatus.COMPLETED;
      expect(todo.completedAt).toBeInstanceOf(Date);
      
      todo.status = TodoStatus.PENDING;
      expect(todo.completedAt).toBeUndefined();
    });

    it('should clear completedAt when status changes from completed to in_progress', () => {
      todo.status = TodoStatus.COMPLETED;
      expect(todo.completedAt).toBeInstanceOf(Date);
      
      todo.status = TodoStatus.IN_PROGRESS;
      expect(todo.completedAt).toBeUndefined();
    });

    it('should not set completedAt for in_progress status', () => {
      todo.status = TodoStatus.IN_PROGRESS;
      
      expect(todo.completedAt).toBeUndefined();
    });

    it('should not set completedAt for pending status', () => {
      todo.status = TodoStatus.PENDING;
      
      expect(todo.completedAt).toBeUndefined();
    });
  });

  describe('TodoStatus Enum', () => {
    it('should have correct enum values', () => {
      expect(TodoStatus.PENDING).toBe('pending');
      expect(TodoStatus.IN_PROGRESS).toBe('in_progress');
      expect(TodoStatus.COMPLETED).toBe('completed');
    });

    it('should have exactly 3 status values', () => {
      const statusValues = Object.values(TodoStatus);
      expect(statusValues).toHaveLength(3);
      expect(statusValues).toContain('pending');
      expect(statusValues).toContain('in_progress');
      expect(statusValues).toContain('completed');
    });
  });

  describe('Todo Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const todo = new Todo('Test task', 'Test description');
      todo.status = TodoStatus.COMPLETED;
      
      const json = JSON.parse(JSON.stringify(todo));
      
      expect(json.id).toBe(todo.id);
      expect(json.title).toBe('Test task');
      expect(json.description).toBe('Test description');
      expect(json.status).toBe('completed');
      expect(new Date(json.createdAt)).toEqual(todo.createdAt);
      expect(new Date(json.completedAt)).toEqual(todo.completedAt);
    });

    it('should serialize todo without description correctly', () => {
      const todo = new Todo('Test task');
      
      const json = JSON.parse(JSON.stringify(todo));
      
      expect(json.title).toBe('Test task');
      expect(json.description).toBeUndefined();
      expect(json.completedAt).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      const todo = new Todo(longTitle);
      
      expect(todo.title).toBe(longTitle);
    });

    it('should handle very long descriptions', () => {
      const longDescription = 'B'.repeat(10000);
      const todo = new Todo('Task', longDescription);
      
      expect(todo.description).toBe(longDescription);
    });

    it('should handle special characters in title', () => {
      const specialTitle = '特殊文字 🚀 @#$%^&*()';
      const todo = new Todo(specialTitle);
      
      expect(todo.title).toBe(specialTitle);
    });

    it('should handle special characters in description', () => {
      const specialDescription = 'Émojis: 👍🎉 and symbols: ©®™';
      const todo = new Todo('Task', specialDescription);
      
      expect(todo.description).toBe(specialDescription);
    });

    it('should maintain type safety with readonly properties', () => {
      const todo = new Todo('Task');
      
      expect(typeof todo.id).toBe('string');
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(Object.getOwnPropertyDescriptor(todo, 'id')?.writable).toBe(false);
      expect(Object.getOwnPropertyDescriptor(todo, 'createdAt')?.writable).toBe(false);
    });
  });
});