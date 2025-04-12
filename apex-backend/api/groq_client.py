import os
import groq
import base64
import json
import time
import asyncio
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

class GroqClient:
    def __init__(self, model_name: str = "llama-3.2-90b-vision-preview"):
        self.model_name = model_name
        load_dotenv()
        api_key = "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"
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")
        
        self.client = groq.Client(api_key=api_key)
        self.conversation_history: List[Dict[str, Any]] = [{"role":"system", "content":"You are a Helpful mentor AI chatbot, you will help people regarding their employement, they will prvoide you with details of them in each message, and you have to give them advice."}]
            
   
    async def process_text_prompt(self, prompt: str, model_name: str = None) -> dict:
        try:
            start_time = time.time()
            
            model = model_name if model_name else self.model_name
            
            self.add_to_conversation("user",prompt)
            response = self.client.chat.completions.create(
                model=model,
                messages=self.conversation_history,
                temperature=0.7,
                max_tokens=4000
            )
            
            processing_time = int((time.time() - start_time) * 1000)  # Convert to milliseconds
            
            self.add_to_conversation("assistant", response.choices[0].message.content)
            print(self.conversation_history)
            return {
                "response": response.choices[0].message.content,
                "model_used": model,
                "processing_time": processing_time
            }
            
        except Exception as e:
            print(f"Error processing text prompt with Groq API: {str(e)}")
            return {
                "response": f"Error: {str(e)}",
                "model_used": model_name if model_name else self.model_name,
                "processing_time": 0
            }
            
    
    def add_to_conversation(self, role: str, content: str):
        self.conversation_history.append({"role": role, "content": content})


if __name__ == "__main__":
    async def main():
        client = GroqClient()
        
        # Example text prompt
        result = await client.process_text_prompt("What is the capital of France?")
        print(f"Response: {result['response']}")
        
    asyncio.run(main()) 