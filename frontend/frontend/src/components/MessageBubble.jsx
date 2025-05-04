function MessageBubble({ message }) {
    const isUser = message.role === "user";
  
    return (
      <div
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser ? "var(--color-user)" : "var(--color-assistant)",
          color: "white",
          borderRadius: "12px",
          padding: "0.75rem 1rem",
          margin: "0.5rem",
          maxWidth: "70%",
          whiteSpace: "pre-wrap"
        }}
      >
        {message.content}
      </div>
    );
  }
  
  export default MessageBubble;
  