import { useState } from 'react'
import axios from 'axios'

function App() {
  const [messages, setMessages] = useState([{ role: "system", content: "You are a helpful assistant." }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    const res = await axios.post("http://localhost:5000/chat", {
      messages: newMessages,
      model: "gpt-4" // editable
    });

    setMessages([...newMessages, res.data]);
    setInput("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      {messages.map((msg, i) => (
        <div key={i}><strong>{msg.role}:</strong> {msg.content}</div>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
