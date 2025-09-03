# TestProject - Todo List Application

A TypeScript Todo List application designed to test the **Jira AI Agent** workflow.

## 🎯 Purpose

This project serves as a testing ground for the AI Agent system that:
- Receives Jira tickets with `@Agent` mentions
- Automatically implements requested features
- Writes comprehensive tests
- Creates pull requests with the changes

## 🏗️ Project Structure

```
TestProject/
├── src/
│   ├── models/          # Data models (to be implemented)
│   ├── services/        # Business logic (to be implemented)
│   ├── utils/           # Utility functions (to be implemented)
│   └── index.ts         # Main entry point
├── tests/               # Unit tests (to be implemented)
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── jest.config.js       # Jest testing configuration
```

## 🚀 Development Workflow

1. **Create Jira Ticket** with `@Agent` mention
2. **Describe Feature** with acceptance criteria
3. **AI Agent Processes** the ticket automatically
4. **Review Generated** code and tests
5. **Merge PR** when satisfied

## 🎫 Example Jira Tickets to Create

### Ticket 1: Basic Todo Model
```
@Agent
Create a Todo model with id, title, description, completed, createdAt, updatedAt.
Include TypeScript interfaces and full test coverage.
```

### Ticket 2: Todo Service Layer
```
@Agent
Implement TodoService with CRUD operations: create, read, update, delete, toggle.
Include comprehensive unit tests for all methods.
```

### Ticket 3: Add Priority System
```
@Agent
Add priority levels (LOW, MEDIUM, HIGH, URGENT) to todos.
Include sorting by priority and update existing tests.
```

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Testing**: Jest
- **Package Manager**: npm
- **Build Tool**: TypeScript compiler
- **Linting**: ESLint
- **Formatting**: Prettier

## 📝 Scripts

```bash
npm install          # Install dependencies
npm run dev          # Run in development mode
npm run build        # Build for production
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Lint code
npm run typecheck    # Check TypeScript types
```

## 🤖 AI Agent Integration

This project is configured to work with the Jira AI Agent system:
- Project registered in the agent database
- Webhook configured for automatic processing
- Claude AI configured for code generation
- Git integration for PR creation

## 📈 Progress Tracking

Features will be implemented incrementally through Jira tickets:
- [ ] Basic Todo model
- [ ] Todo service layer
- [ ] Priority system
- [ ] Tags functionality
- [ ] Due dates
- [ ] Categories/Lists
- [ ] Search and filtering

Each feature will be fully tested and documented by the AI agent.