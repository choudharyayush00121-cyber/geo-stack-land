from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Satellite Surveillance Microservice")

# Enable CORS so the React app can communicate with it directly if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EncroachmentRequest(BaseModel):
    ulpin: str
    coordinates: list
    surveyNo: str

@app.post("/analyze-encroachment")
def analyze_encroachment(req: EncroachmentRequest):
    # Simulate processing time for downloading images and running PyTorch model
    time.sleep(2.5)
    
    # Simple deterministic mock logic based on ULPIN length or characters
    random.seed(req.ulpin)
    
    # Will this parcel have an encroachment?
    has_encroachment = random.choice([True, False, False]) # 33% chance
    
    historical_pct = random.randint(10, 40)
    current_pct = historical_pct + random.randint(15, 30) if has_encroachment else historical_pct + random.randint(0, 3)
    
    severity = "CRITICAL" if current_pct - historical_pct > 20 else ("HIGH" if has_encroachment else "NONE")
    
    return {
        "success": True,
        "ulpin": req.ulpin,
        "analysis": {
            "encroachmentDetected": has_encroachment,
            "severity": severity,
            "detectedViolation": "Unauthorized permanent structure detected in zoning buffer." if has_encroachment else "No significant structural changes detected.",
            "historicalBuildingAreaPct": historical_pct,
            "currentBuildingAreaPct": current_pct,
            "riskScore": random.randint(70, 99) if has_encroachment else random.randint(10, 30),
            "processedTimestamp": time.time(),
            "model_used": "ResNet50-Temporal-Diff-v2"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
