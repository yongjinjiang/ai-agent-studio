/**
 * Core types for the AI Agent Studio
 * Demonstrates TypeScript best practices:
 * - Discriminated unions for tool types
 * - Strict typing for tool schemas
 * - Generic types for extensibility
 */

// ==================== Tool Schemas ====================

/**
 * Base tool schema - all tools extend from this
 * The 'type' field acts as a discriminator for the union
 */
export interface BaseTool {
  type: string;
  name: string;
  description: string;
}

/**
 * String parameter schema
 */
export type StringParam = {
  readonly type: 'string';
  description: string;
  required?: boolean;
  default?: string;
}

/**
 * Number parameter schema
 */
export type NumberParam = {
  readonly type: 'number';
  description: string;
  required?: boolean;
  default?: number;
  min?: number;
  max?: number;
}

/**
 * Boolean parameter schema
 */
export type BooleanParam = {
  readonly type: 'boolean';
  description: string;
  required?: boolean;
  default?: boolean;
}

/**
 * Discriminated union of all parameter types
 * TypeScript can narrow the type based on the 'type' field
 */
export type ToolParameter = StringParam | NumberParam | BooleanParam;

/**
 * Parameter schema map - defines all parameters for a tool
 */
export type ParameterSchema = Record<string, ToolParameter>;

/**
 * Tool execution function type
 * Generic over the parameter schema for type safety
 */
export type ToolFunction<T extends ParameterSchema = ParameterSchema> = (
  params: {
    [K in keyof T]: T[K] extends StringParam
      ? string
      : T[K] extends NumberParam
      ? number
      : T[K] extends BooleanParam
      ? boolean
      : never;
  }
) => Promise<string> | string;

/**
 * Complete tool definition
 * Combines schema and implementation
 */
export interface Tool<T extends ParameterSchema = ParameterSchema> extends BaseTool {
  type: 'function';
  parameters: T;
  execute: ToolFunction<T>;
}

// ==================== Agent Definition ====================

/**
 * Agent configuration
 * Defines the prompt and available tools
 */
export interface Agent {
  id: string;
  name: string;
  prompt: string;
  tools: Tool<any>[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Message in the conversation
 */
export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  toolName?: string;
  toolResult?: string;
}

/**
 * Agent execution context
 */
export interface AgentContext {
  agent: Agent;
  messages: Message[];
  isRunning: boolean;
}

// ==================== Tool Call & Execution ====================

/**
 * Tool call request from LLM
 */
export interface ToolCall {
  toolName: string;
  parameters: Record<string, string | number | boolean>;
}

/**
 * Tool execution result
 */
export interface ToolResult {
  toolName: string;
  success: boolean;
  result?: string;
  error?: string;
}

// ==================== Type Guards ====================

/**
 * Type guard to check if a parameter is required
 */
export function isRequiredParam(param: ToolParameter): boolean {
  return param.required === true;
}

/**
 * Type guard for StringParam
 */
export function isStringParam(param: ToolParameter): param is StringParam {
  return param.type === 'string';
}

/**
 * Type guard for NumberParam
 */
export function isNumberParam(param: ToolParameter): param is NumberParam {
  return param.type === 'number';
}

/**
 * Type guard for BooleanParam
 */
export function isBooleanParam(param: ToolParameter): param is BooleanParam {
  return param.type === 'boolean';
}
