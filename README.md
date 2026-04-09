# CrowdSense AI – Smart Stadium Experience System

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/kapil31jangid/crowdsense-ai.git)
[![System Online](https://img.shields.io/badge/System-Online-brightgreen)](https://crowdsense-ai-kjmupfekoq-ew.a.run.app)

CrowdSense AI improves the physical event experience at large-scale sporting venues by providing real-time crowd density monitoring, predictive queue analysis, and intelligent path recommendations.

---

The system is officially running as a unified full-stack service on Google Cloud Run:

**👉 [CrowdSense AI Dashboard](https://crowdsense-ai-kjmupfekoq-ew.a.run.app)**

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, Tailwind CSS v4, Framer Motion.
- **Backend**: FastAPI (Python), serving both the API and the Static UI.
- **Infrastructure**: Unified Docker Container, Google Cloud Run.
- **Database**: Google Firebase (Firestore) for real-time synchronization.

---

## 📦 Project Structure

```text
crowdsense-ai/
├── frontend/           # Next.js 16 frontend (UI/UX)
├── backend/            # FastAPI backend & Simulation scripts
├── Dockerfile          # Root Unified Dockerfile (Frontend + Backend)
└── .dockerignore       # Global Docker Ignore
```

---

## 🛠️ Setup & Development

### Local Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate` (Windows)
4. `pip install -r requirements.txt`
5. `python main.py`

### Local Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🛰️ Simulation
To see the system in action, run the crowd simulation script which updates zone density in Firestore:
```bash
python backend/simulate_crowd.py
```
The **Simulation Screen** in the Frontend will automatically reflect these live updates via Firebase listeners.
