import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChatContext } from "../context/ChatContext";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import "../styles/ChatWindow.css"; 

function ChatWindow() {
  const { conversations, activeConversation, setConversations } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(activeConversation.messages || []);
  const bottomRef = useRef(null);

  // Mantener mensajes actualizados si cambia la conversación activa
  useEffect(() => {
    setMessages(activeConversation.messages || []);
  }, [activeConversation]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    // Reflejar mensajes localmente primero
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Actualizar el contexto global
    setConversations(prev =>
      prev.map(c =>
        c.id === activeConversation.id ? { ...c, messages: newMessages } : c
      )
    );

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        messages: newMessages,
        model: "gpt-4"
      });

      const assistantMessage = { role: "assistant", content: res.data };
      const finalMessages = [...newMessages, assistantMessage];

      setMessages(finalMessages);

      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversation.id
            ? { ...c, messages: finalMessages }
            : c
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
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput input={input} setInput={setInput} onSend={sendMessage} loading={loading} />
    </div>
  );
}

export default ChatWindow;
