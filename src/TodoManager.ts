import { v4 as uuidv4 } from "uuid";
import { Todo } from "./types";

export class TodoManager {
  private todos: Todo[] = [];

  addTodo(text: string): Todo {
    const trimmedText = text.trim();

    if (!trimmedText || trimmedText.length === 0) {
      throw new Error("Todo text cannot be empty or whitespace only");
    }

    const todo: Todo = {
      id: uuidv4(),
      text: trimmedText,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.push(todo);
    return todo;
  }

  removeTodo(id: string): void {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }

  markAsDeleted(id: string): void {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.status = "deleted";
      todo.updatedAt = new Date();
    }
  }

  restoreTodo(id: string): void {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.status = "active";
      todo.updatedAt = new Date();
    }
  }

  getTodos(): Todo[] {
    return [...this.todos];
  }

  getActiveTodos(): Todo[] {
    return this.todos.filter((todo) => todo.status === "active");
  }

  getDeletedTodos(): Todo[] {
    return this.todos.filter((todo) => todo.status === "deleted");
  }

  getTodoById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  getStats() {
    return {
      total: this.todos.length,
      active: this.getActiveTodos().length,
      deleted: this.getDeletedTodos().length,
    };
  }
}
