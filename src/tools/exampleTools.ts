/**
 * Example Tools for AI Agent Studio
 * Demonstrates how to create type-safe tools
 */

import { Agent, Tool, ParameterSchema } from '../types/agent';

/**
 * Calculator Tool
 * Demonstrates number parameters with validation
 */
const calculatorParams = {
  operation: {
    type: 'string' as const,
    description: 'The operation to perform: add, subtract, multiply, divide',
    required: true,
  },
  a: {
    type: 'number' as const,
    description: 'First number',
    required: true,
  },
  b: {
    type: 'number' as const,
    description: 'Second number',
    required: true,
  },
} satisfies ParameterSchema;

export const calculatorTool: Tool<typeof calculatorParams> = {
  type: 'function',
  name: 'calculator',
  description: 'Performs basic arithmetic operations on two numbers',
  parameters: calculatorParams,
  execute: async ({ operation, a, b }) => {
    // TypeScript knows that operation is string, a and b are numbers!
    switch (operation.toLowerCase()) {
      case 'add':
        return `${a} + ${b} = ${a + b}`;
      case 'subtract':
        return `${a} - ${b} = ${a - b}`;
      case 'multiply':
        return `${a} × ${b} = ${a * b}`;
      case 'divide':
        if (b === 0) {
          throw new Error('Cannot divide by zero');
        }
        return `${a} ÷ ${b} = ${a / b}`;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  },
};

/**
 * Random Number Generator Tool
 * Demonstrates optional parameters with defaults
 */
const randomNumberParams = {
  min: {
    type: 'number' as const,
    description: 'Minimum value (inclusive)',
    required: false,
    default: 0,
    min: 0,
  },
  max: {
    type: 'number' as const,
    description: 'Maximum value (inclusive)',
    required: false,
    default: 100,
    max: 1000,
  },
} satisfies ParameterSchema;

export const randomNumberTool: Tool<typeof randomNumberParams> = {
  type: 'function',
  name: 'randomNumber',
  description: 'Generates a random number within a specified range',
  parameters: randomNumberParams,
  execute: async ({ min = 0, max = 100 }) => {
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    return `Random number between ${min} and ${max}: ${result}`;
  },
};

/**
 * String Reverser Tool
 * Demonstrates string parameters
 */
const stringReverserParams = {
  text: {
    type: 'string' as const,
    description: 'The text to reverse',
    required: true,
  },
  uppercase: {
    type: 'boolean' as const,
    description: 'Convert to uppercase after reversing',
    required: false,
    default: false,
  },
} satisfies ParameterSchema;

export const stringReverserTool: Tool<typeof stringReverserParams> = {
  type: 'function',
  name: 'reverseString',
  description: 'Reverses a string and optionally converts to uppercase',
  parameters: stringReverserParams,
  execute: async ({ text, uppercase = false }) => {
    const reversed = text.split('').reverse().join('');
    const result = uppercase ? reversed.toUpperCase() : reversed;
    return `Reversed: "${result}"`;
  },
};

/**
 * Current Time Tool
 * Demonstrates a tool with no parameters
 */
export const currentTimeTool: Tool<{}> = {
  type: 'function',
  name: 'currentTime',
  description: 'Returns the current time and date',
  parameters: {},
  execute: async () => {
    const now = new Date();
    return `Current time: ${now.toLocaleString()}`;
  },
};

/**
 * Word Counter Tool
 * Demonstrates string processing
 */
const wordCounterParams = {
  text: {
    type: 'string' as const,
    description: 'The text to analyze',
    required: true,
  },
} satisfies ParameterSchema;

export const wordCounterTool: Tool<typeof wordCounterParams> = {
  type: 'function',
  name: 'wordCounter',
  description: 'Counts words, characters, and sentences in text',
  parameters: wordCounterParams,
  execute: async ({ text }) => {
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    return `Analysis:\n- Words: ${words}\n- Characters: ${chars}\n- Sentences: ${sentences}`;
  },
};

/**
 * Temperature Converter Tool
 * Demonstrates complex logic and validation
 */
const tempConverterParams = {
  value: {
    type: 'number' as const,
    description: 'Temperature value',
    required: true,
  },
  from: {
    type: 'string' as const,
    description: 'Source unit: celsius, fahrenheit, kelvin',
    required: true,
  },
  to: {
    type: 'string' as const,
    description: 'Target unit: celsius, fahrenheit, kelvin',
    required: true,
  },
} satisfies ParameterSchema;

export const temperatureConverterTool: Tool<typeof tempConverterParams> = {
  type: 'function',
  name: 'convertTemperature',
  description: 'Converts temperature between Celsius, Fahrenheit, and Kelvin',
  parameters: tempConverterParams,
  execute: async ({ value, from, to }) => {
    const fromUnit = from.toLowerCase();
    const toUnit = to.toLowerCase();

    if (fromUnit === toUnit) {
      return `${value}°${toUnit.charAt(0).toUpperCase()}`;
    }

    // Convert to Celsius first
    let celsius: number;
    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * (5 / 9);
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        throw new Error(`Unknown unit: ${from}`);
    }

    // Convert from Celsius to target
    let result: number;
    switch (toUnit) {
      case 'celsius':
        result = celsius;
        break;
      case 'fahrenheit':
        result = celsius * (9 / 5) + 32;
        break;
      case 'kelvin':
        result = celsius + 273.15;
        break;
      default:
        throw new Error(`Unknown unit: ${to}`);
    }

    const symbol = toUnit === 'kelvin' ? 'K' : `°${toUnit.charAt(0).toUpperCase()}`;
    return `${value}°${fromUnit.charAt(0).toUpperCase()} = ${result.toFixed(2)}${symbol}`;
  },
};

/**
 * Greeting Tool
 * Demonstrates simple string parameter usage
 */
const greetingParams = {
  name: {
    type: 'string' as const,
    description: 'The name of the person to greet',
    required: true,
  },
} satisfies ParameterSchema;

export const greetingTool: Tool<typeof greetingParams> = {
  type: 'function',
  name: 'greet',
  description: 'Greets a person by name with a friendly message',
  parameters: greetingParams,
  execute: async ({ name }) => {
    return `Hello, ${name}! Welcome to AI Agent Studio! 👋`;
  },
};

/**
 * Creates an example agent with all tools
 */
export function createExampleAgent(): Agent {
  return {
    id: 'example-agent-1',
    name: 'Demo Assistant',
    prompt: `You are a helpful AI assistant with access to various utility tools.
Your goal is to help users with calculations, text processing, and conversions.
Always be friendly and explain what you're doing when you use a tool.`,
    tools: [
      calculatorTool,
      randomNumberTool,
      stringReverserTool,
      currentTimeTool,
      wordCounterTool,
      temperatureConverterTool,
      greetingTool,
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Helper to create a custom tool (for future extension)
 */
export function createCustomTool(
  name: string,
  description: string,
  parameters: ParameterSchema,
  implementation: string
): Tool {
  return {
    type: 'function',
    name,
    description,
    parameters,
    execute: async (params: any) => {
      // In a real implementation, you could evaluate the implementation string
      // or allow users to write actual functions
      return `Tool "${name}" executed with params: ${JSON.stringify(params)}`;
    },
  };
}
