import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

function ConversationList() {
  const { conversations, setActiveConversation, activeConversation } = useContext(ChatContext);

  return (
    <div style={{
      width: "250px",
      borderRight: "1px solid var(--color-border)",
      backgroundColor: "#1a1a1a",
      padding: "1rem",
      overflowY: "auto"
    }}>
      <h3 style={{ marginBottom: "1rem" }}>Conversaciones</h3>
      {conversations.map(conv => (
        <div
          key={conv.id}
          onClick={() => setActiveConversation(conv)}
          style={{
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "6px",
            backgroundColor: activeConversation.id === conv.id ? "#2b2b2b" : "transparent",
            cursor: "pointer"
          }}
        >
          {conv.name}
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
