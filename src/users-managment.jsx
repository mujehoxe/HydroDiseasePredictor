import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { useLocation } from 'react-router-dom';
import Sidebar from './components/SidebarOffcanvas';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React, { useEffect, useState } from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table';
import './css/SuperResponsiveTableStyle.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLanguage } from './LanguageContext';
import { useNavigate } from 'react-router-dom';
import UserRow from './components/UserRow';
import AddUserModal from './components/AddUserModal';

function UsersManagement() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const token = sessionStorage.getItem('authToken');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [error, setError] = useState(null);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      language === 'fr'
        ? 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?\nCette action est irréversible.'
        : 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟\nهذا الإجراء لا رجوع فيه.'
    );

    if (!confirmDelete) return;
    try {
      // Update UI optimistically
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      const response = await fetch(`https://vite-project-9cea.onrender.com/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If deletion fails, revert the UI change
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete user');
        // Refetch users to restore state
        fetchUsers();
      }
    } catch (error) {
      setError('Error deleting user');
      // Refetch users to restore state
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://vite-project-9cea.onrender.com/api/v1/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
        setError(null); // Clear any existing errors
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch users');
      }
    } catch (error) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };


  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowAddUserModal(true);
};

  const handleUserAddedOrUpdated = () => {
      fetchUsers();
      setShowAddUserModal(false);
      setUserToEdit(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate, language]);

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="desktop-sidebar">
        <Sidebar />
      </div>
      
      <div className="content">
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
          <a href="#" className="sidebar-toggler flex-shrink-0 d-lg-none" onClick={handleShowOffcanvas}>
            <i className="fa fa-bars"></i>
          </a>
          <div style={{
            display: 'flex',
            color: 'black',
            fontSize: '25px',
            height: '64px',
            alignItems: 'center',
            paddingLeft: '20px',
          }}>
            {language === 'fr' ? 'Gestion des utilisateurs' : 'إدارة المستخدمين'}
          </div>
        </nav>

        <div className="container-fluid pt-4 px-4 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="row g-4 w-100 justify-content-center align-items-stretch" style={{ maxWidth: '1200px' }}>
            <div className="col-12">
              <div className="bg-light rounded h-100 p-4">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder={language === 'fr' ? 'Rechercher...' : 'ابحث هنا...'}
                    style={{ width: '250px' }}
                  />
                  <Button variant="primary" onClick={() => setShowAddUserModal(true)}>
                    {language === 'fr' ? 'Ajouter un nouvel utilisateur' : 'إضافة مستخدم جديد'}
                  </Button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>{language === 'fr' ? 'Nom complet' : 'الاسم الكامل'}</Th>
                        <Th>{language === 'fr' ? 'Adresse email' : 'البريد الإلكتروني'}</Th>
                        <Th>{language === 'fr' ? 'Fermes' : 'المزارع'}</Th>
                        <Th>{language === 'fr' ? 'Rôle' : 'الدور'}</Th>
                        <Th>{language === 'fr' ? 'Actions' : 'الإجراءات'}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          id={user.id}
                          name={user.name}
                          email={user.email}
                          farms={user.farms}
                          password={user.password}
                          role={user.role}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />
                      ))}
                    </Tbody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </div>

        <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} className="custom-offcanvas">
          <Offcanvas.Header closeButton className="d-flex justify-content-end" />
          <Offcanvas.Body>
            <Sidebar />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      {showAddUserModal && (
                <AddUserModal
                    show={showAddUserModal}
                    handleClose={() => setShowAddUserModal(false)}
                    onUserAddedOrUpdated={handleUserAddedOrUpdated}
                    userToEdit={userToEdit}
                />
            )}
    </div>
  );
}

export default UsersManagement;