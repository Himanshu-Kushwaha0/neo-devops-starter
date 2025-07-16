// frontend/src/components/ImageUpload.jsx
import { useState, useCallback } from "react";
import axios from "axios";
import { FiUploadCloud, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const OCR_URL = "https://neo-backend-rzdt.onrender.com/upload/image";
const EXPLAIN_URL = "https://neo-backend-rzdt.onrender.com/screenshot/explain";

export default function ImageUpload({ onContent }) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setLoading(false);
    setDone(false);
    setError(null);
  };

  const handleFile = async (file) => {
    if (!file?.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }
    reset();
    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      // 1) OCR
      const { data: ocr } = await axios.post(OCR_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2) AI explanation
      const { data: ai } = await axios.post(EXPLAIN_URL, {
        imageText: ocr.extracted || "",
      });

      // send everything upstream
      onContent({
        type: "ai-response",
        ocr: ocr.extracted,
        summary: ai.summary,
        fix: ai.fix,
        files: ai.files,
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
    <div className="w-full max-w-md mx-auto">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={clsx(
          "relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all",
          dragOver
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-400 dark:border-slate-600 hover:border-indigo-400"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0"
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
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Reading screenshot...
            </motion.div>
          )}
          {!loading && done && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-500"
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
              className="flex flex-col items-center gap-2 text-slate-600 dark:text-slate-300"
            >
              <FiUploadCloud size={32} />
              <span className="font-semibold">Drop screenshot or click to upload</span>
              <span className="text-xs opacity-60">PNG, JPG up to 4 MB</span>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-500 flex items-center gap-2"
        >
          <FiAlertTriangle /> {error}
        </motion.div>
      )}
    </div>
  );
}