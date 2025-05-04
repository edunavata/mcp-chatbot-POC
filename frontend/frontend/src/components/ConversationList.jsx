import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import "../styles/ConversationList.css";

let nextId = Date.now();

function ConversationList() {
  const {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
  } = useContext(ChatContext);

  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

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

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempName("");
  };

  const confirmEditing = (id) => {
    handleTitleChange(id, tempName.trim() || "Sin título");
    setEditingId(null);
    setTempName("");
  };

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h3>Conversaciones</h3>
        <button onClick={handleAddConversation} className="conversation-add">
          +
        </button>
      </div>

      {conversations.map((conv) => {
        const isEditing = editingId === conv.id;

        return (
          <div
            key={conv.id}
            className={`conversation-item ${
              activeConversation?.id === conv.id ? "active" : ""
            }`}
            onClick={() => !isEditing && setActiveConversation(conv)}
          >
            {isEditing ? (
              <input
                className="conversation-title-input"
                value={tempName}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
              />
            ) : (
              <div className="conversation-title">{conv.name}</div>
            )}

            <div className="conversation-actions">
              {isEditing ? (
                <>
                  <button
                    title="Confirmar"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmEditing(conv.id);
                    }}
                  >
                    ✅
                  </button>
                  <button
                    title="Cancelar"
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelEditing();
                    }}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <button
                    title="Editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(conv.id, conv.name);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    title="Eliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conv.id);
                    }}
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConversationList;
