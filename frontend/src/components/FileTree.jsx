import { useState } from "react";
import { FiFile, FiFolder, FiPlus } from "react-icons/fi";

const files = [
  { name: "src", type: "folder", children: ["main.py", "utils.py"] },
  { name: "Dockerfile", type: "file" },
];

export default function FileTree({ className }) {
  const [open, setOpen] = useState({});
  return (
    <div className={`p-2 bg-slate-800 text-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">Explorer</span>
        <button className="text-slate-400 hover:text-white">
          <FiPlus />
        </button>
      </div>
      {files.map((f) =>
        f.type === "folder" ? (
          <div key={f.name}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen({ ...open, [f.name]: !open[f.name] })}
            >
              <FiFolder /> {f.name}
            </div>
            {open[f.name] && (
              <div className="ml-4">
                {f.children.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <FiFile /> {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div key={f.name} className="flex items-center gap-2">
            <FiFile /> {f.name}
          </div>
        )
      )}
    </div>
  );
}