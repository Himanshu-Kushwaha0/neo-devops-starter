// Neo – Zero-Install DevOps AI
// Drop-in replacement for the current upload button
import { useState, useCallback } from "react";
import axios from "axios";
import { FiUploadCloud, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const OCR_URL   = "https://neo-backend-rzdt.onrender.com/upload/image";
const EXPLAIN_URL = "https://neo-backend-rzdt.onrender.com/screenshot/explain";

export default function ImageUpload({ onContent }) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState(null);

  const handleFile = async (file) => {
    if (!file?.type.startsWith("image/")) {
      setError("Only PNG/JPG screenshots, please.");
      return;
    }

    setLoading(true); setDone(false); setError(null);

    const form = new FormData();
    form.append("file", file);

    try {
      // 1️⃣ OCR
      const { data: ocr } = await axios.post(OCR_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2️⃣ AI explanation
      const { data: ai } = await axios.post(EXPLAIN_URL, {
        imageText: ocr.extracted || "",
      });

      // 3️⃣ Push upstream (chat panel decides what to render)
      onContent({
        type: "ai-response",
        ocr:      ocr.extracted,
        summary:  ai.summary,
        fix:      ai.fix,
        files:    ai.files,
      });

      setDone(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [onContent]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={clsx(
          "relative flex flex-col items-center gap-3 border-2 border-dashed rounded-2xl p-8 transition-all",
          dragOver
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-600 hover:border-indigo-400"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm"
            >
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Reading & analysing…
            </motion.div>
          )}

          {done && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-400"
            >
              <FiCheckCircle /> Done
            </motion.div>
          )}

          {!loading && !done && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-slate-300"
            >
              <FiUploadCloud size={36} />
              <span className="font-semibold">Drop screenshot or click to upload</span>
              <span className="text-xs opacity-60">PNG, JPG ≤ 4 MB</span>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-400 flex items-center gap-2"
        >
          <FiAlertTriangle /> {error}
        </motion.div>
      )}
    </div>
  );
}