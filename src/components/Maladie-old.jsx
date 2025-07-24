import { useState } from 'react';
import { InformationCircleIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

  const noRecommendationText = language === 'fr' 
  ? 'Pas de recommandations pour le moment' 
  : 'لا توجد توصيات في الوقت الحالي';

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
        Risque : {risk}% {/* Risk percentage as a prop */}
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
        <Modal.Body className="recommendations" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>{Array.isArray(recommendation) && recommendation.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recommendation.map((rec, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p>{noRecommendationText}</p>
          )}
            </Modal.Body>
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
