import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

# Firebase Initialization
firebase_app = None
db = None

try:
    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_app = firebase_admin.initialize_app(cred)
    else:
        # Attempt to use application default credentials
        firebase_app = firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print(f"Warning: Firebase not initialized: {e}")

# Gemini Initialization
llm = None
if os.getenv("GOOGLE_API_KEY"):
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    except Exception as e:
        print(f"Warning: Gemini AI not initialized: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialization logic on startup
    yield

app = FastAPI(title="CrowdSense AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    user_location: str
    destination: str

@app.get("/")
async def root():
    return {"status": "online", "message": "CrowdSense AI Backend"}

@app.get("/metrics")
async def get_metrics():
    if not db:
        return {"error": "Database not connected"}
    
    try:
        zones = db.collection("zones").stream()
        total_density = 0
        zone_count = 0
        high_density_zones = []
        
        for zone in zones:
            data = zone.to_dict()
            density = data.get("current_density", 0)
            total_density += density
            zone_count += 1
            if density > 0.8:
                high_density_zones.append(data.get("name"))
        
        avg_occupancy = total_density / zone_count if zone_count > 0 else 0
        
        return {
            "overall_occupancy": round(avg_occupancy, 2),
            "zone_count": zone_count,
            "high_density_alerts": high_density_zones,
            "status": "Critical" if avg_occupancy > 0.8 else "Normal"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
async def get_recommendation(request: RecommendationRequest):
    if not llm:
        return {
            "recommendation": f"Go to {request.destination} via the main concourse. (AI assistant currently offline)"
        }
    
    # Fetch live context from Firestore
    stadium_context = ""
    try:
        zones = db.collection("zones").stream()
        for zone in zones:
            data = zone.to_dict()
            stadium_context += f"- {data.get('name')}: {data.get('current_density', 0):.1%} full, status: {data.get('status')}\n"
    except:
        stadium_context = "Crowd data currently unavailable."

    prompt = (
        f"You are the CrowdSense AI Stadium Assistant. \n"
        f"Current Stadium State:\n{stadium_context}\n"
        f"Attendee Location: {request.user_location}\n"
        f"Target Destination: {request.destination}\n\n"
        "Recommend the most efficient path. If certain zones are 'Congested' or 'Critical', "
        "suggest alternatives. Explain your reasoning briefly based on the live data provided."
    )
    
    response = llm.invoke(prompt)
    return {"recommendation": response.content}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
