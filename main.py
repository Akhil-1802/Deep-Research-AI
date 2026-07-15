from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pipeline import run_pipeline

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://deep-research-ai-system.netlify.app/"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/topic/{topic}")
def get_results(topic:str):
    states = run_pipeline(topic)
    return states
