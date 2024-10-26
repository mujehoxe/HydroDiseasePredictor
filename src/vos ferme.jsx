import React from 'react';
import plusicon from './icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png';
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function VosFermes() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleferme1 = () => {
    // Add your authentication logic here
    navigate('/Tableaudebord'); // Redirect to the VosFermes page
  };
  const handleAjout = () => {
    // Add your authentication logic here
    navigate('/Ajoutferme'); // Redirect to the VosFermes page
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      {/* "Vos Fermes" and "Recommendations" Start */}
      <div
        className="container-fluid pt-4 px-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="row g-4 w-100 justify-content-center align-items-stretch" style={{ maxWidth: '1200px' }}>
          {/* Vos Fermes Box */}
          <div className="col-12 col-md-6 d-flex">
            <div className="bg-light rounded p-4 my-4 mx-3 w-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3>{language === 'fr' ? 'Vos Fermes' : 'مزارعك'}</h3>
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <a onClick={handleferme1} className="btn btn-primary">
                    Boumerdes 1
                  </a>
                </div>
                <div className="mb-3">
                  <button type="button" className="btn btn-primary">
                    Boumerdes 2
                  </button>
                </div>
              </div>
              <div onClick={handleAjout} className="text-center mt-4" style={{ cursor: 'pointer' }}>
                 {language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'} 
                <img
                  id="plusIcon"
                  src={plusicon}
                  alt="Plus icon"
                  className="ms-2"
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  
                />
              </div>
            </div>
          </div>

          {/* Recommendations Box */}
          <div className="col-12 col-md-6 d-flex">
            <div className="bg-light rounded p-4 my-4 mx-3 w-100">
              <h3>{language === 'fr' ? 'Résumé des recommendations' : 'ملخص التوصيات'}</h3>
              <div className="recommendations-content">
                <h6>Boumerdes 1 :</h6>
                <p>Contenu des recommendations ici.</p>
                <h6>Boumerdes 2 :</h6>
                <p>Pas de recommendations disponible pour l'instant.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* "Vos Fermes" and "Recommendations" End */}
    </div>
  );
};

export default VosFermes;
