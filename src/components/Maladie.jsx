import { useState } from 'react';
import infoicone from '../imgtest/help-question-1-circle-faq-frame-help-info-mark-more-query-ques.svg';
import Recommendationsicone from '../imgtest/group-2572.png';

import '@fortawesome/fontawesome-free/css/all.min.css'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useLanguage } from '../LanguageContext';



function Maladie({ name, risk, info, recommendation }) {
  const { language } = useLanguage();
  // State to manage the info modal visibility
  const [showInfo, setShowInfo] = useState(false);
  const handleCloseInfo = () => setShowInfo(false);
  const handleShowInfo = () => setShowInfo(true);

  // State to manage the recommendations modal visibility
  const [showRecommendations, setShowRecommendations] = useState(false);
  const handleCloseRecommendations = () => setShowRecommendations(false);
  const handleShowRecommendations = () => setShowRecommendations(true);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          {name} {/* Disease name as a prop */}
          <img
            src={infoicone}
            className="ms-2"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            onClick={handleShowInfo}
            alt="Info"
          />
        </div>
        <div>
          Risques : {risk}% {/* Risk percentage as a prop */}
          <img
            src={Recommendationsicone}
            className="ms-2"
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            onClick={handleShowRecommendations}
            alt="Recommendations"
          />
        </div>
      </div>

      <Modal show={showInfo} onHide={handleCloseInfo}>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{info}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfo}>
            {language === 'fr' ? 'Fermer' : 'غلق'}
          </Button>
        </Modal.Footer>
      </Modal>  

      {/* Info Modal */}
      <Modal show={showRecommendations} onHide={handleCloseRecommendations}>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'fr' ? 'Recommandations' : 'توصيات'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="recommendations">{Array.isArray(recommendation) && recommendation.map((rec, index) => (
          <p key={index}>{rec}</p>
        ))}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRecommendations}>
            {language === 'fr' ? 'Fermer' : 'غلق'}
          </Button>
        </Modal.Footer>
      </Modal> 
    </>
  );
}

export default Maladie;
