import { randomUUID } from "crypto";

export interface TodoJSON {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Todo {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly completed: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(title: string, description?: string);
  constructor(
    id: string,
    title: string,
    description: string,
    completed: boolean,
    createdAt: Date,
    updatedAt: Date,
    _private: symbol,
  );
  constructor(
    titleOrId: string,
    descriptionOrTitle?: string,
    description?: string,
    completed?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    _private?: symbol,
  ) {
    if (_private === Todo.PRIVATE_CONSTRUCTOR) {
      // Private constructor for internal use
      this.id = titleOrId;
      this.title = descriptionOrTitle!;
      this.description = description!;
      this.completed = completed!;
      this.createdAt = createdAt!;
      this.updatedAt = updatedAt!;
    } else {
      // Public constructor
      this.validateTitle(titleOrId);
      this.validateDescription(descriptionOrTitle);

      this.id = randomUUID();
      this.title = titleOrId;
      this.description = descriptionOrTitle || "";
      this.completed = false;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }

  private static readonly PRIVATE_CONSTRUCTOR = Symbol("private");

  private static validateTitleStatic(title: any): void {
    if (typeof title !== "string") {
      throw new Error("Title must be a string");
    }

    if (title.trim().length === 0) {
      throw new Error("Title is required and cannot be empty");
    }

    if (title.length > 200) {
      throw new Error("Title must not exceed 200 characters");
    }
  }

  private static validateDescriptionStatic(description: any): void {
    if (description !== undefined && typeof description !== "string") {
      throw new Error("Description must be a string");
    }

    if (description && description.length > 1000) {
      throw new Error("Description must not exceed 1000 characters");
    }
  }

  private validateTitle(title: any): void {
    Todo.validateTitleStatic(title);
  }

  private validateDescription(description: any): void {
    Todo.validateDescriptionStatic(description);
  }

  toggleComplete(): Todo {
    return new Todo(
      this.id,
      this.title,
      this.description,
      !this.completed,
      this.createdAt,
      new Date(),
      Todo.PRIVATE_CONSTRUCTOR,
    );
  }

  updateTitle(newTitle: string): Todo {
    this.validateTitle(newTitle);

    return new Todo(
      this.id,
      newTitle,
      this.description,
      this.completed,
      this.createdAt,
      new Date(),
      Todo.PRIVATE_CONSTRUCTOR,
    );
  }

  updateDescription(newDescription: string): Todo {
    this.validateDescription(newDescription);

    return new Todo(
      this.id,
      this.title,
      newDescription || "",
      this.completed,
      this.createdAt,
      new Date(),
      Todo.PRIVATE_CONSTRUCTOR,
    );
  }

  toJSON(): TodoJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: any): Todo {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid JSON data for Todo");
    }

    const { id, title, description, completed, createdAt, updatedAt } = data;

    if (!id || typeof id !== "string") {
      throw new Error("Invalid or missing id");
    }

    // Validate title
    Todo.validateTitleStatic(title);

    // Validate description if provided
    if (description !== undefined) {
      Todo.validateDescriptionStatic(description);
    }

    if (typeof completed !== "boolean") {
      throw new Error("Invalid completed status");
    }

    // Parse and validate dates
    let parsedCreatedAt: Date;
    let parsedUpdatedAt: Date;

    try {
      parsedCreatedAt = new Date(createdAt);
      if (isNaN(parsedCreatedAt.getTime())) {
        throw new Error("Invalid createdAt date format");
      }
    } catch {
      throw new Error("Invalid createdAt date format");
    }

    try {
      parsedUpdatedAt = new Date(updatedAt);
      if (isNaN(parsedUpdatedAt.getTime())) {
        throw new Error("Invalid updatedAt date format");
      }
    } catch {
      throw new Error("Invalid updatedAt date format");
    }

    return new Todo(
      id,
      title,
      description || "",
      completed,
      parsedCreatedAt,
      parsedUpdatedAt,
      Todo.PRIVATE_CONSTRUCTOR,
    );
  }
}
