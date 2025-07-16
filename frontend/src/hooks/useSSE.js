import { useState, useEffect } from "react";

export default function useSSE(url) {
  const [stream, setStream] = useState("");
  const [source, setSource] = useState(null);

  const startStream = (body) => {
    if (source) source.close();
    const es = new EventSource(`${url}?prompt=${encodeURIComponent(body.prompt)}`);
    es.onmessage = (e) => setStream((s) => s + e.data);
    es.onerror = () => es.close();
    setSource(es);
  };

  useEffect(() => () => source?.close(), [source]);
  return { stream, startStream };
}