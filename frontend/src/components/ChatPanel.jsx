import ImageUpload from "./ImageUpload";

// appendMessage(type, payload) is your existing function
<ImageUpload
  onContent={(payload) => appendMessage("ai-response", payload)}
/>