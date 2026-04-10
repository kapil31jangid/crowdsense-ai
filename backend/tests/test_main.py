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

def test_metrics_schema_fallback(mock_db):
    # Test that it handles both 'density' and 'current_density' correctly (NaN fix)
    mock_zone_1 = MagicMock()
    mock_zone_1.to_dict.return_value = {"name": "Zone A", "current_density": 0.2, "status": "Normal"}
    
    mock_zone_2 = MagicMock()
    mock_zone_2.to_dict.return_value = {"name": "Zone B", "density": 0.4, "status": "Normal"}
    
    mock_db.collection().stream.return_value = [mock_zone_1, mock_zone_2]
    
    response = client.get("/metrics")
    assert response.status_code == 200
    assert response.json()["overall_occupancy"] == 0.3 # (0.2 + 0.4) / 2

def test_recommend_intelligent_fallback(mock_db):
    # Force llm to be None to trigger smart fallback
    with patch('main.llm', None):
        mock_zone_1 = MagicMock()
        mock_zone_1.to_dict.return_value = {"name": "Near Zone", "current_density": 0.9, "status": "Congested"}
        mock_zone_2 = MagicMock()
        mock_zone_2.to_dict.return_value = {"name": "Empty Zone", "current_density": 0.1, "status": "Normal"}
        
        mock_db.collection().stream.return_value = [mock_zone_1, mock_zone_2]
        
        response = client.post("/recommend", json={
            "user_location": "Near Zone",
            "destination": "Food Court"
        })
        
        assert response.status_code == 200
        assert response.json()["status"] == "Fallback"
        assert "Empty Zone" in response.json()["recommendation"]
        assert "10% occupancy" in response.json()["recommendation"]

@pytest.mark.asyncio
async def test_recommend_success(mock_llm, mock_db):
    mock_llm.ainvoke.return_value = MagicMock(content="Suggested route is via Zone B.")
    
    # Mock some zones so metrics are available for the AI prompt
    mock_zone = MagicMock()
    mock_zone.to_dict.return_value = {"name": "Zone B", "current_density": 0.2, "status": "Normal"}
    mock_db.collection().stream.return_value = [mock_zone]

    response = client.post("/recommend", json={
        "user_location": "Gate A",
        "destination": "Food Court"
    })
    
    assert response.status_code == 200
    assert response.json()["status"] == "Success"
    assert "Zone B" in response.json()["recommendation"]
