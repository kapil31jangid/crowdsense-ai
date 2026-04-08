import time
import random
import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
try:
    cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    exit(1)

# Stadium Zones to simulate
ZONES = [
    {"id": "gate_a", "name": "East Gate A", "capacity": 5000},
    {"id": "gate_b", "name": "West Gate B", "capacity": 4000},
    {"id": "concourse_1", "name": "Level 1 Concourse", "capacity": 8000},
    {"id": "food_court", "name": "Central Plaza Food Court", "capacity": 2000},
    {"id": "vip_lounge", "name": "Executive VIP Lounge", "capacity": 500},
]

def initialize_zones():
    print("Initializing stadium zones...")
    for zone in ZONES:
        db.collection("zones").document(zone["id"]).set({
            "name": zone["name"],
            "max_capacity": zone["capacity"],
            "current_density": random.uniform(0.1, 0.3),  # Initial 10-30%
            "status": "Normal",
            "last_updated": firestore.SERVER_TIMESTAMP
        })

def simulate():
    print("Starting crowd simulation (Ctrl+C to stop)...")
    while True:
        for zone in ZONES:
            # Randomly fluctuate density
            doc_ref = db.collection("zones").document(zone["id"])
            current = doc_ref.get().to_dict().get("current_density", 0.5)
            
            # Fluctuate by +/- 5%
            new_density = max(0, min(1.0, current + random.uniform(-0.05, 0.05)))
            
            status = "Normal"
            if new_density > 0.8:
                status = "Congested"
            elif new_density > 0.95:
                status = "Critical"
                
            doc_ref.update({
                "current_density": new_density,
                "status": status,
                "last_updated": firestore.SERVER_TIMESTAMP
            })
            
            print(f"Updated {zone['name']}: {new_density:.2%} ({status})")
            
            # Also update a sample queue time for the food court
            if zone["id"] == "food_court":
                wait_time = int(new_density * 45) # Max 45 mins
                db.collection("queues").document("main_food").set({
                    "name": "Central Food Court",
                    "wait_time": wait_time,
                    "length": int(new_density * 100),
                    "last_updated": firestore.SERVER_TIMESTAMP
                })

        time.sleep(5)  # Update every 5 seconds

if __name__ == "__main__":
    initialize_zones()
    simulate()
