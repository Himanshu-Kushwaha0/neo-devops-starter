import { useState } from "react";
import { FiFolder, FiMessageSquare, FiSettings } from "react-icons/fi";
import ChatPanel from "./ChatPanel";
import FileTree from "./FileTree";
import CodeEditor from "./CodeEditor";

export default function NeoShell() {
  const [tab, setTab] = useState("chat");

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <nav className="w-14 bg-slate-800 flex flex-col items-center py-4 gap-6">
        {[
          { icon: <FiMessageSquare />, key: "chat" },
          { icon: <FiFolder />, key: "files" },
          { icon: <FiSettings />, key: "settings" },
        ].map(({ icon, key }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`p-2 rounded hover:bg-slate-700 transition ${
              tab === key ? "bg-indigo-600 text-white" : ""
            }`}
          >
            {icon}
          </button>
        ))}
      </nav>

      {/* Main panel */}
      <main className="flex-1 flex">
        {tab === "chat" && <ChatPanel />}
        {tab === "files" && (
          <div className="flex w-full">
            <FileTree className="w-1/4 border-r border-slate-700" />
            <CodeEditor className="flex-1" />
          </div>
        )}
        {tab === "settings" && <div className="p-4">Settings UI TBD</div>}
      </main>
    </div>
  );
}