import LoadingDots from "./LoadingDots";
import "../styles/ChatInput.css";

function ChatInput({ input, setInput, onSend, loading }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "1rem",
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "#1a1a1a",
      }}
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Escribe tu mensaje..."
        style={{
          flex: 1,
          padding: "0.75rem",
          background: "#2a2a2a",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          color: "white",
        }}
      />
      <button
        onClick={onSend}
        disabled={loading}
        style={{
          marginLeft: "0.75rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "var(--color-accent)",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
        }}
      >
        {loading ? <LoadingDots /> : "Enviar"}
      </button>
    </div>
  );
}

export default ChatInput;
