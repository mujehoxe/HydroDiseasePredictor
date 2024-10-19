import { useState } from 'react';
import infoicone from '../imgtest/help-question-1-circle-faq-frame-help-info-mark-more-query-ques.svg';
import Recommendationsicone from '../imgtest/group-2572.png';

import '@fortawesome/fontawesome-free/css/all.min.css'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



function Maladie({ name, risk }) {
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
          <Modal.Title>Information sur la maladie</Modal.Title>
        </Modal.Header>
        <Modal.Body>Détails sur la maladie ici.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfo}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>  

      {/* Info Modal */}
      <Modal show={showRecommendations} onHide={handleCloseRecommendations}>
        <Modal.Header closeButton>
          <Modal.Title>Recommandations</Modal.Title>
        </Modal.Header>
        <Modal.Body>Recommandations pour cette maladie ici.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRecommendations}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal> 
    </>
  );
}

export default Maladie;
