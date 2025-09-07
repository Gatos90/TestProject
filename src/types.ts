export interface Todo {
  id: string;
  text: string;
  status: "active" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}
