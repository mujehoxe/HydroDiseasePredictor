import React, { useState } from 'react';
import { Table, Tr, Td } from 'react-super-responsive-table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useLanguage } from '../LanguageContext';
import FarmsList from './farmsList';
import AddUserModal from './AddUserModal';


function UserRow({ user, id, name, email, farms, role, password, onEdit, onDelete }) {
  const { language } = useLanguage();
  const [showFarmsModal, setShowFarmsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
          onClick={() => setShowEditModal(true)}
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

        {/* Add and Edit Modal */}
        {showEditModal && (
        <AddUserModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          userToEdit={user}
          isEdit={true}
        />
      )}

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