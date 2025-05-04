import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import { ChatProvider } from "./context/ChatContext";
function App() {
  const [messages, setMessages] = useState([

  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [loading, setLoading] = useState(false);

const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessages = [...messages, { role: "user", content: input }];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/api/chat", {
      messages: newMessages,
      model: "gpt-4"
    });

    const message = res.data;
    setMessages([...newMessages, { role: "assistant", content: message }]);
  } catch (err) {
    console.error("Error en el backend:", err);
    setMessages([
      ...newMessages,
      { role: "assistant", content: "Lo siento, ocurrió un error." }
    ]);
  }

  setLoading(false);
  };

  return (
    <ChatProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <ConversationList />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}


export default App;
