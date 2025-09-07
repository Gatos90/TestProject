import { TodoManager } from "../TodoManager";

describe("TodoManager", () => {
  let todoManager: TodoManager;

  beforeEach(() => {
    todoManager = new TodoManager();
  });

  describe("addTodo", () => {
    it("should add new todo with valid text input", () => {
      const todo = todoManager.addTodo("Learn TypeScript");

      expect(todo).toBeDefined();
      expect(todo.text).toBe("Learn TypeScript");
      expect(todo.status).toBe("active");
      expect(todo.id).toBeTruthy();
      expect(todoManager.getTodos()).toHaveLength(1);
    });

    it("should reject empty or whitespace-only input", () => {
      expect(() => todoManager.addTodo("")).toThrow();
      expect(() => todoManager.addTodo("   ")).toThrow();
      expect(todoManager.getTodos()).toHaveLength(0);
    });
  });

  describe("removeTodo", () => {
    it("should permanently delete todo from data structure", () => {
      const todo = todoManager.addTodo("Test todo");
      expect(todoManager.getTodos()).toHaveLength(1);

      todoManager.removeTodo(todo.id);

      expect(todoManager.getTodos()).toHaveLength(0);
      expect(
        todoManager.getTodos().find((t) => t.id === todo.id),
      ).toBeUndefined();
    });
  });

  describe("markAsDeleted", () => {
    it("should change todo status to deleted while maintaining in data structure", () => {
      const todo = todoManager.addTodo("Test todo");
      expect(todo.status).toBe("active");

      todoManager.markAsDeleted(todo.id);

      const todos = todoManager.getTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0]?.status).toBe("deleted");
      expect(todos[0]?.text).toBe("Test todo");
      expect(todos[0]?.id).toBe(todo.id);
    });

    it("should allow toggling between deleted and active states", () => {
      const todo = todoManager.addTodo("Toggle test");

      todoManager.markAsDeleted(todo.id);
      expect(todoManager.getTodos()[0]?.status).toBe("deleted");

      todoManager.restoreTodo(todo.id);
      expect(todoManager.getTodos()[0]?.status).toBe("active");
    });
  });

  describe("edge cases", () => {
    it("should handle non-existent todo ID gracefully", () => {
      expect(() => todoManager.removeTodo("non-existent")).not.toThrow();
      expect(() => todoManager.markAsDeleted("non-existent")).not.toThrow();
      expect(() => todoManager.restoreTodo("non-existent")).not.toThrow();
    });
  });
});
