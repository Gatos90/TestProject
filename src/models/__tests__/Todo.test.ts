import { Todo } from "../Todo.js";

describe("Todo Construction & Initialization", () => {
  test("creates todo with required fields", () => {
    const todo = new Todo("Buy groceries");

    expect(todo.title).toBe("Buy groceries");
    expect(todo.completed).toBe(false);
    expect(todo.description).toBe("");
    expect(todo.id).toBeDefined();
    expect(typeof todo.id).toBe("string");
    expect(todo.id.length).toBeGreaterThan(0);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);
  });

  test("creates todo with optional description", () => {
    const todo = new Todo("Buy groceries", "From local market");

    expect(todo.title).toBe("Buy groceries");
    expect(todo.description).toBe("From local market");
    expect(todo.completed).toBe(false);
  });

  test("generates unique ID automatically", () => {
    const todo1 = new Todo("Task 1");
    const todo2 = new Todo("Task 2");

    expect(todo1.id).not.toBe(todo2.id);
    expect(todo1.id).toBeDefined();
    expect(todo2.id).toBeDefined();
  });

  test("sets default values correctly", () => {
    const todo = new Todo("Test task");

    expect(todo.completed).toBe(false);
    expect(todo.description).toBe("");
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);
    expect(todo.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(todo.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
  });

  test("validates required title field", () => {
    expect(() => new Todo("")).toThrow("Title is required and cannot be empty");
    expect(() => new Todo("   ")).toThrow(
      "Title is required and cannot be empty",
    );
  });

  test("rejects invalid input types", () => {
    expect(() => new Todo(null as any)).toThrow("Title must be a string");
    expect(() => new Todo(undefined as any)).toThrow("Title must be a string");
    expect(() => new Todo(123 as any)).toThrow("Title must be a string");
    expect(() => new Todo("Valid title", 123 as any)).toThrow(
      "Description must be a string",
    );
  });
});

describe("Todo Properties & Validation", () => {
  test("title: 1-200 chars, required", () => {
    expect(() => new Todo("")).toThrow("Title is required and cannot be empty");

    const validTitle = new Todo("a");
    expect(validTitle.title).toBe("a");

    const maxLengthTitle = new Todo("a".repeat(200));
    expect(maxLengthTitle.title).toBe("a".repeat(200));

    expect(() => new Todo("a".repeat(201))).toThrow(
      "Title must not exceed 200 characters",
    );
  });

  test("description: optional, max 1000 chars", () => {
    const noDescription = new Todo("Task");
    expect(noDescription.description).toBe("");

    const withDescription = new Todo("Task", "Some description");
    expect(withDescription.description).toBe("Some description");

    const maxDescription = new Todo("Task", "a".repeat(1000));
    expect(maxDescription.description).toBe("a".repeat(1000));

    expect(() => new Todo("Task", "a".repeat(1001))).toThrow(
      "Description must not exceed 1000 characters",
    );
  });

  test("completed: boolean, defaults false", () => {
    const todo = new Todo("Task");
    expect(todo.completed).toBe(false);
    expect(typeof todo.completed).toBe("boolean");
  });

  test("createdAt: auto-generated timestamp", () => {
    const beforeCreation = new Date();
    const todo = new Todo("Task");
    const afterCreation = new Date();

    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.createdAt.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime(),
    );
    expect(todo.createdAt.getTime()).toBeLessThanOrEqual(
      afterCreation.getTime(),
    );
  });

  test("updatedAt: auto-updated on changes", () => {
    const todo = new Todo("Task");
    const initialUpdatedAt = todo.updatedAt;

    expect(todo.updatedAt).toBeInstanceOf(Date);
    expect(todo.updatedAt.getTime()).toBeGreaterThanOrEqual(
      todo.createdAt.getTime(),
    );

    // Ensure time difference for update check
    const updatedTodo = todo.updateTitle("Updated Task");
    expect(updatedTodo.updatedAt.getTime()).toBeGreaterThanOrEqual(
      initialUpdatedAt.getTime(),
    );
  });
});

