from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from langgraph_engine import langgraph_engine
from crewai_engine import crewai_team
from mastra_engine import mastra_engine
from vector_memory_store import hybrid_search, memory_manager, KNOWLEDGE_CORPUS
from observability_evals import generate_langfuse_trace, calculate_ragas_trulens_eval

app = FastAPI(
    title="GeoLand Multi-Agent Orchestration & Observability Service",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RunAgentRequest(BaseModel):
    ulpin: str
    parcelData: Optional[Dict[str, Any]] = None

class VectorSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    topK: Optional[int] = 4

# Trace cache
TRACE_HISTORY = []
EVAL_HISTORY = []

@app.get("/")
def get_status():
    return {
        "service": "GeoLand Multi-Agent Orchestration & Observability Microservice",
        "orchestrationFrameworks": ["LangGraph", "CrewAI", "Mastra"],
        "knowledgeAndMemory": ["VectorDB (Dense + BM25)", "Episodic Memory", "Entity Memory"],
        "observabilityAndEvals": ["Langfuse", "Arize Phoenix", "Ragas", "TruLens"],
        "dataLayer": "PostgreSQL (Prisma)",
        "status": "HEALTHY"
    }

@app.post("/api/agents/langgraph/run")
def run_langgraph(req: RunAgentRequest):
    result = langgraph_engine.execute(req.ulpin, req.parcelData)
    TRACE_HISTORY.insert(0, result["trace"])
    EVAL_HISTORY.insert(0, result["evals"])
    return {"success": True, **result}

@app.post("/api/agents/crewai/run")
def run_crewai(req: RunAgentRequest):
    result = crewai_team.execute(req.ulpin, req.parcelData)
    TRACE_HISTORY.insert(0, result["trace"])
    EVAL_HISTORY.insert(0, result["evals"])
    return {"success": True, **result}

@app.post("/api/agents/mastra/run")
def run_mastra(req: RunAgentRequest):
    result = mastra_engine.execute(req.ulpin, req.parcelData)
    TRACE_HISTORY.insert(0, result["trace"])
    EVAL_HISTORY.insert(0, result["evals"])
    return {"success": True, **result}

@app.post("/api/vector/search")
def search_vector_db(req: VectorSearchRequest):
    results = hybrid_search(req.query, req.category, req.topK)
    return {
        "success": True,
        "query": req.query,
        "results": results,
        "totalKnowledgeChunks": len(KNOWLEDGE_CORPUS)
    }

@app.get("/api/memory/context")
def get_memory_context(ulpin: Optional[str] = None):
    return {
        "success": True,
        "memory": memory_manager.get_context(ulpin)
    }

@app.get("/api/observability/traces")
def get_traces():
    # If no traces yet, create a default benchmark trace
    if not TRACE_HISTORY:
        dummy_trace = langgraph_engine.execute("14829304812901")
        return {"success": True, "traces": [dummy_trace["trace"]]}
    return {"success": True, "traces": TRACE_HISTORY[:15]}

@app.get("/api/evals/scorecard")
def get_eval_scorecard():
    if not EVAL_HISTORY:
        dummy_trace = langgraph_engine.execute("14829304812901")
        return {"success": True, "scorecard": dummy_trace["evals"]}
    return {"success": True, "scorecard": EVAL_HISTORY[0], "history": EVAL_HISTORY[:10]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
