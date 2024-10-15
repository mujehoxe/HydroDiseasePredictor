import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
import logo from './imgtest/logo-tc-advisor 1.png';


function SignIn() {
  return (
  <div className="container-xxl position-relative bg-white d-flex p-0">  
    <div className="container-fluid">
      <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <img src={logo} alt="Logo" style={{ height: '60px' }} /> 
              <h3>Connexion</h3>
            </div>

            <div className="form-floating mb-3" >
              <input type="text" className="form-control"  id="email" placeholder="Adress mail" />
              <label htmlFor="email">Adresse mail</label>
            </div>

            <div className="form-floating mb-4">
              <input type="text" className="form-control" id="password" placeholder="Mot de passe" />
              <label htmlFor="password">Mot de passe</label>
            </div>

            <button type="submit" className="btn btn-primary py-3 w-100 mb-4">Se connecter</button>
            <p className="text-center mb-0">Vous n'avez pas de compte ? <a href="/signup">S'inscrire</a></p>
            </div>
          <div ><a className="d-flex justify-content-center" style={{ fontSize: '16px', cursor: 'pointer' }}>العربية</a></div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default SignIn;
