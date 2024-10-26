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
  const [farmInfo1, setFarmInfo1] = useState('');
  const [farmInfo2, setFarmInfo2] = useState('');
  const [farmInfo3, setFarmInfo3] = useState('');
  
  const handleAjout = async () => {
 // Construct the farm data object
 const farmData = {
  user: 'farmer1',  // Temporary user ID/name
  name: farmName,
  location: farmAddress,  // Assuming this is address/GPS
  additionalInfo: {
    info1: farmInfo1,
    info2: farmInfo2,
    info3: farmInfo3
  }
};

// Send the data to the backend
try {
  const response = await fetch('/api/farms', {
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
            <h6 className="mb-4">{language === 'fr' ? 'Ajouter Une ferme' : 'أضف مزرعة'}</h6>

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
              <input type="text" className="form-control" id="farmInfo1" placeholder={language === 'fr' ? 'Informations sur la ferme' : 'معلومات المزرعة'}
              value={farmInfo1} onChange={(e) => setFarmInfo1(e.target.value)} 
              />
              <label htmlFor="farmInfo1">{language === 'fr' ? 'Informations sur la ferme' : 'معلومات المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo2" placeholder={language === 'fr' ? 'Informations supplémentaires sur la ferme' : 'معلومات المزرعة الإضافية'}
              value={farmInfo2} onChange={(e) => setFarmInfo2(e.target.value)} 
              />
              <label htmlFor="farmInfo2">{language === 'fr' ? 'Informations supplémentaires sur la ferme' : 'معلومات إضافية عن المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo3" placeholder={language === 'fr' ? 'Autres informations sur la ferme' : 'معلومات اخرى عن المزرعة'}
              value={farmInfo3} onChange={(e) => setFarmInfo3(e.target.value)}
               />
              <label htmlFor="farmInfo3">{language === 'fr' ? 'Autres informations sur la ferme' : 'معلومات اخرى عن المزرعة'}</label>
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
