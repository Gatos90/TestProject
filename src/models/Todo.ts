import { randomUUID } from 'crypto';

export interface TodoUpdateOptions {
  title?: string;
  description?: string | undefined;
  completed?: boolean;
}

export interface TodoJSON {
  id: string;
  title: string;
  description: string | undefined;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

export class Todo {
  public readonly id: string;
  public title: string;
  public description: string | undefined;
  public completed: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(title: string, description?: string, completed: boolean = false) {
    this.validateTitle(title);
    if (description !== undefined) {
      this.validateDescription(description);
    }

    this.id = randomUUID();
    this.title = title;
    this.description = description;
    this.completed = completed;
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  public toggle(): void {
    this.completed = !this.completed;
    this.updateTimestamp();
  }

  public update(options: TodoUpdateOptions): void {
    // Validate before applying any changes to maintain data integrity
    if (options.title !== undefined) {
      this.validateTitle(options.title);
    }
    if ('description' in options && options.description !== undefined) {
      this.validateDescription(options.description);
    }

    // Only update timestamp if there are actual changes
    let hasChanges = false;

    if (options.title !== undefined) {
      this.title = options.title;
      hasChanges = true;
    }

    if ('description' in options) {
      this.description = options.description;
      hasChanges = true;
    }

    if (options.completed !== undefined) {
      this.completed = options.completed;
      hasChanges = true;
    }

    if (hasChanges) {
      this.updateTimestamp();
    }
  }

  public toJSON(): TodoJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  private validateTitle(title: string): void {
    if (title == null || title.trim() === '') {
      throw new Error('Title is required');
    }
    if (title.length > 100) {
      throw new Error('Title must be 100 characters or less');
    }
  }

  private validateDescription(description: string): void {
    if (description.length > 500) {
      throw new Error('Description must be 500 characters or less');
    }
  }

  private updateTimestamp(): void {
    const now = new Date();
    // Ensure the new timestamp is always greater than the current one
    if (now.getTime() <= this.updatedAt.getTime()) {
      this.updatedAt = new Date(this.updatedAt.getTime() + 1);
    } else {
      this.updatedAt = now;
    }
  }
}