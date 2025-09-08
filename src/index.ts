/**
 * TestProject - Todo List Application
 * 
 * This is a test project for the Jira AI Agent workflow.
 * Features will be implemented incrementally through Jira tickets.
 * 
 * Current Status: Todo functionality implemented
 */

import { TodoManager } from './todo-manager.js';
import { TodoUI } from './todo-ui.js';

export { TodoManager, TodoUI };
export * from './types.js';

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    new TodoUI(appContainer);
  } else {
    console.warn('App container not found. Make sure to include an element with id="app"');
  }
});

console.log('🚀 TestProject Todo App - Loaded and ready!');