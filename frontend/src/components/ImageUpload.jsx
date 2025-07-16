import { useState } from "react";
import axios from "axios";

const OCR_URL = "https://neo-backend-rzdt.onrender.com/upload/image";

export default function ImageUpload({ onExtract }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await axios.post(OCR_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onExtract(data.extracted || "No text found");
    } catch (err) {
      onExtract(`❌ OCR failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="btn btn-sm">
        📸 Upload Screenshot
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </label>
      {loading && <span className="text-sm text-info animate-pulse">reading…</span>}
    </div>
  );
}