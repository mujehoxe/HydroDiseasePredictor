import React, { useState } from 'react';
import { Table, Tr, Td } from 'react-super-responsive-table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useLanguage } from '../LanguageContext';
import FarmsList from './farmsList';


function UserRow({ id, name, email, farms, role,password, onEdit, onDelete }) {
  const { language } = useLanguage();
  const [showEdit, setShowEdit] = useState(false);
  const [activeFarmAccordion, setActiveFarmAccordion] = useState(null);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showFarmsModal, setShowFarmsModal] = useState(false);
  const [selectedFarms, setSelectedFarms] = useState([]);
  const token = sessionStorage.getItem('authToken');
  const toggleFarmAccordion = (farmIndex) => {
    setActiveFarmAccordion((prevIndex) => (prevIndex === farmIndex ? null : farmIndex));
  };

  const handleAddFarm = () => {
    console.log('New farm added');
    setShowAddFarm(false);
  };

  const handleShowFarms = (farms) => {
    setSelectedFarms(farms);
    setShowFarmsModal(true);
  };

  return (
    <Tr>
      <Td>{id}</Td>
      <Td>{name}</Td>
      <Td>{email}</Td>
      
      <Td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <Button variant="secondary" size="sm" onClick={() => handleShowFarms(farms)}>
          {language === 'fr' ? 'Voir' : 'عرض'}
        </Button>
      </Td>
      <Td>{role}</Td>
      <Td>
        <Button
          style={{ marginRight: '5px' }}
          variant="primary"
          onClick={() => setShowEdit(true)}
        >
          {language === 'fr' ? 'Editer' : 'تعديل'}
        </Button>

        <Button 
          variant="danger" 
          style={{ marginRight: '5px' }} 
          onClick={() => onDelete(id)}
          >
          {language === 'fr' ? 'Supprimer' : 'حذف'}
        </Button>

        <Button variant="primary">
          {language === 'fr' ? 'Connecter API' : 'ربط API'}
        </Button>

        {/* Edit Modal */}
        <Modal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {language === 'fr' ? 'Modifier les Informations' : 'تعديل المعلومات'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Change Name Section */}
              <Form.Group className="mb-3" controlId="changeName">
                <Form.Label>{language === 'fr' ? 'Changer le Nom' : 'تغيير الاسم'}</Form.Label>
                <Form.Control
                  type="text"
                  name="changeName"
                  value={name}
                  placeholder={language === 'fr' ? 'Nouveau Nom' : 'الاسم الجديد'}
                />
              </Form.Group>

              {/* Change Email Section */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>{language === 'fr' ? "Changer l'adresse mail" : 'تغيير عنوان البريد الإلكتروني'}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  placeholder={language === 'fr' ? 'Nouvelle adresse mail' : 'عنوان البريد الإلكتروني الجديد'}
                />
              </Form.Group>

              {/* Change Password Section */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>{language === 'fr' ? 'Changer le mot de passe' : 'تغيير كلمة السر'}</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={password}
                  placeholder={language === 'fr' ? 'Nouveau mot de passe' : 'كلمة السر الجديدة'}
                />
              </Form.Group>

              {/* Role Section */}
              <Form.Group className="mb-3" controlId="role">
                <Form.Label>{language === 'fr' ? 'Changer le role' : 'حدد الدور'}</Form.Label>
                <Form.Select aria-label="select role" value={role}>
                  <option>{language === 'fr' ? 'Admin/Utilisateur' : 'مستخدم/مسؤول'}</option>
                  <option value="farmer">{language === 'fr' ? 'Utilisateur' : 'مستخدم'}</option>
                  <option value="admin">{language === 'fr' ? 'Admin' : 'مسؤول'}</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              {language === 'fr' ? 'Annuler' : 'إلغاء'}
            </Button>
            <Button variant="success" onClick={() => setShowEdit(false)}>
              {language === 'fr' ? 'Sauvegarder' : 'حفظ'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Farm Modal */}
        <Modal
          show={showAddFarm}
          onHide={() => setShowAddFarm(false)}
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {language === 'fr' ? 'Ajouter une nouvelle ferme' : 'إضافة مزرعة جديدة'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="text"
              placeholder={language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'}
            />
            <Form.Select className="mt-3" aria-label="Select Region">
              <option>{language === 'fr' ? 'Wilaya/Région' : 'الولاية/المنطقة'}</option>
              <option value="1">Alger</option>
              <option value="2">Oran</option>
              <option value="3">Setef</option>
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddFarm(false)}>
              {language === 'fr' ? 'Annuler' : 'إلغاء'}
            </Button>
            <Button variant="success" onClick={handleAddFarm}>
              {language === 'fr' ? 'Ajouter' : 'إضافة'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* View Farms Modal */}
        <Modal show={showFarmsModal} onHide={() => setShowFarmsModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{language === 'fr' ? 'Fermes' : 'المزارع'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FarmsList userId = {id}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFarmsModal(false)}>
              {language === 'fr' ? 'Fermer' : 'إغلاق'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Td>
    </Tr>
  );
}

export default UserRow;