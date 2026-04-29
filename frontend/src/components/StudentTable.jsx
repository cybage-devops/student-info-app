import { useState } from 'react';
import './StudentTable.css';

export default function StudentTable({ students, loading, searchQuery, onSearchChange, onEdit, onDelete }) {
  const [sortField, setSortField] = useState('first_name');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => (
    <span className={`sort-icon ${sortField === field ? 'active' : ''}`}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const getGpaColor = (gpa) => {
    if (gpa == null) return 'gpa-na';
    if (gpa >= 3.7) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-average';
    return 'gpa-low';
  };

  return (
    <div className="table-section glass-card animate-slide-up">
      {/* Search & Filter Bar */}
      <div className="table-toolbar">
        <div className="search-container">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search students by name, email, or course..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="search-students-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="table-info">
          <span className="badge badge-primary">{students.length} student{students.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="table-loading">
          <div className="loading-spinner" />
          <p>Loading students...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="table-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
          <h3>No students found</h3>
          <p className="text-muted">{searchQuery ? 'Try a different search term' : 'Add your first student to get started'}</p>
        </div>
      ) : (
        <div className="table-scroll-wrapper">
          <table className="students-table" id="students-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('first_name')}>Name <SortIcon field="first_name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon field="email" /></th>
                <th onClick={() => handleSort('course')}>Course <SortIcon field="course" /></th>
                <th onClick={() => handleSort('enrollment_date')}>Enrolled <SortIcon field="enrollment_date" /></th>
                <th onClick={() => handleSort('gpa')}>GPA <SortIcon field="gpa" /></th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((student, i) => (
                <tr key={student.id} className="student-row" style={{ animationDelay: `${i * 40}ms` }}>
                  <td>
                    <div className="student-name-cell">
                      <div className="student-avatar">
                        {student.first_name[0]}{student.last_name[0]}
                      </div>
                      <div>
                        <span className="student-fullname">{student.first_name} {student.last_name}</span>
                        {student.phone && <span className="student-phone">{student.phone}</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="cell-email">{student.email}</span></td>
                  <td><span className="badge badge-primary">{student.course}</span></td>
                  <td><span className="cell-date">{new Date(student.enrollment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span></td>
                  <td><span className={`gpa-badge ${getGpaColor(student.gpa)}`}>{student.gpa != null ? student.gpa.toFixed(2) : 'N/A'}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-ghost btn-icon" onClick={() => onEdit(student)} title="Edit student" id={`edit-${student.id}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="btn btn-ghost btn-icon btn-danger-ghost" onClick={() => onDelete(student)} title="Delete student" id={`delete-${student.id}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
