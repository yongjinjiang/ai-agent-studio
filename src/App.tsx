import { useState } from 'react';
import { Agent, Message } from './types/agent';
import { AgentExecutor } from './engine/AgentExecutor';
import { createExampleAgent } from './tools/exampleTools';
import AgentBuilder from './components/AgentBuilder';
import ChatInterface from './components/ChatInterface';
import './App.css';

/**
 * Main App Component
 * Demonstrates React + TypeScript patterns
 */
function App() {
  const [agent, setAgent] = useState<Agent>(() => createExampleAgent());
  const [executor, setExecutor] = useState<AgentExecutor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Handle agent updates from builder
  const handleAgentUpdate = (updatedAgent: Agent) => {
    setAgent(updatedAgent);
    setExecutor(null); // Reset executor when agent changes
    setMessages([]);
  };

  // Handle running the agent
  const handleRunAgent = async (userMessage: string) => {
    if (isRunning) return;

    setIsRunning(true);

    try {
      // Create executor if not exists
      let exec = executor;
      if (!exec) {
        exec = new AgentExecutor(agent);
        setExecutor(exec);
      }

      // Run agent
      const updatedMessages = await exec.run(userMessage);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error running agent:', error);
      alert(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    if (executor) {
      executor.reset();
    }
    setMessages([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 My AI Agent Studio</h1>
        <p>Build and run AI agents with TypeScript</p>
      </header>

      <div className="app-content">
        <div className="builder-section">
          <AgentBuilder agent={agent} onUpdate={handleAgentUpdate} />
        </div>

        <div className="chat-section">
          <ChatInterface
            messages={messages}
            onSendMessage={handleRunAgent}
            onReset={handleReset}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
