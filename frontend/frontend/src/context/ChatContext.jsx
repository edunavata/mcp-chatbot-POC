import { createContext, useState, useEffect } from "react";
import { loadConversations, saveConversations } from "../services/localStorageService";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const defaultConversations = [
    { id: 1, name: "Conversación 1", messages: [] }
  ];

  const [conversations, setConversations] = useState(() => {
    const loaded = loadConversations();
    return loaded.length > 0 ? loaded : defaultConversations;
  });

  const [activeConversation, setActiveConversation] = useState(() =>
    conversations.length > 0 ? conversations[0] : null
  );

  // ⬇ Guardar en localStorage al cambiar
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  return (
    <ChatContext.Provider
      value={{ conversations, setConversations, activeConversation, setActiveConversation }}
    >
      {children}
    </ChatContext.Provider>
  );
};
