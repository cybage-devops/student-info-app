"""Pydantic models for Student Information App."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
import uuid


class StudentBase(BaseModel):
    """Base student model with common fields."""
    first_name: str = Field(..., min_length=1, max_length=100, description="Student's first name")
    middle_name: Optional[str] = Field(None, max_length=100, description="Student's middle name")
    last_name: str = Field(..., min_length=1, max_length=100, description="Student's last name")
    email: str = Field(..., description="Student's email address")
    phone: Optional[str] = Field(None, max_length=20, description="Student's phone number")
    course: str = Field(..., min_length=1, max_length=200, description="Course or department")
    enrollment_date: date = Field(default_factory=date.today, description="Date of enrollment")
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0, description="Grade Point Average (0.0 - 4.0)")


class StudentCreate(StudentBase):
    """Model for creating a new student."""
    pass


class StudentUpdate(BaseModel):
    """Model for updating an existing student (all fields optional)."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    middle_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=20)
    course: Optional[str] = Field(None, min_length=1, max_length=200)
    enrollment_date: Optional[date] = None
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)


class StudentResponse(StudentBase):
    """Model for student response with ID."""
    id: str = Field(..., description="Unique student identifier")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "stu-abc123",
                "first_name": "John",
                "middle_name": "William",
                "last_name": "Doe",
                "email": "john.doe@university.edu",
                "phone": "+1-555-0100",
                "course": "Computer Science",
                "enrollment_date": "2024-09-01",
                "gpa": 3.85
            }
        }
