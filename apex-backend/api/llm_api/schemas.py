from pydantic import BaseModel
from typing import Optional

class LLMPromptRequest(BaseModel):
    """Request model for LLM prompt API."""
    prompt: str
    model_name: Optional[str] = "llama-3.2-90b-vision-preview"  # Default model



