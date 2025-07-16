import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ImageUpload from "./ImageUpload";
import useSSE from "../hooks/useSSE";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const { stream, startStream } = useSSE("https://neo-backend-rzdt.onrender.com/chat/stream");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (stream) setMessages((m) => [...m.slice(0, -1), { role: "ai", content: stream }]);
  }, [stream]);

  const send = () => {
    if (!prompt.trim()) return;
    const userMsg = { role: "user", content: prompt };
    setMessages([...messages, userMsg, { role: "ai", content: "" }]);
    startStream({ prompt });
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
            <div
              className={`max-w-lg px-3 py-2 rounded-xl ${
                m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-700"
              }`}
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-slate-700">
        <ImageUpload
          onContent={(payload) =>
            setMessages([...messages, { role: "user", content: payload.ocr }, { role: "ai", content: payload.summary }])
          }
        />
        <div className="flex gap-2 mt-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Neo to build, fix, or explain..."
            className="flex-1 bg-slate-800 rounded px-3 py-2 focus:outline-none"
          />
          <button onClick={send} className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}