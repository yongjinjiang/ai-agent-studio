# My AI Agent Studio

A TypeScript-powered GUI for building and running AI agents. This project is designed to help you learn TypeScript while building something practical and fun!

## What You'll Learn

This project demonstrates several TypeScript concepts:

- **Strict typing** with interfaces and type aliases
- **Discriminated unions** for tool parameter types
- **Generic types** for type-safe tool execution
- **Type guards** for runtime type checking
- **React + TypeScript** integration
- **Async/await** patterns with proper typing
- **Type inference** and the `satisfies` operator
- **Utility types** and advanced patterns

## Features

- Define AI agents with custom prompts
- Create type-safe tools with parameter schemas
- Execute tools with automatic parameter validation
- Chat interface to interact with your agents
- Fully typed React components
- Six example tools included

## Project Structure

```
src/
├── types/
│   └── agent.ts          # Core TypeScript types and interfaces
├── engine/
│   └── AgentExecutor.ts  # Agent execution engine
├── tools/
│   └── exampleTools.ts   # Example tool implementations
├── components/
│   ├── AgentBuilder.tsx  # UI for configuring agents
│   └── ChatInterface.tsx # Chat UI component
└── App.tsx               # Main application
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Type Check (Optional)

```bash
npm run type-check
```

## Understanding the Code

### Core Types ([src/types/agent.ts](src/types/agent.ts))

This file demonstrates:
- **Discriminated unions** for `ToolParameter` types
- **Generic types** in `Tool<T>` and `ToolFunction<T>`
- **Mapped types** for converting parameter schemas to runtime types
- **Type guards** for runtime type checking

Key concept:
```typescript
// Discriminated union - TypeScript can narrow based on 'type' field
export type ToolParameter = StringParam | NumberParam | BooleanParam;

// Generic type with constraint
export interface Tool<T extends ParameterSchema = ParameterSchema> {
  parameters: T;
  execute: ToolFunction<T>;
}
```

### Agent Executor ([src/engine/AgentExecutor.ts](src/engine/AgentExecutor.ts))

Demonstrates:
- **Async/await** with proper error handling
- **Type-safe** parameter validation
- **Class-based** architecture with private methods

### Example Tools ([src/tools/exampleTools.ts](src/tools/exampleTools.ts))

Six fully-typed tools showing:
- **Type inference** with `satisfies ParameterSchema`
- **Optional parameters** with defaults
- **Parameter validation** (min/max for numbers)
- **Complex logic** with type safety

Key concept:
```typescript
const calculatorParams = {
  operation: { type: 'string' as const, required: true },
  a: { type: 'number' as const, required: true },
  b: { type: 'number' as const, required: true },
} satisfies ParameterSchema;

// TypeScript knows the exact types of parameters!
export const calculatorTool: Tool<typeof calculatorParams> = {
  execute: async ({ operation, a, b }) => {
    // operation is string, a and b are numbers
  },
};
```

## Next Steps: Extending the Project

### 1. Add Real LLM Integration

Replace the mock LLM in [src/engine/AgentExecutor.ts](src/engine/AgentExecutor.ts#L71-L105) with:
- OpenAI API
- Anthropic Claude API
- Local models via Ollama

### 2. Create Your Own Tools

Add new tools in [src/tools/](src/tools/):
```typescript
const myToolParams = {
  param1: { type: 'string' as const, required: true },
} satisfies ParameterSchema;

export const myTool: Tool<typeof myToolParams> = {
  type: 'function',
  name: 'myTool',
  description: 'Does something cool',
  parameters: myToolParams,
  execute: async ({ param1 }) => {
    // Your implementation
    return 'Result';
  },
};
```

### 3. Add Tool Builder UI

Allow users to create tools via the UI:
- Define parameters dynamically
- Write implementation as code
- Save/load tool definitions

### 4. Add More Parameter Types

Extend `ToolParameter` union with:
- Arrays
- Objects
- Enums
- File uploads

### 5. Add Agent Persistence

Save/load agents from:
- LocalStorage
- Backend API
- File system (Electron)

### 6. Multi-Agent Support

- Manage multiple agents
- Agent-to-agent communication
- Workflow orchestration

## TypeScript Tips

### Strict Mode is Your Friend

This project uses strict TypeScript settings. This might seem annoying at first, but it:
- Catches bugs at compile time
- Provides better autocomplete
- Makes refactoring safer
- Forces you to think about edge cases

### Use Type Inference

Let TypeScript infer types when possible:
```typescript
// Good - TypeScript infers the type
const params = { ... } satisfies ParameterSchema;

// Less good - manual typing is redundant
const params: ParameterSchema = { ... };
```

### Discriminated Unions Are Powerful

They allow TypeScript to narrow types automatically:
```typescript
if (param.type === 'number') {
  // TypeScript knows param is NumberParam here
  console.log(param.min, param.max);
}
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Type Challenges](https://github.com/type-challenges/type-challenges) - Practice TS

## Contributing

Feel free to:
- Add new tools
- Improve the UI
- Add features
- Fix bugs
- Share your agents!

## License

MIT
