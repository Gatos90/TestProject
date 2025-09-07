/**
 * TestProject - Todo List Application
 *
 * Complete todo management system with three distinct actions:
 * - Add: Create new todos
 * - Remove: Permanently delete todos
 * - Mark as deleted: Soft deletion with restore capability
 *
 * Features:
 * - HTML interface with accessibility support
 * - Visual distinction for deleted items
 * - Proper ARIA labels and keyboard navigation
 * - Input validation and error handling
 * - Real-time stats updates
 */

import { TodoManager } from "./TodoManager";
import { TodoUI } from "./TodoUI";
import { Todo } from "./types";

// Export all public APIs
export { TodoManager, TodoUI, Todo };

console.log("🚀 TestProject Todo App - Fully Implemented!");
