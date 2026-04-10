# CrowdSense AI – Smart Stadium Experience System

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/kapil31jangid/crowdsense-ai.git)
[![System Online](https://img.shields.io/badge/System-Online-brightgreen)](https://crowdsense-ai-kjmupfekoq-ew.a.run.app)
[![Build Status](https://img.shields.io/badge/Build-Passed-success)](https://console.cloud.google.com/run/detail/europe-west1/crowdsense-ai?project=promptwars-stadium-ai)

CrowdSense AI improves the physical event experience at large-scale sporting venues by providing real-time crowd density monitoring, predictive queue analysis, and intelligent path recommendations.

---

The system is fully deployed as a unified full-stack service on Google Cloud Run. It handles real-time data sync, AI-driven pathfinding, and high-performance metrics visualization.

**🚀 [CrowdSense AI Live Dashboard](https://crowdsense-ai-kjmupfekoq-ew.a.run.app)**

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

## 🧪 Testing

The project includes a comprehensive test suite for both frontend and backend to ensure high score parity.

### Backend Tests (Pytest)

```bash
cd backend
pytest tests/test_main.py
```

### Frontend Tests (Vitest)

```bash
cd frontend
npm test
```

---

## 🛡️ Security & Accessibility

- **Security**: Hardened Firestore rules (read-only for public), strict CORS policies, and Pydantic schema validation for AI endpoints.
- **Accessibility**: Optimized for screen readers with `aria-live` regions, proper semantic heading hierarchy, and ARIA labels across the Dashboard and AI Assistant.
- **Google Services**: Integrated Firebase Analytics and Cloud-native asynchronous LLM handling.

---

## 🛰️ Simulation

To see the system in action, run the crowd simulation script which updates zone density in Firestore:

```bash
python backend/simulate_crowd.py
```

The **Dashboard Screen** in the Frontend will automatically reflect these live updates via real-time Firebase listeners.
