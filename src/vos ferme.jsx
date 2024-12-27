import React, { useEffect, useState } from 'react';
import plusicon from './icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png';
import deleteIcon from './icone/icons8-delete-24.png';
import editIcon from './icone/icons8-edit-50.png';
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function VosFermes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve userId and authToken from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('authToken');

    if (!user || !user.id || !token) {
      // Redirect to login if userId or token is missing
      navigate('/login');
      return;
    }

    const userId = user.id;

    // Fetch the user's farms from the API
    const fetchFarms = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://vite-project-9cea.onrender.com/api/v1/users/${userId}/farms`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFarms(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || (language === 'fr' ? 'Échec de la récupération des fermes.' : 'فشل في استرداد المزارع.'));
        }
      } catch (error) {
        console.error('Error fetching farms:', error);
        setError(language === 'fr' ? 'Une erreur s’est produite.' : 'حدث خطأ.');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [navigate, language]);

  const handleFarmClick = (farm) => {
    navigate('/Tableaudebord', { state: { name: farm.name, address: farm.address } });
  };

  const handleDelete = async (farmId) => {
    const confirmDelete = window.confirm(
      language === 'fr'
        ? 'Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible.'
        : 'هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه.'
    );

    if (!confirmDelete) return;

    const token = sessionStorage.getItem('authToken');
    try {
      const response = await fetch(`https://vite-project-9cea.onrender.com/api/v1/farms/${farmId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFarms((prevFarms) => prevFarms.filter((farm) => farm.id !== farmId));
      } else {
        console.error('Failed to delete farm:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  const handleEdit = (farm) => {
    navigate('/Ajoutferme', { state: { farm, isEdit: true } });
  };

  const handleAjout = () => {
    navigate('/Ajoutferme', { state: { isEdit: false } });
  };

  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div
        className="container-fluid pt-4 px-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="row g-4 w-100 justify-content-center align-items-stretch" style={{ maxWidth: '1200px' }}>
          <div className="col-12 col-md-6 d-flex">
            <div className="bg-light rounded p-4 my-4 mx-3 w-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3>{language === 'fr' ? 'Vos Fermes' : 'مزارعك'}</h3>
              </div>
              <div className="text-center">
                {loading ? (
                  <p>{language === 'fr' ? 'Chargement...' : 'جار التحميل...'}</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : farms.length > 0 ? (
                  farms.map((farm) => (
                    <div key={farm.id} className="mb-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleFarmClick(farm)}
                      >
                        {farm.name}
                      </button>
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="ms-2"
                        style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                        onClick={() => handleEdit(farm)}
                      />
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="ms-2"
                        style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                        onClick={() => handleDelete(farm.id)}
                      />
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
