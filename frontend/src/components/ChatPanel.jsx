import ImageUpload from "./ImageUpload";

{/* inside the render */}
<ImageUpload onExtract={(text) => appendMessage("user", text)} />