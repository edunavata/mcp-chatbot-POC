import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import "../styles/MessageBubble.css";

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const roleClass = isUser ? "user" : "assistant";

  return (
    <div className={`message-bubble ${roleClass}`}>
      <ReactMarkdown
        children={message.content}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && match) {
              return <CodeBlock code={codeString} language={match[1]} />;
            }

            return (
              <code className={`inline-code ${className || ""}`} {...props}>
                {children}
              </code>
            );
            
          },
        }}
      />
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <button className="copy-button" onClick={handleCopy}>
        {copied ? "✅ Copiado" : "📋 Copiar"}
      </button>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          borderRadius: "8px",
          fontSize: "0.85rem",
          background: "#1e1e1e",
          padding: "1rem",
          margin: 0
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default MessageBubble;
