import React, { useEffect, useState } from 'react';
import plusicon from './icone/add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math.png';
import deleteIcon from './icone/icons8-delete-24.png'; // <a target="_blank" href="https://icons8.com/icon/99933/delete">Delete</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import editIcon from './icone/icons8-edit-50.png'; // <a target="_blank" href="https://icons8.com/icon/49/edit">Edit</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function VosFermes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const userId = 1; // Replace with dynamic user ID after login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      }finally{
        setLoading(false);
      }
    };

    fetchFarms();
  }, [1]);

  const handleFarmClick = (farm) => {
    // Pass the farm's name and address as props to the dashboard
    navigate('/Tableaudebord', { state: { name: farm.name, address: farm.address } });
  };

  const handleDelete = async (farmId) => {
    const confirmDelete = window.confirm(
      language === 'fr'
        ? 'Êtes-vous sûr de vouloir supprimer cette ferme ?\nCette action est irréversible.'
        : 'هل أنت متأكد أنك تريد حذف هذه المزرعة؟\nهذا الإجراء لا رجوع فيه.'
    );

    if (!confirmDelete) return;
    const token = localStorage.getItem('authToken'); // Retrieve the auth token

    try {
      const response = await fetch(`https://vite-project-9cea.onrender.com/api/v1/farms/${farmId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the deleted farm from the state
        setFarms((prevFarms) => prevFarms.filter((farm) => farm.id !== farmId));
      } else {
        console.error('Failed to delete farm:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  const handleEdit = (farm) => {
    // Navigate to the edit farm page with pre-filled data
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
                        {farm.name} {/* add the delete and edit buttons here*/}
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
