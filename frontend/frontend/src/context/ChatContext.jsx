import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([
    { id: 1, name: "Conversación 1", messages: [] },
    { id: 2, name: "Conversación 2", messages: [] }
  ]);

  const [activeConversation, setActiveConversation] = useState(conversations[0]);

  return (
    <ChatContext.Provider
      value={{ conversations, setConversations, activeConversation, setActiveConversation }}
    >
      {children}
    </ChatContext.Provider>
  );
};
