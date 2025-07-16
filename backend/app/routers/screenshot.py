from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import openai  # we'll use OPENAI_API_KEY from env

router = APIRouter(prefix="/screenshot", tags=["screenshot"])

openai.api_key = os.getenv("OPENAI_API_KEY")


class ExplainRequest(BaseModel):
    imageText: str
    languageHint: str = ""


class ExplainResponse(BaseModel):
    summary: str
    fix: str
    files: Dict[str, str]  # filename → content


SYSTEM = """
You are Neo, an expert DevOps AI.
The user pasted a screenshot that contains text. Detect:
- Is it a build error, runtime error, config file, Dockerfile, etc.
- Provide a concise summary.
- Give the exact fix or next command.
- If code/config changes are needed, output the new file(s) as JSON map.
"""


@router.post("/explain", response_model=ExplainResponse)
def explain_screenshot(req: ExplainRequest):
    try:
        messages = [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Text from screenshot:\n{req.imageText}"}
        ]
        reply = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages, temperature=0)
        data = json.loads(reply.choices[0].message.content)
        return ExplainResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))