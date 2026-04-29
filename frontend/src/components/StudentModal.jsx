import { useState, useEffect } from 'react';
import './StudentModal.css';

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '',
  course: '', enrollment_date: new Date().toISOString().split('T')[0], gpa: '',
};

export default function StudentModal({ isOpen, student, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = !!student;

  useEffect(() => {
    if (student) {
      setForm({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        phone: student.phone || '',
        course: student.course || '',
        enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0],
        gpa: student.gpa != null ? String(student.gpa) : '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [student, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.course.trim()) e.course = 'Course is required';
    if (form.gpa && (isNaN(form.gpa) || form.gpa < 0 || form.gpa > 4))
      e.gpa = 'GPA must be between 0 and 4';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const data = {
      ...form,
      gpa: form.gpa ? parseFloat(form.gpa) : null,
    };
    await onSave(data, student?.id);
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="input-group">
                <label className="input-label" htmlFor="first_name">First Name *</label>
                <input className={`input-field ${errors.first_name ? 'input-error' : ''}`} id="first_name" value={form.first_name} onChange={e => handleChange('first_name', e.target.value)} placeholder="Enter first name" />
                {errors.first_name && <span className="field-error">{errors.first_name}</span>}
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="last_name">Last Name *</label>
                <input className={`input-field ${errors.last_name ? 'input-error' : ''}`} id="last_name" value={form.last_name} onChange={e => handleChange('last_name', e.target.value)} placeholder="Enter last name" />
                {errors.last_name && <span className="field-error">{errors.last_name}</span>}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email *</label>
              <input className={`input-field ${errors.email ? 'input-error' : ''}`} id="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="student@university.edu" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-row">
              <div className="input-group">
                <label className="input-label" htmlFor="phone">Phone</label>
                <input className="input-field" id="phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91-9876543210" />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="gpa">GPA (0-4)</label>
                <input className={`input-field ${errors.gpa ? 'input-error' : ''}`} id="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={e => handleChange('gpa', e.target.value)} placeholder="3.85" />
                {errors.gpa && <span className="field-error">{errors.gpa}</span>}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="course">Course / Department *</label>
              <input className={`input-field ${errors.course ? 'input-error' : ''}`} id="course" value={form.course} onChange={e => handleChange('course', e.target.value)} placeholder="Computer Science" />
              {errors.course && <span className="field-error">{errors.course}</span>}
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="enrollment_date">Enrollment Date</label>
              <input className="input-field" id="enrollment_date" type="date" value={form.enrollment_date} onChange={e => handleChange('enrollment_date', e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving} id="save-student-btn">
              {saving ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
