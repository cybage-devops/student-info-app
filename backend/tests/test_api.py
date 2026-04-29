"""Basic tests for Student API endpoints."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_students():
    response = client.get("/api/students/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  # Seed data should exist


def test_create_student():
    student = {
        "first_name": "Test",
        "last_name": "Student",
        "email": "test@university.edu",
        "course": "Testing 101",
        "enrollment_date": "2024-09-01",
        "gpa": 3.5
    }
    response = client.post("/api/students/", json=student)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Test"
    assert data["id"].startswith("stu-")


def test_get_student_not_found():
    response = client.get("/api/students/nonexistent")
    assert response.status_code == 404


def test_get_stats():
    response = client.get("/api/students/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_students" in data
    assert "average_gpa" in data
