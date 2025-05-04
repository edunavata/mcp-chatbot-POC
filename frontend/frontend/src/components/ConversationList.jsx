import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import "../styles/ConversationList.css";

function ConversationList() {
  const { conversations, setActiveConversation, activeConversation } = useContext(ChatContext);

  return (
    <div className="conversation-list">
      <h3>Conversaciones</h3>
      {conversations.map(conv => (
        <div
          key={conv.id}
          onClick={() => setActiveConversation(conv)}
          className={`conversation-item ${activeConversation.id === conv.id ? "active" : ""}`}
        >
          {conv.name}
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
