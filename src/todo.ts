export interface TodoUpdate {
  title?: string;
  description?: string | undefined;
}

export class Todo {
  public readonly id: string;
  public title: string;
  public description: string | undefined;
  public completed: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(title: string, description?: string) {
    this.validateTitle(title);
    if (description !== undefined) {
      this.validateDescription(description);
    }

    this.id = this.generateId();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date();
    this.updatedAt = new Date(this.createdAt.getTime());
  }

  private validateTitle(title: string): void {
    if (title === null || title === undefined || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Title is required');
    }
    if (title.length > 100) {
      throw new Error('Title must not exceed 100 characters');
    }
  }

  private validateDescription(description: string): void {
    if (description.length > 500) {
      throw new Error('Description must not exceed 500 characters');
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public toggle(): void {
    this.completed = !this.completed;
    this.updatedAt = new Date();
  }

  public update(updates: TodoUpdate): void {
    if (Object.keys(updates).length === 0) {
      return;
    }

    if (updates.title !== undefined) {
      this.validateTitle(updates.title);
      this.title = updates.title;
    }

    if ('description' in updates) {
      if (updates.description !== undefined && updates.description !== null && typeof updates.description === 'string') {
        this.validateDescription(updates.description);
      }
      this.description = updates.description;
    }

    this.updatedAt = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}