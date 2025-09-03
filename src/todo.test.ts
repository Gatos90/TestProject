import { Todo } from './todo.js';

describe('Todo Model', () => {
  describe('Constructor and Validation', () => {
    describe('Required title field validation', () => {
      it('should create todo with valid title', () => {
        const todo = new Todo('Valid title');
        expect(todo.title).toBe('Valid title');
        expect(todo.description).toBeUndefined();
        expect(todo.completed).toBe(false);
        expect(todo.createdAt).toBeInstanceOf(Date);
        expect(todo.updatedAt).toBeInstanceOf(Date);
        expect(todo.id).toBeDefined();
      });

      it('should throw error when title is empty string', () => {
        expect(() => new Todo('')).toThrow('Title is required');
      });

      it('should throw error when title is only whitespace', () => {
        expect(() => new Todo('   ')).toThrow('Title is required');
      });

      it('should throw error when title is null', () => {
        expect(() => new Todo(null as any)).toThrow('Title is required');
      });

      it('should throw error when title is undefined', () => {
        expect(() => new Todo(undefined as any)).toThrow('Title is required');
      });
    });

    describe('Title length limit validation', () => {
      it('should accept title with exactly 100 characters', () => {
        const title = 'a'.repeat(100);
        const todo = new Todo(title);
        expect(todo.title).toBe(title);
        expect(todo.title.length).toBe(100);
      });

      it('should throw error when title exceeds 100 characters', () => {
        const title = 'a'.repeat(101);
        expect(() => new Todo(title)).toThrow('Title must not exceed 100 characters');
      });

      it('should accept title with 1 character', () => {
        const todo = new Todo('a');
        expect(todo.title).toBe('a');
      });

      it('should accept title with 99 characters', () => {
        const title = 'a'.repeat(99);
        const todo = new Todo(title);
        expect(todo.title).toBe(title);
      });
    });

    describe('Description length limit validation', () => {
      it('should accept todo with description of exactly 500 characters', () => {
        const description = 'a'.repeat(500);
        const todo = new Todo('Title', description);
        expect(todo.description).toBe(description);
        expect(todo.description!.length).toBe(500);
      });

      it('should throw error when description exceeds 500 characters', () => {
        const description = 'a'.repeat(501);
        expect(() => new Todo('Title', description)).toThrow('Description must not exceed 500 characters');
      });

      it('should accept empty description', () => {
        const todo = new Todo('Title', '');
        expect(todo.description).toBe('');
      });

      it('should accept undefined description', () => {
        const todo = new Todo('Title');
        expect(todo.description).toBeUndefined();
      });

      it('should accept description with 499 characters', () => {
        const description = 'a'.repeat(499);
        const todo = new Todo('Title', description);
        expect(todo.description).toBe(description);
      });
    });

    describe('Initial state validation', () => {
      it('should initialize with completed as false', () => {
        const todo = new Todo('Title');
        expect(todo.completed).toBe(false);
      });

      it('should generate unique IDs for different todos', () => {
        const todo1 = new Todo('Title 1');
        const todo2 = new Todo('Title 2');
        expect(todo1.id).not.toBe(todo2.id);
        expect(todo1.id).toBeDefined();
        expect(todo2.id).toBeDefined();
      });

      it('should set createdAt and updatedAt to current time', () => {
        const before = new Date();
        const todo = new Todo('Title');
        const after = new Date();
        
        expect(todo.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(todo.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
        expect(todo.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(todo.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
      });

      it('should set createdAt and updatedAt to same initial value', () => {
        const todo = new Todo('Title');
        expect(todo.createdAt.getTime()).toBe(todo.updatedAt.getTime());
      });
    });
  });

  describe('toggle() method', () => {
    it('should switch completed from false to true', () => {
      const todo = new Todo('Title');
      expect(todo.completed).toBe(false);
      
      todo.toggle();
      
      expect(todo.completed).toBe(true);
    });

    it('should switch completed from true to false', () => {
      const todo = new Todo('Title');
      todo.toggle(); // Set to true first
      expect(todo.completed).toBe(true);
      
      todo.toggle();
      
      expect(todo.completed).toBe(false);
    });

    it('should update updatedAt timestamp when toggling', () => {
      const todo = new Todo('Title');
      const originalUpdatedAt = todo.updatedAt;
      
      // Wait a small amount to ensure timestamp difference
      setTimeout(() => {
        todo.toggle();
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should not change other properties when toggling', () => {
      const todo = new Todo('Title', 'Description');
      const originalTitle = todo.title;
      const originalDescription = todo.description;
      const originalId = todo.id;
      const originalCreatedAt = todo.createdAt;
      
      todo.toggle();
      
      expect(todo.title).toBe(originalTitle);
      expect(todo.description).toBe(originalDescription);
      expect(todo.id).toBe(originalId);
      expect(todo.createdAt).toBe(originalCreatedAt);
    });
  });

  describe('update() method', () => {
    it('should update title and updatedAt timestamp', () => {
      const todo = new Todo('Original Title');
      const originalUpdatedAt = todo.updatedAt;
      
      setTimeout(() => {
        todo.update({ title: 'Updated Title' });
        
        expect(todo.title).toBe('Updated Title');
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update description and updatedAt timestamp', () => {
      const todo = new Todo('Title', 'Original Description');
      const originalUpdatedAt = todo.updatedAt;
      
      setTimeout(() => {
        todo.update({ description: 'Updated Description' });
        
        expect(todo.description).toBe('Updated Description');
        expect(todo.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 1);
    });

    it('should update both title and description', () => {
      const todo = new Todo('Original Title', 'Original Description');
      
      todo.update({ 
        title: 'Updated Title', 
        description: 'Updated Description' 
      });
      
      expect(todo.title).toBe('Updated Title');
      expect(todo.description).toBe('Updated Description');
    });

    it('should validate updated title length', () => {
      const todo = new Todo('Title');
      const longTitle = 'a'.repeat(101);
      
      expect(() => todo.update({ title: longTitle })).toThrow('Title must not exceed 100 characters');
    });

    it('should validate updated description length', () => {
      const todo = new Todo('Title');
      const longDescription = 'a'.repeat(501);
      
      expect(() => todo.update({ description: longDescription })).toThrow('Description must not exceed 500 characters');
    });

    it('should validate updated title is not empty', () => {
      const todo = new Todo('Title');
      
      expect(() => todo.update({ title: '' })).toThrow('Title is required');
      expect(() => todo.update({ title: '   ' })).toThrow('Title is required');
    });

    it('should not change other properties when updating', () => {
      const todo = new Todo('Title', 'Description');
      const originalId = todo.id;
      const originalCreatedAt = todo.createdAt;
      const originalCompleted = todo.completed;
      
      todo.update({ title: 'New Title' });
      
      expect(todo.id).toBe(originalId);
      expect(todo.createdAt).toBe(originalCreatedAt);
      expect(todo.completed).toBe(originalCompleted);
    });

    it('should handle empty update object', () => {
      const todo = new Todo('Title', 'Description');
      const originalTitle = todo.title;
      const originalDescription = todo.description;
      const originalUpdatedAt = todo.updatedAt;
      
      todo.update({});
      
      expect(todo.title).toBe(originalTitle);
      expect(todo.description).toBe(originalDescription);
      expect(todo.updatedAt).toBe(originalUpdatedAt);
    });

    it('should allow setting description to undefined', () => {
      const todo = new Todo('Title', 'Description');
      
      todo.update({ description: undefined });
      
      expect(todo.description).toBeUndefined();
    });
  });

  describe('toJSON() method', () => {
    it('should return plain object representation with all properties', () => {
      const todo = new Todo('Title', 'Description');
      const json = todo.toJSON();
      
      expect(json).toEqual({
        id: todo.id,
        title: 'Title',
        description: 'Description',
        completed: false,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt
      });
    });

    it('should return plain object without description when undefined', () => {
      const todo = new Todo('Title');
      const json = todo.toJSON();
      
      expect(json).toEqual({
        id: todo.id,
        title: 'Title',
        description: undefined,
        completed: false,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt
      });
    });

    it('should return plain object after toggle', () => {
      const todo = new Todo('Title');
      todo.toggle();
      const json = todo.toJSON();
      
      expect(json.completed).toBe(true);
    });

    it('should return plain object after update', () => {
      const todo = new Todo('Original Title');
      todo.update({ title: 'Updated Title', description: 'New Description' });
      const json = todo.toJSON();
      
      expect(json.title).toBe('Updated Title');
      expect(json.description).toBe('New Description');
    });

    it('should return serializable object (no methods)', () => {
      const todo = new Todo('Title');
      const json = todo.toJSON();
      
      expect(typeof json.toggle).toBe('undefined');
      expect(typeof json.update).toBe('undefined');
      expect(typeof json.toJSON).toBe('undefined');
    });

    it('should be JSON stringifiable', () => {
      const todo = new Todo('Title', 'Description');
      
      expect(() => JSON.stringify(todo.toJSON())).not.toThrow();
      
      const jsonString = JSON.stringify(todo.toJSON());
      const parsed = JSON.parse(jsonString);
      
      expect(parsed.title).toBe('Title');
      expect(parsed.description).toBe('Description');
      expect(parsed.completed).toBe(false);
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle special characters in title', () => {
      const specialTitle = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const todo = new Todo(specialTitle);
      
      expect(todo.title).toBe(specialTitle);
    });

    it('should handle unicode characters in title and description', () => {
      const unicodeTitle = '🚀 Todo with emoji 中文';
      const unicodeDescription = '描述 with émojis 🎉';
      const todo = new Todo(unicodeTitle, unicodeDescription);
      
      expect(todo.title).toBe(unicodeTitle);
      expect(todo.description).toBe(unicodeDescription);
    });

    it('should handle newlines in title and description', () => {
      const titleWithNewline = 'Title\nwith\nnewlines';
      const descriptionWithNewline = 'Description\nwith\nnewlines';
      const todo = new Todo(titleWithNewline, descriptionWithNewline);
      
      expect(todo.title).toBe(titleWithNewline);
      expect(todo.description).toBe(descriptionWithNewline);
    });

    it('should handle rapid successive operations', () => {
      const todo = new Todo('Title');
      
      todo.toggle();
      todo.update({ title: 'New Title' });
      todo.toggle();
      
      expect(todo.completed).toBe(false);
      expect(todo.title).toBe('New Title');
    });

    it('should maintain data integrity after multiple operations', () => {
      const todo = new Todo('Original Title', 'Original Description');
      const originalId = todo.id;
      const originalCreatedAt = todo.createdAt;
      
      todo.toggle();
      todo.update({ title: 'Updated Title' });
      todo.toggle();
      todo.update({ description: 'Updated Description' });
      
      expect(todo.id).toBe(originalId);
      expect(todo.createdAt).toBe(originalCreatedAt);
      expect(todo.title).toBe('Updated Title');
      expect(todo.description).toBe('Updated Description');
      expect(todo.completed).toBe(false);
    });

    it('should handle boundary values correctly', () => {
      const maxTitle = 'a'.repeat(100);
      const maxDescription = 'b'.repeat(500);
      const todo = new Todo(maxTitle, maxDescription);
      
      expect(todo.title.length).toBe(100);
      expect(todo.description!.length).toBe(500);
      
      const json = todo.toJSON();
      expect(json.title.length).toBe(100);
      expect(json.description!.length).toBe(500);
    });

    it('should prevent prototype pollution in update', () => {
      const todo = new Todo('Title');
      
      expect(() => {
        todo.update({ 
          constructor: () => 'hacked',
          __proto__: { evil: true }
        } as any);
      }).not.toThrow();
      
      expect((todo as any).constructor).not.toBe('hacked');
      expect((todo as any).evil).toBeUndefined();
    });
  });
});