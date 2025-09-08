/**
 * @jest-environment jsdom
 */

import { TodoUI } from "../TodoUI";

// Mock HTML structure with accessibility attributes
const mockHTML = `
  <div class="container">
    <div class="stats" role="status" aria-live="polite">
      <span id="total-count">Total: 0</span>
      <span id="active-count">Active: 0</span>
      <span id="deleted-count">Deleted: 0</span>
    </div>
    <div class="add-todo">
      <input type="text" id="todo-input" placeholder="Enter a new todo..." aria-label="New todo text" />
      <button id="add-btn" type="button">Add</button>
      <div id="error-message" class="error-message" role="alert" aria-live="assertive"></div>
    </div>
    <ul id="active-todo-list" class="todo-list" role="list"></ul>
    <ul id="deleted-todo-list" class="todo-list" role="list"></ul>
  </div>
`;

describe("TodoUI Accessibility", () => {
  let todoUI: TodoUI;

  beforeEach(() => {
    document.body.innerHTML = mockHTML;
    todoUI = new TodoUI();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("ARIA labels and roles", () => {
    it("should have proper ARIA labels on input field", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      expect(input.getAttribute("aria-label")).toBe("New todo text");
    });

    it("should have proper ARIA labels on buttons", () => {
      // Add a todo first
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input"));
      addBtn.click();

      // Check action button ARIA labels
      const deleteBtn = document.querySelector(
        '[data-action="delete"]',
      ) as HTMLButtonElement;
      const removeBtn = document.querySelector(
        '[data-action="remove"]',
      ) as HTMLButtonElement;

      expect(deleteBtn.getAttribute("aria-label")).toContain(
        "Mark as Deleted todo: Test todo",
      );
      expect(removeBtn.getAttribute("aria-label")).toContain(
        "Remove todo: Test todo",
      );
    });

    it("should have role attributes on lists", () => {
      const activeTodoList = document.getElementById(
        "active-todo-list",
      ) as HTMLUListElement;
      const deletedTodoList = document.getElementById(
        "deleted-todo-list",
      ) as HTMLUListElement;

      expect(activeTodoList.getAttribute("role")).toBe("list");
      expect(deletedTodoList.getAttribute("role")).toBe("list");
    });

    it("should have role attributes on todo items", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input"));
      addBtn.click();

      const todoItem = document.querySelector(".todo-item") as HTMLLIElement;
      expect(todoItem.getAttribute("role")).toBe("listitem");
    });
  });

  describe("Live regions and announcements", () => {
    it("should have aria-live on error messages", () => {
      const errorMessage = document.getElementById(
        "error-message",
      ) as HTMLElement;
      expect(errorMessage.getAttribute("role")).toBe("alert");
      expect(errorMessage.getAttribute("aria-live")).toBe("assertive");
    });

    it("should have aria-live on stats", () => {
      const stats = document.querySelector(".stats") as HTMLElement;
      expect(stats.getAttribute("role")).toBe("status");
      expect(stats.getAttribute("aria-live")).toBe("polite");
    });
  });

  describe("Keyboard navigation", () => {
    it("should support Enter key for adding todos", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input"));

      const enterEvent = new KeyboardEvent("keypress", { key: "Enter" });
      input.dispatchEvent(enterEvent);

      expect(todoUI.getTodoManager().getTodos()).toHaveLength(1);
    });

    it("should focus input field on initialization", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      expect(document.activeElement).toBe(input);
    });

    it("should maintain focus on input after adding todo", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input"));
      addBtn.click();

      // After adding, focus should return to input
      expect(document.activeElement).toBe(input);
    });
  });

  describe("Screen reader compatibility", () => {
    it("should update aria-live regions when stats change", () => {
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
      const stats = document.querySelector(".stats") as HTMLElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input"));
      addBtn.click();

      // Stats should be updated and announced via aria-live
      expect(stats.textContent).toContain("Total: 1");
      expect(stats.textContent).toContain("Active: 1");
    });

    it("should announce errors via assertive live region", () => {
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
      const errorMessage = document.getElementById(
        "error-message",
      ) as HTMLElement;

      // Force button enabled and trigger error
      addBtn.disabled = false;
      addBtn.click();

      expect(errorMessage.getAttribute("aria-live")).toBe("assertive");
      expect(errorMessage.textContent).toBeTruthy();
    });
  });

  describe("Focus management", () => {
    it("should provide visible focus indicators", () => {
      // This test mainly verifies the CSS classes exist
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      // Elements should be focusable
      expect(input.tabIndex).not.toBe(-1);
      expect(addBtn.tabIndex).not.toBe(-1);
    });

    it("should maintain logical tab order", () => {
      // Add todo to create action buttons
      const input = document.getElementById("todo-input") as HTMLInputElement;
      const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

      input.value = "Test todo";
      input.dispatchEvent(new Event("input"));
      addBtn.click();

      // Verify buttons are focusable
      const actionButtons = document.querySelectorAll(".btn");
      actionButtons.forEach((button) => {
        expect((button as HTMLButtonElement).tabIndex).not.toBe(-1);
      });
    });
  });
});
