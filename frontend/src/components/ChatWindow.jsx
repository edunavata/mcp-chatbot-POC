import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChatContext } from "../context/ChatContext";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import "../styles/ChatWindow.css";

function ChatWindow({ onToggleSidebar, sidebarVisible }) {
  const { activeConversation, setConversations } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Sync con activeConversation
  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages || []);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConversation) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, messages: newMessages } : c
      )
    );

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL, {
        messages: newMessages,
        model: "gpt-4",
      });

      const assistantMessage = { role: "assistant", content: res.data };
      const finalMessages = [...newMessages, assistantMessage];

      setMessages(finalMessages);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id ? { ...c, messages: finalMessages } : c
        )
      );
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarVisible ? "←" : "☰"}
        </button>
        <h1 className="chat-title">MCP Hub</h1>
      </div>

      {!activeConversation ? (
        <div className="chat-empty">
          <p>No hay conversaciones activas.</p>
          <p>
            Usa el botón <strong>+</strong> para crear una nueva.
          </p>
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

export default ChatWindow;
