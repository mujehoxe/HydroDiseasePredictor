import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor 1.png';



function SignUp() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  const handleLogin = () => {
    // Add your authentication logic here
    navigate('/Ajoutferme'); // Redirect to the VosFermes page
  };
  
  
  return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
      <div className="container-fluid">
        <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <img src={logo} alt="Logo" style={{ height: '60px' }} />
                <h3>{language === 'fr' ? " S'inscrire" : 'إنشاء حساب '}</h3>
              </div>

              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" placeholder={language === 'fr' ? "Nom & Prénom" :'الاسم و اللقب'} />
                <label htmlFor="name">{language === 'fr' ? "Nom & Prénom" :'الاسم و اللقب'}</label>
              </div>
              
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="email" placeholder={language === 'fr' ? "Adresse mail" :'البريد الإلكتروني'} />
                <label htmlFor="email">{language === 'fr' ? "Adresse mail" :'البريد الإلكتروني'}</label>
              </div>
              
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="phone" placeholder={language === 'fr' ? "Numéro de téléphone" :'رقم الهاتف المحمول'} />
                <label htmlFor="phone">{language === 'fr' ? "Numéro de téléphone" :'رقم الهاتف المحمول'}</label>
              </div>
              
              <div className="form-floating mb-4">
                <input type="password" className="form-control" id="password" placeholder={language === 'fr' ? 'Mot de passe' :'كلمة السر'} />
                <label htmlFor="password">{language === 'fr' ? 'Mot de passe' :'كلمة السر'}</label>
              </div>
              
              <button onClick={handleLogin} className="btn btn-primary py-3 w-100 mb-4">{language === 'fr' ? " S'inscrire" : 'إنشاء حساب '}</button>
              <p className="text-center mb-0">{language === 'fr' ? 'Vous avez déjà un compte ?' : ' لديك حساب؟'} <a href="/">{language === 'fr' ? ' Se connecter' : 'تسجيل الدخول '}</a></p>
            </div>
            <div className="d-flex justify-content-center">
              <a onClick={toggleLanguage} className="text-black fw-bold text-decoration-underline" style={{ fontSize: '16px', cursor: 'pointer' }}>{language === 'fr' ? 'العربية' : 'Français'}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
