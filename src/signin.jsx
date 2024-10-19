import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor 1.png';
import { useLanguage } from './LanguageContext';

function SignIn() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your authentication logic here
    navigate('/vosfermes'); // Redirect to the VosFermes page
  };

  return (
  <div className="container-xxl position-relative bg-white d-flex p-0">  
    <div className="container-fluid">
      <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <img src={logo} alt="Logo" style={{ height: '60px' }} /> 
              <h3>{language === 'fr' ? 'Connexion' : 'تسجيل الدخول'}</h3>
            </div>

            <div className="form-floating mb-3" >
              <input type="text" className="form-control"  id="email" placeholder={language === 'fr' ? 'Adresse mail' : 'البريد الإلكتروني'} />
              <label htmlFor="email">{language === 'fr' ? 'Adresse mail' : 'البريد الإلكتروني'}</label>
            </div>

            <div className="form-floating mb-4">
              <input type="text" className="form-control" id="password" placeholder={language === 'fr' ? 'Mot de passe' : 'كلمة السر'} />
              <label htmlFor="password">{language === 'fr' ? 'Mot de passe' : 'كلمة السر'}</label>
            </div>

            <button onClick={handleLogin} className="btn btn-primary py-3 w-100 mb-4">{language === 'fr' ? 'Se connecter' : 'تسجيل الدخول'}</button>
            <p className="text-center mb-0">{language === 'fr' ? "Vous n'avez pas de compte ?" : ' ليس لديك حساب؟'} <a href="/signup">{language === 'fr' ? " S'inscrire" : 'إنشاء حساب '}</a></p>
            </div>
          <div className="d-flex justify-content-center"><a onClick={toggleLanguage} className="text-black fw-bold text-decoration-underline" style={{ fontSize: '16px', cursor: 'pointer' }}>{language === 'fr' ? 'العربية' : 'Français'}</a></div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default SignIn;
