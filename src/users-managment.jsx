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

import UserRow from './components/UserRow';

function UsersManagement() {
// State to manage the Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);



  const { language } = useLanguage();
  const [loading] = useState(false);
  const [error] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    farms: '',
  });

  const handleAddUser = () => {
    console.log('New user added:', newUser);
    // Add your logic for adding the new user here
    setShowAddUserModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      {/* Sidebar Start */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>
      {/* Sidebar End */}
      
      {/* Content Start */}
      <div className="content">
        {/* Navbar Start */}
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
          <a 
            href="#" 
            className="sidebar-toggler flex-shrink-0 d-lg-none" 
            onClick={handleShowOffcanvas}
          >
            <i className="fa fa-bars"></i>
          </a>
          <div
            style={{
              display: 'flex',
              color: 'black',
              fontSize: '25px',
              height: '64px',
              alignItems: 'center',
              paddingLeft: '20px',
            }}
          >
            {language === 'fr' ? 'Gestion des utilisateurs' : 'إدارة المستخدمين'}
          </div>
        </nav>
        {/* Navbar End */}

      <div
        className="container-fluid pt-4 px-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="row g-4 w-100 justify-content-center align-items-stretch"
          style={{ maxWidth: '1200px' }}
        >
          
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              {/* Search Bar and Add User Button */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder={
                    language === 'fr'
                      ? 'Rechercher...'
                      : 'ابحث هنا...'
                  }
                  style={{ width: '250px' }} // Adjust width
                />
                <Button
                  variant="primary"
                  onClick={() => setShowAddUserModal(true)}
                >
                  {language === 'fr' ? 'Ajouter un nouveau utilisateur' : 'إضافة مستخدم جديد'}
                </Button>
              </div>

              {/* Users Table */}
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>
                        {language === 'fr' ? 'Utilisateur depuis' : 'المستخدم منذ'}
                      </Th>
                      <Th>
                        {language === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
                      </Th>
                      <Th>
                        {language === 'fr' ? 'Adresse email' : 'البريد الإلكتروني'}
                      </Th>
                      
                      <Th>
                        {language === 'fr' ? 'Liste des fermes' : 'قائمة المزارع'}
                      </Th>
                      <Th>
                        {language === 'fr' ? 'Rôle' : 'الدور'}
                      </Th>
                      <Th>
                        {language === 'fr' ? 'Actions' : 'الإجراءات'}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[
                      { id: '001', usersince: '27/12/2024', fullName: 'Test User 1', email: 'test1@mail.com', farms: 'ouled hedaj(oran),jsp wch nsemi hadi(alger),ouled hedaj(oran),jsp wch nsemi hadi(alger)', role: 'admin' },
                      { id: '002', usersince: '27/12/2024', fullName: 'Test User 2', email: 'test2@mail.com', farms: 'ouled hedaj(oran),jsp wch nsemi hadi(alger)', role: 'utilisateur' },
                      { id: '003', usersince: '27/12/2024', fullName: 'Test User 3', email: 'test3@mail.com', farms: 'ouled hedaj(oran),jsp wch nsemi hadi(alger),ouled hedaj(oran),jsp wch nsemi hadi(alger),jsp wch nsemi hadi(alger)', role: 'admin' }
                    ].map((user) => (
                      <UserRow
                        key={user.id}
                        id={user.id}
                        usersince={user.usersince}
                        fullName={user.fullName}
                        email={user.email}
                        farms={user.farms}
                        role={user.role}
                        onEdit={() => console.log(`Edit ${user.fullName}`)}
                        onDelete={() => console.log(`Delete ${user.fullName}`)}
                      />
                    ))}
                  </Tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Offcanvas Start */}
      <Offcanvas
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          className="custom-offcanvas"
        >
          <Offcanvas.Header closeButton className="d-flex justify-content-end" />
          <Offcanvas.Body>
            <Sidebar />
          </Offcanvas.Body>
        </Offcanvas>
        {/* Offcanvas End */}
      </div>
      {/* Add User Modal */}
      <Modal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {language === 'fr' ? 'Ajouter un utilisateur' : 'إضافة مستخدم'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Name Section */}
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>{language === 'fr' ? 'Nom complet' : 'الاسم الكامل'}</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder={language === 'fr' ? 'Entrez le nom complet' : 'أدخل الاسم الكامل'}
                value={newUser.fullName}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Email Section */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>{language === 'fr' ? 'Adresse email' : 'البريد الإلكتروني'}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={language === 'fr' ? 'Entrez l\'adresse email' : 'أدخل البريد الإلكتروني'}
                value={newUser.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Password Section */}
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{language === 'fr' ? 'Mot de passe' : 'كلمة المرور'}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={language === 'fr' ? 'Entrez le mot de passe' : 'أدخل كلمة المرور'}
                value={newUser.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* role Section */}
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>{language === 'fr' ? 'Selectioner le role' : 'حدد الدور'}</Form.Label>
              <Form.Select  aria-label="select role">
              <option>{language === 'fr' ? 'Admin/Utilisateur' : 'مستخدم/مسؤول'}</option>
              <option value="1">{language === 'fr' ? 'Utilisateur' : 'مستخدم'}</option>
              <option value="2">{language === 'fr' ? 'Admin' : 'مسؤول'}</option>
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
