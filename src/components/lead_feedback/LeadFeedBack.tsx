import { useState } from "react";
import {
  Send,
  Search,
  BarChart3,
  Bot,
} from "lucide-react";

import "./leadFeedBack.css";

interface CompetencyFeedback {
  id: number;
  name: string;
  score: number;
  strength: string;
  growth: string;
}

interface ChatMessage {
  id: number;
  sender: "assistant" | "user";
  text: string;
  timestamp: string;
  actions?: string[];
}

export default function LeadFeedback() {
  const [search, setSearch] = useState("");

  const [competencies, setCompetencies] = useState<CompetencyFeedback[]>([
    {
      id: 1,
      name: "Communication",
      score: 9,
      strength: "",
      growth: "",
    },
    {
      id: 2,
      name: "Leadership",
      score: 7,
      strength: "",
      growth: "",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>( [
    {
      id: 1,
      sender: "assistant",
      text: "Hi Marcus! I'm here to help you refine Sarah's feedback. Tell me about Sarah's performance in Communication.",
      timestamp: "Just now",
    },
    {
      id: 2,
      sender: "user",
      text: "She's excellent at explaining technical stuff to clients, but sometimes writes very long Slack messages that are hard to follow.",
      timestamp: "2m ago",
    },
    {
      id: 3,
      sender: "assistant",
      text: "Got it. I've updated the Communication card with that strength and growth area. Ready to move on to Leadership?",
      timestamp: "1m ago",
      actions: ["Yes, let's go", "Edit Communication more"],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (
    id: number,
    field: "score" | "strength" | "growth",
    value: string | number
  ) => {
    setCompetencies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (field === "score") {
            const num = Number(value);
            return { ...c, score: Math.min(10, Math.max(0, num)) };
          }
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: inputMessage,
      timestamp: "Just now",
    };
    setChatMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  };

  const submitReview = () => {
    console.log("Submitting feedback review:", competencies);
  };

  return (
    <div className="feedback-page">
      {/* HEADER SECTION */}
      <div className="feedback-header">
        <div>
          <h1>Provide Feedback</h1>
          <div className="header-badges">
            <span className="badge">Sarah Jenkins</span>
            <span className="badge blue-badge">
              <span className="badge-dot"></span> Cycle Name
            </span>
          </div>
        </div>
        <button className="submit-btn" onClick={submitReview}>
          <Send size={16} />
          Submit Review
        </button>
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="feedback-content">
        
        {/* LEFT COLUMN: Competency Cards */}
        <div className="competency-container">
          <div className="section-title-row">
            <BarChart3 size={20} className="section-icon" />
            <h2>Competency Scores</h2>
          </div>

          <div className="search-box">
            <Search size={12}/>
            <input
              type="text"
              placeholder="Search for a competency"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="competency-list">
            {competencies.map((comp) => (
              <div key={comp.id} className="competency-block-card">
                <div className="competency-block-header">
                  <h3>{comp.name}</h3>
                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      value={comp.score || ""}
                      onChange={(e) =>
                        handleInputChange(comp.id, "score", e.target.value)
                      }
                      min={0}
                      max={10}
                    />
                    <span className="score-denominator">/ 10</span>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label strength-label">
                    SPECIFIC STRENGTH
                  </label>
                  <input
                    type="text"
                    className="feedback-text-field"
                    placeholder="What did they do well?"
                    value={comp.strength}
                    onChange={(e) =>
                      handleInputChange(comp.id, "strength", e.target.value)
                    }
                  />
                </div>

                <div className="input-group">
                  <label className="input-label growth-label">
                    GROWTH AREA
                  </label>
                  <input
                    type="text"
                    className="feedback-text-field"
                    placeholder="How can they improve?"
                    value={comp.growth}
                    onChange={(e) =>
                      handleInputChange(comp.id, "growth", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Assistant Chat Interface */}
        <div className="ai-assistant-container">
          <div className="ai-assistant-header">
            <Bot size={18} className="bot-icon" />
            <h3>AI Feedback Assistant</h3>
          </div>

          <div className="chat-messages-area">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
                <div className="chat-bubble">
                  <p>{msg.text}</p>
                  {msg.actions && (
                    <div className="chat-actions-row">
                      {msg.actions.map((act, idx) => (
                        <button key={idx} className="chat-action-btn">
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-wrapper">
            <div className="chat-input-box">
              <input
                type="text"
                placeholder="Message assistant..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="chat-send-btn" onClick={handleSendMessage}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}