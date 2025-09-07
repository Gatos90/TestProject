export enum TodoStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DELETED = 'deleted'
}

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  createdAt: Date;
  completedAt?: Date;
  deletedAt?: Date;
}

export interface TodoStorage {
  save(todos: Todo[]): void;
  load(): Todo[];
}