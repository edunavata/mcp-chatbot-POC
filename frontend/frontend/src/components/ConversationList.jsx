import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import "../styles/ConversationList.css";

let nextId = Date.now(); // ID simple

function ConversationList() {
  const {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
  } = useContext(ChatContext);

  const handleAddConversation = () => {
    const newConv = {
      id: nextId++,
      name: "Nueva conversación",
      messages: [],
    };
    const newList = [newConv, ...conversations];
    setConversations(newList);
    setActiveConversation(newConv);
  };

  const handleDelete = (id) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);

    if (activeConversation?.id === id && filtered.length) {
      setActiveConversation(filtered[0]);
    } else if (!filtered.length) {
      setActiveConversation(null);
    }
  };

  const handleTitleChange = (id, name) => {
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, name } : c
    );
    setConversations(updated);
  };

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h3>Conversaciones</h3>
        <button onClick={handleAddConversation} className="conversation-add">
          +
        </button>
      </div>

      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={`conversation-item ${
            activeConversation?.id === conv.id ? "active" : ""
          }`}
          onClick={() => setActiveConversation(conv)}
        >
          <input
            className="conversation-title-input"
            value={conv.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleTitleChange(conv.id, e.target.value)}
          />
          <div className="conversation-actions">
            <button
              title="Eliminar"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(conv.id);
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