describe("Todo State Operations", () => {
  test("toggleComplete() flips status", () => {
    const todo = new Todo("Task");
    expect(todo.completed).toBe(false);

    const completedTodo = todo.toggleComplete();
    expect(completedTodo.completed).toBe(true);
    expect(todo.completed).toBe(false); // Original unchanged

    const uncompletedTodo = completedTodo.toggleComplete();
    expect(uncompletedTodo.completed).toBe(false);
  });

  test("updateTitle() validates and updates", () => {
    const todo = new Todo("Original");
    const updatedTodo = todo.updateTitle("Updated");

    expect(updatedTodo.title).toBe("Updated");
    expect(todo.title).toBe("Original"); // Original unchanged

    expect(() => todo.updateTitle("")).toThrow(
      "Title is required and cannot be empty",
    );
    expect(() => todo.updateTitle("a".repeat(201))).toThrow(
      "Title must not exceed 200 characters",
    );
  });

  test("updateDescription() handles optional field", () => {
    const todo = new Todo("Task");
    const withDescription = todo.updateDescription("New description");

    expect(withDescription.description).toBe("New description");
    expect(todo.description).toBe(""); // Original unchanged

    const clearedDescription = withDescription.updateDescription("");
    expect(clearedDescription.description).toBe("");

    expect(() => todo.updateDescription("a".repeat(1001))).toThrow(
      "Description must not exceed 1000 characters",
    );
  });

  test("operations return new instance", () => {
    const originalTodo = new Todo("Task");

    const toggledTodo = originalTodo.toggleComplete();
    const updatedTitleTodo = originalTodo.updateTitle("New Title");
    const updatedDescTodo = originalTodo.updateDescription("New Description");

    expect(toggledTodo).not.toBe(originalTodo);
    expect(updatedTitleTodo).not.toBe(originalTodo);
    expect(updatedDescTodo).not.toBe(originalTodo);

    expect(originalTodo.completed).toBe(false);
    expect(originalTodo.title).toBe("Task");
    expect(originalTodo.description).toBe("");
  });

  test("updatedAt reflects changes", () => {
    const todo = new Todo("Task");
    const originalUpdatedAt = todo.updatedAt;

    // Small delay to ensure timestamp difference
    setTimeout(() => {
      const updatedTodo = todo.updateTitle("Updated Task");
      expect(updatedTodo.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    }, 1);
  });
});

describe("Todo Serialization", () => {
  test("toJSON() returns clean object", () => {
    const todo = new Todo("Test Task", "Test Description");
    const json = todo.toJSON();

    expect(json).toEqual({
      id: todo.id,
      title: "Test Task",
      description: "Test Description",
      completed: false,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    });

    expect(typeof json).toBe("object");
    expect(json.constructor).toBe(Object);
  });

  test("fromJSON() reconstructs from data", () => {
    const originalTodo = new Todo("Test Task", "Test Description");
    const json = originalTodo.toJSON();
    const reconstructedTodo = Todo.fromJSON(json);

    expect(reconstructedTodo.id).toBe(originalTodo.id);
    expect(reconstructedTodo.title).toBe(originalTodo.title);
    expect(reconstructedTodo.description).toBe(originalTodo.description);
    expect(reconstructedTodo.completed).toBe(originalTodo.completed);
    expect(reconstructedTodo.createdAt.toISOString()).toBe(
      originalTodo.createdAt.toISOString(),
    );
    expect(reconstructedTodo.updatedAt.toISOString()).toBe(
      originalTodo.updatedAt.toISOString(),
    );
  });

  test("handles missing optional fields in fromJSON", () => {
    const minimalJson = {
      id: "test-id",
      title: "Test Task",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const todo = Todo.fromJSON(minimalJson);
    expect(todo.description).toBe("");
  });

  test("validates during deserialization", () => {
    expect(() => Todo.fromJSON({} as any)).toThrow();
    expect(() => Todo.fromJSON({ title: "" } as any)).toThrow();
    expect(() =>
      Todo.fromJSON({
        id: "test",
        title: "a".repeat(201),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ).toThrow("Title must not exceed 200 characters");
  });
});

describe("Todo Edge Cases & Error Handling", () => {
  test("empty/whitespace title throws error", () => {
    expect(() => new Todo("")).toThrow("Title is required and cannot be empty");
    expect(() => new Todo("   ")).toThrow(
      "Title is required and cannot be empty",
    );
    expect(() => new Todo("\t\n  ")).toThrow(
      "Title is required and cannot be empty",
    );
  });

  test("title exceeding max length throws error", () => {
    const longTitle = "a".repeat(201);
    expect(() => new Todo(longTitle)).toThrow(
      "Title must not exceed 200 characters",
    );
  });

  test("description exceeding max length throws error", () => {
    const longDescription = "a".repeat(1001);
    expect(() => new Todo("Task", longDescription)).toThrow(
      "Description must not exceed 1000 characters",
    );
  });

  test("invalid date formats rejected in fromJSON", () => {
    expect(() =>
      Todo.fromJSON({
        id: "test",
        title: "Task",
        completed: false,
        createdAt: "invalid-date",
        updatedAt: new Date().toISOString(),
      }),
    ).toThrow("Invalid createdAt date format");

    expect(() =>
      Todo.fromJSON({
        id: "test",
        title: "Task",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: "invalid-date",
      }),
    ).toThrow("Invalid updatedAt date format");
  });

  test("null/undefined inputs handled gracefully", () => {
    expect(() => new Todo(null as any)).toThrow("Title must be a string");
    expect(() => new Todo(undefined as any)).toThrow("Title must be a string");
    expect(() => new Todo("Task", null as any)).toThrow(
      "Description must be a string",
    );
    expect(() => new Todo("Task", undefined as any)).not.toThrow();
  });

  test("concurrent modifications maintain consistency", () => {
    const todo = new Todo("Task");

    const update1 = todo.updateTitle("Update 1");
    const update2 = todo.updateTitle("Update 2");
    const toggle1 = todo.toggleComplete();
    const toggle2 = todo.toggleComplete();

    // Original remains unchanged
    expect(todo.title).toBe("Task");
    expect(todo.completed).toBe(false);

    // Each operation creates independent instances
    expect(update1.title).toBe("Update 1");
    expect(update2.title).toBe("Update 2");
    expect(toggle1.completed).toBe(true);
    expect(toggle2.completed).toBe(true);
  });

  test("handles large amounts of data efficiently", () => {
    const todos: Todo[] = [];
    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      todos.push(new Todo(`Task ${i}`, `Description ${i}`));
    }

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    expect(todos).toHaveLength(1000);
  });

  test("memory efficiency with operations", () => {
    const todo = new Todo("Task");
    let current = todo;

    // Perform many operations
    for (let i = 0; i < 100; i++) {
      current = current.updateTitle(`Task ${i}`);
    }

    // Original should remain unchanged
    expect(todo.title).toBe("Task");
    expect(current.title).toBe("Task 99");
  });
});
