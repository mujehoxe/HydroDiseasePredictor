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
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewUser((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('https://vite-project-9cea.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
        return;
      }
      
      // If successful, fetch updated user list
      fetchUsers();
      setShowAddUserModal(false);
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: '',
      });
    } catch (err) {
      setError('An error occurred. Please try again later.');
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
                    {language === 'fr' ? 'Ajouter un nouveau utilisateur' : 'إضافة مستخدم جديد'}
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
                          id={user.id}
                          name={user.name}
                          email={user.email}
                          farms={user.farms}
                          role={user.role}
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

      <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {language === 'fr' ? 'Ajouter un utilisateur' : 'إضافة مستخدم'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>{language === 'fr' ? 'Nom complet' : 'الاسم الكامل'}</Form.Label>
              <Form.Control
                type="text"
                placeholder={language === 'fr' ? 'Entrez le nom complet' : 'أدخل الاسم الكامل'}
                value={newUser.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>{language === 'fr' ? 'Adresse email' : 'البريد الإلكتروني'}</Form.Label>
              <Form.Control
                type="email"
                placeholder={language === 'fr' ? 'Entrez l\'adresse email' : 'أدخل البريد الإلكتروني'}
                value={newUser.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{language === 'fr' ? 'Mot de passe' : 'كلمة المرور'}</Form.Label>
              <Form.Control
                type="password"
                placeholder={language === 'fr' ? 'Entrez le mot de passe' : 'أدخل كلمة المرور'}
                value={newUser.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>{language === 'fr' ? 'Selectioner le role' : 'حدد الدور'}</Form.Label>
              <Form.Select
                aria-label="select role"
                onChange={handleInputChange}
                value={newUser.role}
              >
                <option>{language === 'fr' ? 'Admin/Utilisateur' : 'مستخدم/مسؤول'}</option>
                <option value="farmer">{language === 'fr' ? 'Utilisateur' : 'مستخدم'}</option>
                <option value="admin">{language === 'fr' ? 'Admin' : 'مسؤول'}</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
            {language === 'fr' ? 'Annuler' : 'إلغاء'}
          </Button>
          <Button variant="success" onClick={handleAddUser}>
            {language === 'fr' ? 'Ajouter' : 'إضافة'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsersManagement;