import { randomUUID } from 'crypto';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export class Todo {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private _title: string;
  private _description?: string;
  private _status: TodoStatus;
  private _completedAt?: Date;

  constructor(title: string, description?: string) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Todo title cannot be empty');
    }

    this._id = randomUUID();
    this._createdAt = new Date();
    this._title = title;
    this._description = description;
    this._status = TodoStatus.PENDING;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Todo title cannot be empty');
    }
    this._title = value;
  }

  get description(): string | undefined {
    return this._description;
  }

  set description(value: string | undefined) {
    this._description = value;
  }

  get status(): TodoStatus {
    return this._status;
  }

  set status(value: TodoStatus) {
    this._status = value;
    
    if (value === TodoStatus.COMPLETED) {
      this._completedAt = new Date();
    } else {
      this._completedAt = undefined;
    }
  }

  get completedAt(): Date | undefined {
    return this._completedAt;
  }
}