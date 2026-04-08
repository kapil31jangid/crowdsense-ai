# CrowdSense AI – Smart Stadium Experience System

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/kapil31jangid/crowdsense-ai.git)

CrowdSense AI improves the physical event experience at large-scale sporting venues by providing real-time crowd density monitoring, predictive queue analysis, and intelligent path recommendations.

## 🚀 Key Features

- **Real-time Metrics**: Live tracking of zone occupancy and stadium-wide status.
- **AI Navigation**: Context-aware recommendations using Gemini 1.5 Pro to avoid congested areas.
- **Dynamic Heatmap**: Visual representation of crowd movement and gate capacity.
- **Queue Predictions**: Estimated wait times for major stadium entrances and facilities.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, shadcn/ui.
- **Backend**: FastAPI (Python), LangChain, Google Gemini 1.5 Pro.
- **Database**: Google Firebase (Firestore) for real-time synchronization.

---

## 📦 Project Structure

```text
crowdsense-ai/
├── frontend/           # Next.js 16 frontend
├── backend/            # FastAPI backend & Simulation scripts
└── .vscode/            # Workspace settings
```

---

## 🛠️ Setup Instructions

### Backend

1. Navigate to the `backend/` directory.
2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure your `.env` file with:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_PATH`
- `GOOGLE_API_KEY`

5. Start the server:

```bash
python main.py
```

### Frontend

1. Navigate to the `frontend/` directory.
2. Install dependencies:

```bash
npm install
```

3. Configure your `.env.local` file with Firebase credentials.
4. Start the development server:

```bash
npm run dev
```

---

## 🛰️ Simulation

To see the system in action, run the crowd simulation script which fluctuates zone density every 5 seconds:

```bash
python backend/simulate_crowd.py
```
