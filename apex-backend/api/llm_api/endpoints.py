from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import Response
from typing import List, Dict, Optional
import io
import os
import time
from datetime import datetime
from sqlalchemy.orm import Session
from ..groq_client import GroqClient
from .schemas import LLMPromptRequest
from pydantic import BaseModel

router = APIRouter()
groq_client = GroqClient(model_name="llama-3.2-90b-vision-preview")

import pickle
import pandas as pd
import numpy as np

occupations = ['Management', 'Business', 'Applied Sciences', 'Health', 'Education', 'Arts', 'Sales', 'Service', 'Trades','Agriculture','Manufacturing']
with open('api\llm_api\knn_model.pkl', 'rb') as file:
    model = pickle.load(file)

with open('api\llm_api\scaler.pkl', 'rb') as file:
    scaler = pickle.load(file)


class JobPredictionRequest(BaseModel):
    prov: int
    cma: int
    age_12: int
    gender: int
    marstat: int
    educ: int


def predict_top_3_jobs(prov, cma, age_12, gender, marstat, educ):
    input_data = pd.DataFrame({
        'PROV': [prov],
        'CMA': [cma],
        'AGE_12': [age_12],
        'GENDER': [gender],
        'MARSTAT': [marstat],
        'EDUC': [educ]
    })
    
    scaled_input = scaler.transform(input_data)
    
    proba = model.predict_proba(scaled_input)[0]
    
    top_3_indices = np.argsort(proba)[-3:][::-1]
    
    top_3_predictions = [model.classes_[i] for i in top_3_indices]
    top_3_probabilities = [proba[i] for i in top_3_indices]
    
    return list(map(lambda x: occupations[int(x)-1], top_3_predictions))



@router.post("/prompt/text")
async def process_text_prompt(
    prompt_request: LLMPromptRequest,
):

    result = await groq_client.process_text_prompt(
        prompt=prompt_request.prompt,
        model_name=prompt_request.model_name
    )
    #print(result["response"])
    return result["response"]


@router.post("/predict-jobs", response_model=List[str])
async def predict_jobs(request: JobPredictionRequest):
    result = predict_top_3_jobs(
        prov=request.prov,
        cma=request.cma,
        age_12=request.age_12,
        gender=request.gender,
        marstat=request.marstat,
        educ=request.educ
    )
    return result
            
   