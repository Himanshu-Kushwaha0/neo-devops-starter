# backend/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import pytesseract
from PIL import Image
import io

app = FastAPI(title="Neo DevOps API", version="1.0.0")

# Allow all origins for demo; tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Neo backend is alive 🚀"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """
    Placeholder – will detect language, deps, port, framework.
    """
    return {"filename": file.filename, "language": "detected-demo"}


@app.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Accepts PNG/JPG screenshots → returns extracted text via OCR.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        image = Image.open(io.BytesIO(await file.read()))
        text = pytesseract.image_to_string(image).strip()
        return {"extracted": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)