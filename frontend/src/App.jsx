import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from './services/api';
import './App.css';

let toastId = 0;

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts(t => [...t, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      const data = await fetchStudents(searchQuery);
      setStudents(data);
    } catch (err) {
      addToast('Failed to load students: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, addToast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleAddClick = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleDelete = (student) => {
    setDeletingStudent(student);
    setConfirmOpen(true);
  };

  const handleSave = async (data, id) => {
    try {
      if (id) {
        await updateStudent(id, data);
        addToast(`${data.first_name} ${data.last_name} updated successfully`, 'success');
      } else {
        await createStudent(data);
        addToast(`${data.first_name} ${data.last_name} added successfully`, 'success');
      }
      setModalOpen(false);
      setEditingStudent(null);
      await loadStudents();
    } catch (err) {
      addToast('Error: ' + err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    try {
      await deleteStudent(deletingStudent.id);
      addToast(`${deletingStudent.first_name} ${deletingStudent.last_name} deleted`, 'success');
      setConfirmOpen(false);
      setDeletingStudent(null);
      await loadStudents();
    } catch (err) {
      addToast('Error: ' + err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      <Header onAddClick={handleAddClick} />
      <main className="app-main">
        <div className="main-content">
          <StatsCards students={students} />
          <StudentTable
            students={students}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
      <footer className="app-footer">
        <p>StudentHub &copy; {new Date().getFullYear()} &mdash; Built with React & FastAPI</p>
      </footer>
      <StudentModal
        isOpen={modalOpen}
        student={editingStudent}
        onClose={() => { setModalOpen(false); setEditingStudent(null); }}
        onSave={handleSave}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Student"
        message={deletingStudent ? `Are you sure you want to delete ${deletingStudent.first_name} ${deletingStudent.last_name}? This action cannot be undone.` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingStudent(null); }}
      />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
