import React, { useState } from 'react';
import { Agent, Tool } from '../types/agent';
import './AgentBuilder.css';

interface AgentBuilderProps {
  agent: Agent;
  onUpdate: (agent: Agent) => void;
}

/**
 * Agent Builder Component
 * Allows users to configure agent prompt and view tools
 */
const AgentBuilder: React.FC<AgentBuilderProps> = ({ agent, onUpdate }) => {
  const [name, setName] = useState(agent.name);
  const [prompt, setPrompt] = useState(agent.prompt);

  const handleSave = () => {
    const updatedAgent: Agent = {
      ...agent,
      name,
      prompt,
      updatedAt: new Date(),
    };
    onUpdate(updatedAgent);
  };

  return (
    <div className="agent-builder">
      <h2>Agent Configuration</h2>

      <div className="form-group">
        <label htmlFor="agent-name">Agent Name</label>
        <input
          id="agent-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Weather Assistant"
        />
      </div>

      <div className="form-group">
        <label htmlFor="agent-prompt">System Prompt</label>
        <textarea
          id="agent-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Define the agent's behavior and goals..."
          rows={6}
        />
      </div>

      <button onClick={handleSave} className="btn-primary">
        Save Configuration
      </button>

      <div className="tools-section">
        <h3>Available Tools ({agent.tools.length})</h3>
        {agent.tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  );
};

/**
 * Tool Card Component
 * Displays tool information
 */
const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="tool-card">
      <div className="tool-header" onClick={() => setExpanded(!expanded)}>
        <span className="tool-name">🔧 {tool.name}</span>
        <span className="tool-expand">{expanded ? '▼' : '▶'}</span>
      </div>

      {expanded && (
        <div className="tool-details">
          <p className="tool-description">{tool.description}</p>

          <div className="tool-parameters">
            <strong>Parameters:</strong>
            {Object.keys(tool.parameters).length === 0 ? (
              <p>No parameters</p>
            ) : (
              <ul>
                {Object.entries(tool.parameters).map(([name, param]) => (
                  <li key={name}>
                    <code>{name}</code>
                    <span className="param-type"> ({param.type})</span>
                    {param.required && (
                      <span className="param-required"> *required</span>
                    )}
                    <p className="param-description">{param.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentBuilder;
