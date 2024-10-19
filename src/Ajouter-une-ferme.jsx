import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

function Ajoutferme() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleAjout = () => {
    // Add your authentication logic here
    navigate('/Tableaudebord'); // Redirect to the VosFermes page
  };

  return (
    <div className="container-fluid">
      <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-sm-12 col-xl-6">
          <div className="bg-light rounded h-100 p-4">
            <h6 className="mb-4">{language === 'fr' ? 'Ajouter Une ferme' : 'أضف مزرعة'}</h6>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmName" placeholder={language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'} />
              <label htmlFor="farmName">{language === 'fr' ? 'Nom de la ferme' : 'اسم المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmAddress" placeholder={language === 'fr' ? 'Adresse de la ferme' : 'عنوان المزرعة'} />
              <label htmlFor="farmAddress">{language === 'fr' ? 'Adresse de la ferme' : 'عنوان المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo1" placeholder={language === 'fr' ? 'Informations sur la ferme' : 'معلومات المزرعة'}/>
              <label htmlFor="farmInfo1">{language === 'fr' ? 'Informations sur la ferme' : 'معلومات المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo2" placeholder={language === 'fr' ? 'Informations supplémentaires sur la ferme' : 'معلومات المزرعة الإضافية'}/>
              <label htmlFor="farmInfo2">{language === 'fr' ? 'Informations supplémentaires sur la ferme' : 'معلومات إضافية عن المزرعة'}</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="farmInfo3" placeholder={language === 'fr' ? 'Autres informations sur la ferme' : 'معلومات اخرى عن المزرعة'}/>
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
