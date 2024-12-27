import React, { useEffect, useState } from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function Ajoutferme() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Determine if this is an edit or add operation
  const isEdit = state?.isEdit || false;
  const farmToEdit = state?.farm || {};

  // State variables for form fields
  const [farmName, setFarmName] = useState(farmToEdit.name || '');
  const [farmCity, setFarmCity] = useState(farmToEdit.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const algerianCities = [
    'Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tlemcen',
    'Setif', 'Batna', 'Bejaia', 'Tizi Ouzou', 'Djelfa',
  ];

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError(language === 'fr' ? 'Utilisateur non authentifié.' : 'المستخدم غير مصدق عليه.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const farmData = {
        name: farmName,
        address: farmCity,
      };

      const url = isEdit
        ? `https://vite-project-9cea.onrender.com/api/v1/farms/${farmToEdit.id}`
        : 'https://vite-project-9cea.onrender.com/api/v1/farms';

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmData),
      });

      if (response.ok) {
        navigate('/Tableaudebord', { state: { name: farm.name, address: farm.address } });
      } else {
        const responseText = await response.text();
        console.error('Server response:', responseText);
        setError(responseText);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(language === 'fr' ? 'Erreur de connexion au serveur.' : 'خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-sm-12 col-xl-6">
          <div className="bg-light rounded h-100 p-4">
            <h6 className="mb-4">
              {isEdit
                ? language === 'fr' ? 'Modifier une ferme' : 'تعديل مزرعة'
                : language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'}
            </h6>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="farmName"
                placeholder={language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'}
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
              <label htmlFor="farmName">{language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="farmCity"
                value={farmCity}
                onChange={(e) => setFarmCity(e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Sélectionner une ville' : 'اختر ولاية'}</option>
                {algerianCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <label htmlFor="farmCity">{language === 'fr' ? 'Wilaya' : 'الولاية'}</label>
            </div>

            <div className="text-end">
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? language === 'fr' ? 'Chargement...' : 'جار التحميل...'
                  : isEdit
                  ? language === 'fr' ? 'Modifier la ferme' : 'تعديل المزرعة'
                  : language === 'fr' ? 'Ajouter la ferme' : 'أضف المزرعة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ajoutferme;
