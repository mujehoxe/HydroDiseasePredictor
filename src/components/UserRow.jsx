import React, { useState } from 'react';
import { Table, Tr, Td } from 'react-super-responsive-table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useLanguage } from '../LanguageContext';

function UserRow({ id, usersince, fullName, email, password, farms, role, onEdit, onDelete }) {
  const { language } = useLanguage();
  const [showEdit, setShowEdit] = useState(false);
  const [activeFarmAccordion, setActiveFarmAccordion] = useState(null);
  const [showAddFarm, setShowAddFarm] = useState(false); 
  const toggleFarmAccordion = (farmIndex) => {
    setActiveFarmAccordion((prevIndex) => (prevIndex === farmIndex ? null : farmIndex));
  };
  const handleAddFarm = () => {
    console.log('New farm added');
    // Add farm logic here
  
    setShowAddFarm(false);
  };

  return (
    <Tr>
      <Td>{id}</Td>
      <Td>{usersince}</Td>
      <Td>{fullName}</Td>
      <Td>{email}</Td>
      <Td>{password}</Td>
      <Td>{farms}</Td>
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
            <Accordion defaultActiveKey={['0']} alwaysOpen>
              {/* Change Name Section */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  {language === 'fr' ? 'Changer le Nom' : 'تغيير الاسم'}
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Control
                    type="text"
                    placeholder={language === 'fr' ? 'Nouveau Nom' : 'الاسم الجديد'}
                  />
                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="success">
                      {language === 'fr' ? 'Sauvegarder' : 'حفظ'}
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Change Email Section */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  {language === 'fr' ? "Changer l'adresse mail" : 'تغيير عنوان البريد الإلكتروني'}
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Control
                    type="text"
                    placeholder={
                      language === 'fr' ? 'Nouvelle adresse mail' : 'عنوان البريد الإلكتروني الجديد'
                    }
                  />
                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="success">
                      {language === 'fr' ? 'Sauvegarder' : 'حفظ'}
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Change Password Section */}
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  {language === 'fr' ? 'Changer le mot de passe' : 'تغيير كلمة السر'}
                </Accordion.Header>
                <Accordion.Body>
                  <Form.Control
                    type="text"
                    placeholder={
                      language === 'fr' ? 'Nouveau mot de passe' : 'كلمة السر الجديدة'
                    }
                  />
                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="success">
                      {language === 'fr' ? 'Sauvegarder' : 'حفظ'}
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Edit Farms Section */}
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  {language === 'fr' ? 'Editer les fermes' : 'تعديل المزارع'}
                </Accordion.Header>
                <Accordion.Body>
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
                              <div className="d-flex justify-content-end mt-3">
                                <Button variant="success">
                                  {language === 'fr' ? 'Sauvegarder' : 'حفظ'}
                                </Button>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Card>
                  ))}
                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" onClick={() => setShowAddFarm(true)}>
                      {language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'}
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Modal.Body>
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


        <Button variant="danger" onClick={() => onDelete(id)}>
          {language === 'fr' ? 'Supprimer' : 'حذف'}
        </Button>
      </Td>
    </Tr>
  );
}

export default UserRow;
