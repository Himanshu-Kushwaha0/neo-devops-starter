from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess, json

router = APIRouter(prefix="/screenshot", tags=["screenshot"])

class ExplainRequest(BaseModel):
    imageText: str

class ExplainResponse(BaseModel):
    summary: str
    fix: str
    files: dict

@router.post("/explain", response_model=ExplainResponse)
def explain_screenshot(req: ExplainRequest):
    # Mock / fallback logic (works without keys)
    text = req.imageText.lower()
    if "dockerfile" in text:
        return ExplainResponse(
            summary="Dockerfile syntax error detected.",
            fix="Use `FROM python:3.11-slim` instead.",
            files={"Dockerfile": "FROM python:3.11-slim\nCMD ['python','app.py']"}
        )
    # Default fallback
    return ExplainResponse(
        summary="Generic error detected.",
        fix="Check logs and re-deploy.",
        files={}
    )