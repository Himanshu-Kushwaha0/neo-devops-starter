import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

export default function CodeEditor({ className }) {
  const divEl = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (divEl.current) {
      editorRef.current = monaco.editor.create(divEl.current, {
        value: "# Paste code here…",
        language: "python",
        theme: "vs-dark",
        minimap: { enabled: false },
      });
    }
    return () => editorRef.current?.dispose();
  }, []);

  return <div ref={divEl} className={`w-full h-full ${className}`} />;
}