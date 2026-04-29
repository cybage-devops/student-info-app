"""API routes for Student Information App."""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import StudentCreate, StudentUpdate, StudentResponse
from app.database import db

router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("/", response_model=List[StudentResponse])
async def list_students(search: Optional[str] = Query(None, description="Search by name, email, or course")):
    """List all students with optional search filter."""
    return db.get_all(search=search)


@router.get("/stats")
async def get_stats():
    """Get student statistics."""
    students = db.get_all()
    total = len(students)
    avg_gpa = 0.0
    if total > 0:
        gpas = [s.gpa for s in students if s.gpa is not None]
        avg_gpa = round(sum(gpas) / len(gpas), 2) if gpas else 0.0

    courses = set(s.course for s in students)
    return {
        "total_students": total,
        "average_gpa": avg_gpa,
        "total_courses": len(courses),
        "courses": sorted(list(courses))
    }


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str):
    """Get a single student by ID."""
    student = db.get_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with ID '{student_id}' not found")
    return student


@router.post("/", response_model=StudentResponse, status_code=201)
async def create_student(student: StudentCreate):
    """Create a new student record."""
    return db.create(student)


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(student_id: str, student: StudentUpdate):
    """Update an existing student record."""
    updated = db.update(student_id, student)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Student with ID '{student_id}' not found")
    return updated


@router.delete("/{student_id}", status_code=204)
async def delete_student(student_id: str):
    """Delete a student record."""
    deleted = db.delete(student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Student with ID '{student_id}' not found")
    return None
