import { useState } from "react";
import { ChatProvider } from "./context/ChatContext";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <ChatProvider>
      <div className="app-layout">
        {showSidebar && <ConversationList />}
        <ChatWindow
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          sidebarVisible={showSidebar}
        />
      </div>
    </ChatProvider>
  );
}

export default App;
