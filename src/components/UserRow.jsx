import React, { useState } from 'react';
import { Table, Tr, Td } from 'react-super-responsive-table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useLanguage } from '../LanguageContext';

function UserRow({ id, usersince, fullName, email, farms, role, onEdit, onDelete }) {
  const { language } = useLanguage();
  const [showEdit, setShowEdit] = useState(false);
  const [activeFarmAccordion, setActiveFarmAccordion] = useState(null);
  const [showAddFarm, setShowAddFarm] = useState(false);

  const [showFarmsModal, setShowFarmsModal] = useState(false);
  const [selectedFarms, setSelectedFarms] = useState([]);
  
  const toggleFarmAccordion = (farmIndex) => {
    setActiveFarmAccordion((prevIndex) => (prevIndex === farmIndex ? null : farmIndex));
  };
  const handleAddFarm = () => {
    console.log('New farm added');
    // Add farm logic here
  
    setShowAddFarm(false);
  };

  const handleShowFarms = (farms) => {
    setSelectedFarms(farms);
    setShowFarmsModal(true);
  };

  return (
    <Tr>
      <Td>{id}</Td>
      <Td>{usersince}</Td>
      <Td>{fullName}</Td>
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
                  placeholder={language === 'fr' ? 'Nouveau Nom' : 'الاسم الجديد'}
                />
              </Form.Group>

              {/* Change Email Section */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>{language === 'fr' ? "Changer l'adresse mail" : 'تغيير عنوان البريد الإلكتروني'}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder={
                    language === 'fr' ? 'Nouvelle adresse mail' : 'عنوان البريد الإلكتروني الجديد'
                  }
                />
              </Form.Group>

              {/* Change Password Section */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>{language === 'fr' ? 'Changer le mot de passe' : 'تغيير كلمة السر'}</Form.Label>
                  <Form.Control
                    type="text"
                    name="password"
                    placeholder={
                      language === 'fr' ? 'Nouveau mot de passe' : 'كلمة السر الجديدة'
                    }
                  />
              </Form.Group>

              {/* role Section */}
              <Form.Group className="mb-3" controlId="role">
                <Form.Label>{language === 'fr' ? 'Changer le role' : 'حدد الدور'}</Form.Label>
                <Form.Select  aria-label="select role">
                <option>{language === 'fr' ? 'Admin/Utilisateur' : 'مستخدم/مسؤول'}</option>
                <option value="1">{language === 'fr' ? 'Utilisateur' : 'مستخدم'}</option>
                <option value="2">{language === 'fr' ? 'Admin' : 'مسؤول'}</option>
              </Form.Select>
              </Form.Group>

              {/* Edit Farms Section */}
              <Form.Group className="mb-3" controlId="editFarm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label>{language === 'fr' ? 'Editer les fermes' : 'تعديل المزارع'}</Form.Label>
                  <Button variant="primary" size="sm" onClick={() => setShowAddFarm(true)}>
                    {language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'}
                  </Button>
                </div>
                
                  {["Farm 1", "Farm 2", "Farm 3"].map((farmName, index) => (
                    <Card className="mb-3" key={index}>
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>{farmName}</span>
                        <div>
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={() => toggleFarmAccordion(index)}
                          >
                            {language === 'fr' ? 'Editer' : 'تعديل'}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => console.log(`Delete ${farmName}`)}
                          >
                            {language === 'fr' ? 'Supprimer' : 'حذف'}
                          </Button>
                          

                        </div>
                      </Card.Header>
                      <Accordion activeKey={activeFarmAccordion === index ? '0' : null}>
                        <Card>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>
                              <Form.Control
                                type="text"
                                placeholder={
                                  language === 'fr'
                                    ? 'Nouveau nom de la ferme'
                                    : 'الاسم الجديد للمزرعة'
                                }
                              />
                              <Form.Select className="mt-3" aria-label="Default select example">
                                <option>{language === 'fr' ? 'Wilaya/Région' : 'الولاية/المنطقة'}</option>
                                <option value="1">Alger</option>
                                <option value="2">Oran</option>
                                <option value="3">Setef</option>
                              </Form.Select>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Card>
                  ))}
                  
                
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

        <Modal show={showFarmsModal} onHide={() => setShowFarmsModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{language === 'fr' ? 'Fermes' : 'المزارع'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <ul>
            {(farms || '') // Ensure farms is a string
              .split(',')
              .map((farm) => farm.trim())
              .filter((farm) => farm) // Remove empty entries
              .map((farm, index) => (
                <li key={index}>{farm}</li>
              ))}
          </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFarmsModal(false)}>
              {language === 'fr' ? 'Fermer' : 'إغلاق'}
            </Button>
          </Modal.Footer>
        </Modal>


        <Button variant="danger" style={{ marginRight: '5px' }} onClick={() => onDelete(id)}>
          {language === 'fr' ? 'Supprimer' : 'حذف'}
        </Button>
        <Button variant="primary" >
          {language === 'fr' ? 'Connecter API' : 'ربط API'}
        </Button>
      </Td>
    </Tr>
  );
}

export default UserRow;
