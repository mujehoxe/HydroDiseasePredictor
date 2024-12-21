import React, { useEffect, useState } from 'react';
import plusicon from './icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png';
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function VosFermes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const userId = 1; // Replace with dynamic user ID after login

  useEffect(() => {
    // Fetch the user's farms from the API
    const fetchFarms = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve the auth token
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://vite-project-9cea.onrender.com/api/v1/users/${userId}/farms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the auth token here
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFarms(data);
        } else {
          console.error('Failed to fetch farms:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };

    fetchFarms();
  }, [1]);

  const handleFarmClick = (farm) => {
    // Pass the farm's name and address as props to the dashboard
    navigate('/Tableaudebord', { state: { name: farm.name, address: farm.address } });
  };

  const handleAjout = () => {
    navigate('/Ajoutferme');
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
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
                {farms.length > 0 ? (
                  farms.map((farm) => (
                    <div key={farm.id} className="mb-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleFarmClick(farm)}
                      >
                        {farm.name}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>{language === 'fr' ? 'Aucune ferme trouvée.' : 'لم يتم العثور على أي مزرعة.'}</p>
                )}
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
                {farms.map((farm) => (
                  <div key={farm.id}>
                    <h6>{farm.name} :</h6>
                    <p>{language === 'fr' ? 'Pas de recommendations disponible pour l\'instant.' : 'لا توجد توصيات متاحة حاليًا.'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VosFermes;
