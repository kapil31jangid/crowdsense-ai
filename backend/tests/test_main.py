import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app

client = TestClient(app)

@pytest.fixture
def mock_db():
    with patch('main.db') as mock:
        yield mock

@pytest.fixture
def mock_llm():
    with patch('main.llm') as mock:
        yield mock

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()

def test_metrics_no_db():
    with patch('main.db', None):
        response = client.get("/metrics")
        assert response.status_code == 503

def test_metrics_success(mock_db):
    # Mock firestore stream
    mock_zone = MagicMock()
    mock_zone.to_dict.return_value = {
        "name": "Test Zone",
        "current_density": 0.5,
        "status": "Normal"
    }
    mock_db.collection().stream.return_value = [mock_zone]
    
    response = client.get("/metrics")
    assert response.status_code == 200
    assert response.json()["zone_count"] == 1
    assert response.json()["overall_occupancy"] == 0.5

def test_recommend_validation():
    # Long location name
    response = client.post("/recommend", json={
        "user_location": "a" * 200, 
        "destination": "Target"
    })
    assert response.status_code == 422 # Unprocessable Entity due to Field validation

@pytest.mark.asyncio
async def test_recommend_success(mock_llm, mock_db):
    mock_llm.ainvoke.return_value = MagicMock(content="Suggested route is via Zone B.")
    
    response = client.post("/recommend", json={
        "user_location": "Gate A",
        "destination": "Food Court"
    })
    
    assert response.status_code == 200
    assert "recommendation" in response.json()
    assert "Zone B" in response.json()["recommendation"]
