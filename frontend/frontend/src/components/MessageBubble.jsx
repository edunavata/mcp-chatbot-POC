import "../styles/MessageBubble.css"; 

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const roleClass = isUser ? "user" : "assistant";

  return (
    <div className={`message-bubble ${roleClass}`}>
      {message.content}
    </div>
  );
}

export default MessageBubble;
