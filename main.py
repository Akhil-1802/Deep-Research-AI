from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pipeline import run_pipeline_stream

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/health")
def healthcheck():
    return {"status":"ok"}
@app.head("/health")
def health(request:Request):
    return {"status":"ok"}

@app.get("/topic/{topic}")
async def get_results(topic: str):
    return StreamingResponse(
        run_pipeline_stream(topic),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
