"""In-memory database for Student Information App.

This module provides a simple in-memory data store for student records.
Can be replaced with a real database (PostgreSQL, MongoDB, etc.) in production.
"""

import uuid
from datetime import date
from typing import Dict, List, Optional
from app.models import StudentCreate, StudentUpdate, StudentResponse


class StudentDatabase:
    """In-memory student database with CRUD operations."""

    def __init__(self):
        self._students: Dict[str, dict] = {}
        self._seed_data()

    def _seed_data(self):
        """Seed the database with sample student records."""
        sample_students = [
            {
                "first_name": "Aarav",
                "last_name": "Sharma",
                "email": "aarav.sharma@university.edu",
                "phone": "+91-9876543210",
                "course": "Computer Science",
                "enrollment_date": "2024-08-15",
                "gpa": 3.92
            },
            {
                "first_name": "Priya",
                "last_name": "Patel",
                "email": "priya.patel@university.edu",
                "phone": "+91-9876543211",
                "course": "Data Science",
                "enrollment_date": "2024-08-15",
                "gpa": 3.78
            },
            {
                "first_name": "Rahul",
                "last_name": "Kumar",
                "email": "rahul.kumar@university.edu",
                "phone": "+91-9876543212",
                "course": "Artificial Intelligence",
                "enrollment_date": "2023-08-20",
                "gpa": 3.65
            },
            {
                "first_name": "Sneha",
                "last_name": "Reddy",
                "email": "sneha.reddy@university.edu",
                "phone": "+91-9876543213",
                "course": "Cybersecurity",
                "enrollment_date": "2024-01-10",
                "gpa": 3.88
            },
            {
                "first_name": "Vikram",
                "last_name": "Singh",
                "email": "vikram.singh@university.edu",
                "phone": "+91-9876543214",
                "course": "Cloud Computing",
                "enrollment_date": "2023-08-20",
                "gpa": 3.45
            },
        ]
        for student_data in sample_students:
            student_id = f"stu-{uuid.uuid4().hex[:8]}"
            self._students[student_id] = {
                "id": student_id,
                **student_data,
            }

    def get_all(self, search: Optional[str] = None) -> List[StudentResponse]:
        """Get all students, optionally filtered by search term."""
        students = list(self._students.values())
        if search:
            search_lower = search.lower()
            students = [
                s for s in students
                if search_lower in s["first_name"].lower()
                or search_lower in s["last_name"].lower()
                or search_lower in s["email"].lower()
                or search_lower in s["course"].lower()
            ]
        return [StudentResponse(**s) for s in students]

    def get_by_id(self, student_id: str) -> Optional[StudentResponse]:
        """Get a single student by ID."""
        student = self._students.get(student_id)
        if student:
            return StudentResponse(**student)
        return None

    def create(self, student: StudentCreate) -> StudentResponse:
        """Create a new student record."""
        student_id = f"stu-{uuid.uuid4().hex[:8]}"
        student_dict = {
            "id": student_id,
            **student.model_dump(),
        }
        # Convert date to string for JSON serialization
        student_dict["enrollment_date"] = str(student_dict["enrollment_date"])
        self._students[student_id] = student_dict
        return StudentResponse(**student_dict)

    def update(self, student_id: str, student: StudentUpdate) -> Optional[StudentResponse]:
        """Update an existing student record."""
        if student_id not in self._students:
            return None
        existing = self._students[student_id]
        update_data = student.model_dump(exclude_unset=True)
        # Convert date to string if present
        if "enrollment_date" in update_data and update_data["enrollment_date"]:
            update_data["enrollment_date"] = str(update_data["enrollment_date"])
        existing.update(update_data)
        self._students[student_id] = existing
        return StudentResponse(**existing)

    def delete(self, student_id: str) -> bool:
        """Delete a student record. Returns True if deleted, False if not found."""
        if student_id in self._students:
            del self._students[student_id]
            return True
        return False

    def count(self) -> int:
        """Get total number of students."""
        return len(self._students)


# Singleton instance
db = StudentDatabase()
