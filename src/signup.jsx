import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';
    

function SignUp() {
    return (
    <div className="container-xxl position-relative bg-white d-flex p-0">
        <div className="container-fluid">
            <div className="row h-100 align-items-center justify-content-center" style={{ minHeight: '100vh' }} >
                <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                    <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h3><img src="imgtest/logo-tc-advisor - Copie.png" style={{ height: '60px' }}/></h3>
                            <h3>Sign Up</h3>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingText" placeholder="jhondoe"/>
                            <label for="floatingText">Nom & Prenom</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                            <label for="floatingInput">Address mail</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                            <label for="floatingInput">Numéro de téléphone</label>
                        </div>
                        <div className="form-floating mb-4">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                            <label for="floatingPassword">Mot de passe</label>
                        </div>
                        <a href="Ajouter-une-ferme.html" type="submit" className="btn btn-primary py-3 w-100 mb-4">Créer un compte</a>
                        <p className="text-center mb-0">Vous avez déjà un compte ? <a href="signin.html">Se connecter</a></p>
                    </div>
                    <div className="d-flex justify-content-center"><h1 className="text-black fw-bold text-decoration-underline" style="font-size: 16px; cursor: pointer;">العربية</h1></div>
                </div>
            </div>
        </div>
    </div>
);
}

export default SignUp;
