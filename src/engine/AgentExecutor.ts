/**
 * Agent Execution Engine
 * Demonstrates:
 * - Type-safe tool execution
 * - Error handling with TypeScript
 * - Async/await patterns
 * - LLM integration pattern (mocked for now)
 */

import {
  Agent,
  Tool,
  ToolCall,
  ToolResult,
  Message,
  ParameterSchema,
} from '../types/agent';

/**
 * Validates tool parameters against schema
 */
function validateParameters(
  tool: Tool,
  parameters: Record<string, unknown>
): { valid: boolean; error?: string } {
  for (const [paramName, paramSchema] of Object.entries(tool.parameters)) {
    const value = parameters[paramName];

    // Check required parameters
    if (paramSchema.required && value === undefined) {
      return {
        valid: false,
        error: `Missing required parameter: ${paramName}`,
      };
    }

    // Type checking
    if (value !== undefined) {
      const expectedType = paramSchema.type;
      const actualType = typeof value;

      if (expectedType === 'number' && actualType !== 'number') {
        return {
          valid: false,
          error: `Parameter ${paramName} must be a number`,
        };
      }

      if (expectedType === 'string' && actualType !== 'string') {
        return {
          valid: false,
          error: `Parameter ${paramName} must be a string`,
        };
      }

      if (expectedType === 'boolean' && actualType !== 'boolean') {
        return {
          valid: false,
          error: `Parameter ${paramName} must be a boolean`,
        };
      }

      // Range validation for numbers
      if (expectedType === 'number' && typeof value === 'number') {
        if (paramSchema.min !== undefined && value < paramSchema.min) {
          return {
            valid: false,
            error: `Parameter ${paramName} must be >= ${paramSchema.min}`,
          };
        }
        if (paramSchema.max !== undefined && value > paramSchema.max) {
          return {
            valid: false,
            error: `Parameter ${paramName} must be <= ${paramSchema.max}`,
          };
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Mock LLM response generator
 * In a real implementation, this would call OpenAI, Anthropic, etc.
 */
async function callLLM(
  prompt: string,
  messages: Message[],
  availableTools: Tool[]
): Promise<{ text?: string; toolCall?: ToolCall }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock response - in real app, parse LLM's response for tool calls
  // For demo purposes, we'll simulate calling a tool if available
  if (availableTools.length > 0 && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];

    // Simple heuristic: if user message contains keywords, call relevant tool
    if (lastMessage.role === 'user') {
      const content = lastMessage.content.toLowerCase();

      // Try to find a matching tool
      for (const tool of availableTools) {
        if (content.includes(tool.name.toLowerCase())) {
          // Extract simple parameters (mock implementation)
          return {
            toolCall: {
              toolName: tool.name,
              parameters: {}, // In real app, LLM would provide these
            },
          };
        }
      }
    }
  }

  // Default text response
  return {
    text: `I'm an AI agent with the following goal: "${prompt}". I have access to ${availableTools.length} tools. How can I help you?`,
  };
}

/**
 * Main Agent Executor class
 */
export class AgentExecutor {
  private agent: Agent;
  private messages: Message[] = [];
  private isRunning = false;

  constructor(agent: Agent) {
    this.agent = agent;
    this.initializeMessages();
  }

  /**
   * Initialize with system prompt
   */
  private initializeMessages(): void {
    this.messages = [
      {
        role: 'system',
        content: this.agent.prompt,
        timestamp: new Date(),
      },
    ];
  }

  /**
   * Execute a tool by name
   */
  private async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    const tool = this.agent.tools.find((t) => t.name === toolCall.toolName);

    if (!tool) {
      return {
        toolName: toolCall.toolName,
        success: false,
        error: `Tool "${toolCall.toolName}" not found`,
      };
    }

    // Validate parameters
    const validation = validateParameters(tool, toolCall.parameters);
    if (!validation.valid) {
      return {
        toolName: toolCall.toolName,
        success: false,
        error: validation.error,
      };
    }

    try {
      // Execute the tool with type-safe parameters
      const result = await tool.execute(toolCall.parameters as any);
      return {
        toolName: toolCall.toolName,
        success: true,
        result,
      };
    } catch (error) {
      return {
        toolName: toolCall.toolName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Run the agent with a user message
   */
  async run(userMessage: string): Promise<Message[]> {
    if (this.isRunning) {
      throw new Error('Agent is already running');
    }

    this.isRunning = true;

    try {
      // Add user message
      const userMsg: Message = {
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };
      this.messages.push(userMsg);

      // Call LLM
      const llmResponse = await callLLM(
        this.agent.prompt,
        this.messages,
        this.agent.tools
      );

      // Handle tool call
      if (llmResponse.toolCall) {
        const toolResult = await this.executeTool(llmResponse.toolCall);

        // Add tool result message
        const toolMsg: Message = {
          role: 'tool',
          content: toolResult.success
            ? toolResult.result!
            : `Error: ${toolResult.error}`,
          timestamp: new Date(),
          toolName: toolResult.toolName,
          toolResult: toolResult.success ? toolResult.result : undefined,
        };
        this.messages.push(toolMsg);

        // Get final LLM response after tool execution
        const finalResponse = await callLLM(
          this.agent.prompt,
          this.messages,
          this.agent.tools
        );

        if (finalResponse.text) {
          const assistantMsg: Message = {
            role: 'assistant',
            content: finalResponse.text,
            timestamp: new Date(),
          };
          this.messages.push(assistantMsg);
        }
      } else if (llmResponse.text) {
        // Direct text response
        const assistantMsg: Message = {
          role: 'assistant',
          content: llmResponse.text,
          timestamp: new Date(),
        };
        this.messages.push(assistantMsg);
      }

      return this.messages;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Get conversation history
   */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Clear conversation history
   */
  reset(): void {
    this.initializeMessages();
  }

  /**
   * Get available tools
   */
  getTools(): Tool[] {
    return this.agent.tools;
  }
}
