/**
 * @jest-environment jsdom
 */

import { TodoUI } from "../TodoUI";

// Mock HTML structure
const mockHTML = `
  <div class="container">
    <div class="stats">
      <span id="total-count">Total: 0</span>
      <span id="active-count">Active: 0</span>
      <span id="deleted-count">Deleted: 0</span>
    </div>
    <div class="add-todo">
      <input type="text" id="todo-input" placeholder="Enter a new todo..." />
      <button id="add-btn" type="button">Add</button>
      <div id="error-message" class="error-message"></div>
    </div>
    <ul id="active-todo-list" class="todo-list"></ul>
    <ul id="deleted-todo-list" class="todo-list"></ul>
  </div>
`;

describe("TodoUI", () => {
  let todoUI: TodoUI;

  beforeEach(() => {
    document.body.innerHTML = mockHTML;
    todoUI = new TodoUI();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("HTML Interface Tests", () => {
    it("should focus input field on initialization", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      expect(document.activeElement).toBe(input);
    });

    it("should clear input after successful add", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input")); // Trigger input event to enable button
      addBtn.click();

      expect(input.value).toBe("");
    });

    it("should handle Enter key submission", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      input.value = "Test todo";
      input.dispatchEvent(new Event("input")); // Enable button

      const enterEvent = new KeyboardEvent("keypress", { key: "Enter" });
      input.dispatchEvent(enterEvent);

      expect(todoUI.getTodoManager().getTodos()).toHaveLength(1);
    });

    it("should trim whitespace from input", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "  Test todo  ";
      input.dispatchEvent(new Event("input")); // Enable button
      addBtn.click();

      const todos = todoUI.getTodoManager().getTodos();
      expect(todos[0]?.text).toBe("Test todo");
    });
  });

  describe("Display Tests", () => {
    it("should show active todos prominently", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Active todo";
      input.dispatchEvent(new Event("input")); // Enable button
      addBtn.click();

      const activeTodoList = document.getElementById(
        "active-todo-list",
      ) as HTMLUListElement;
      expect(activeTodoList.children.length).toBe(1);
      expect(activeTodoList.textContent).toContain("Active todo");
    });

    it("should show deleted todos with visual distinction", () => {
      const todoManager = todoUI.getTodoManager();
      const todo = todoManager.addTodo("Test todo");
      todoManager.markAsDeleted(todo.id);
      todoUI.refresh();

      const deletedTodoList = document.getElementById(
        "deleted-todo-list",
      ) as HTMLUListElement;
      const todoItem = deletedTodoList.querySelector(".todo-item");

      expect(todoItem?.classList.contains("deleted")).toBe(true);
      expect(
        todoItem?.querySelector(".todo-text")?.classList.contains("deleted"),
      ).toBe(true);
    });

    it("should display appropriate buttons for each state", () => {
      const todoManager = todoUI.getTodoManager();
      const activeTodo = todoManager.addTodo("Active todo");
      const deletedTodo = todoManager.addTodo("Deleted todo");
      todoManager.markAsDeleted(deletedTodo.id);
      todoUI.refresh();

      const activeTodoList = document.getElementById(
        "active-todo-list",
      ) as HTMLUListElement;
      const deletedTodoList = document.getElementById(
        "deleted-todo-list",
      ) as HTMLUListElement;

      // Active todo should have Mark as Deleted and Remove buttons
      const activeButtons = activeTodoList.querySelectorAll("button");
      expect(activeButtons).toHaveLength(2);
      expect(Array.from(activeButtons).map((btn) => btn.textContent)).toEqual([
        "Mark as Deleted",
        "Remove",
      ]);

      // Deleted todo should have Restore and Remove buttons
      const deletedButtons = deletedTodoList.querySelectorAll("button");
      expect(deletedButtons).toHaveLength(2);
      expect(Array.from(deletedButtons).map((btn) => btn.textContent)).toEqual([
        "Restore",
        "Remove",
      ]);
    });

    it("should update counters correctly", () => {
      const todoManager = todoUI.getTodoManager();
      const todo1 = todoManager.addTodo("Todo 1");
      const todo2 = todoManager.addTodo("Todo 2");
      todoManager.markAsDeleted(todo1.id);
      todoUI.refresh();

      const totalCount = document.getElementById("total-count") as HTMLElement;
      const activeCount = document.getElementById(
        "active-count",
      ) as HTMLElement;
      const deletedCount = document.getElementById(
        "deleted-count",
      ) as HTMLElement;

      expect(totalCount.textContent).toBe("Total: 2");
      expect(activeCount.textContent).toBe("Active: 1");
      expect(deletedCount.textContent).toBe("Deleted: 1");
    });
  });

  describe("Button Interaction Tests", () => {
    it("should trigger add functionality with Add button", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "New todo";
      input.dispatchEvent(new Event("input")); // Enable button
      addBtn.click();

      expect(todoUI.getTodoManager().getTodos()).toHaveLength(1);
      expect(todoUI.getTodoManager().getTodos()[0]?.text).toBe("New todo");
    });

    it("should permanently delete with Remove button", () => {
      const todoManager = todoUI.getTodoManager();
      const todo = todoManager.addTodo("Test todo");
      todoUI.refresh();

      const removeBtn = document.querySelector(
        '[data-action="remove"]',
      ) as HTMLButtonElement;
      removeBtn.click();

      expect(todoManager.getTodos()).toHaveLength(0);
    });

    it("should toggle deleted state with Delete/Restore button", () => {
      const todoManager = todoUI.getTodoManager();
      const todo = todoManager.addTodo("Test todo");
      todoUI.refresh();

      // Mark as deleted
      const deleteBtn = document.querySelector(
        '[data-action="delete"]',
      ) as HTMLButtonElement;
      deleteBtn.click();

      expect(todoManager.getTodos()[0]?.status).toBe("deleted");

      // Restore
      const restoreBtn = document.querySelector(
        '[data-action="restore"]',
      ) as HTMLButtonElement;
      restoreBtn.click();

      expect(todoManager.getTodos()[0]?.status).toBe("active");
    });

    it("should disable Add button for empty input", () => {
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
      const input = document.getElementById("todo-input") as HTMLInputElement;

      input.value = "";
      input.dispatchEvent(new Event("input"));

      expect(addBtn.disabled).toBe(true);
    });
  });

  describe("Visual Feedback", () => {
    it("should display error messages for invalid operations", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
      const errorMessage = document.getElementById(
        "error-message",
      ) as HTMLElement;

      // Force button to be enabled to test validation
      addBtn.disabled = false;
      input.value = "   "; // Whitespace only
      addBtn.click();

      expect(errorMessage.textContent).toContain("empty");
    });

    it("should clear error messages on input", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
      const errorMessage = document.getElementById(
        "error-message",
      ) as HTMLElement;

      // Trigger error with whitespace only
      addBtn.disabled = false;
      input.value = "   ";
      addBtn.click();
      expect(errorMessage.textContent).toBeTruthy();

      // Clear error by typing valid input
      input.value = "Valid input";
      input.dispatchEvent(new Event("input"));
      expect(errorMessage.textContent).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in todo text", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      const specialText = "Todo with special chars: <>&\"'";
      input.value = specialText;
      input.dispatchEvent(new Event("input")); // Enable button
      addBtn.click();

      const todos = todoUI.getTodoManager().getTodos();
      expect(todos[0]?.text).toBe(specialText);

      const activeTodoList = document.getElementById(
        "active-todo-list",
      ) as HTMLUListElement;
      expect(activeTodoList.textContent).toContain(specialText);
    });

    it("should prevent duplicate rapid submissions", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input")); // Enable button
      addBtn.click();
      addBtn.click(); // Second click with empty input (should be disabled now)

      expect(todoUI.getTodoManager().getTodos()).toHaveLength(1);
    });
  });
});
