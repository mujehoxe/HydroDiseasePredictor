import React, { useState } from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function Ajoutferme() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // Define state variables for form fields
  const [farmName, setFarmName] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [farmCity, setFarmCity] = useState('');
  
  const handleAjout = async () => {
 // Construct the farm data object
 const farmData = {
  user: 'farmer1',  // Temporary user ID/name
  name: farmName,
  location: farmAddress,  // Assuming this is address/GPS
  additionalInfo: {
    City: farmCity
  }
};

// Send the data to the backend
try {
  const response = await fetch('https://vite-project-9cea.onrender.com/api/v1/farms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(farmData)
  });
  if (response.ok) {
    navigate('/Tableaudebord'); // Redirect on successful submission
  } else {
    console.error('Failed to add farm');
  }
} catch (error) {
  console.error('Error:', error);
}
};

  return (
    <div className="container-fluid">
      <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-sm-12 col-xl-6">
          <div className="bg-light rounded h-100 p-4">
            <h6 className="mb-4">{language === 'fr' ? 'Ajouter une ferme' : 'أضف مزرعة'}</h6>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmName" placeholder={language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'} 
              value={farmName} onChange={(e) => setFarmName(e.target.value)} 
              />
              <label htmlFor="farmName">{language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmAddress" placeholder={language === 'fr' ? 'Adresse de la ferme' : 'عنوان المزرعة'} 
              value={farmAddress} onChange={(e) => setFarmAddress(e.target.value)} 
              />
              <label htmlFor="farmAddress">{language === 'fr' ? 'Adresse de la ferme' : 'عنوان المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmCity" placeholder={language === 'fr' ? 'Wilaya' : 'معلومات المزرعة'}
              value={farmCity} onChange={(e) => setFarmCity(e.target.value)} 
              />
              <label htmlFor="farmCity">{language === 'fr' ? 'Wilaya' : 'معلومات المزرعة'}</label>
            </div>

            <div className="text-end">
              <button onClick={handleAjout} className="btn btn-primary">{language === 'fr' ? 'Ajouter la ferme' : 'أضف المزرعة'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ajoutferme;
