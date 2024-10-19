import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import SignIn from './signin';
import SignUp from './signup';
import Ajoutferme from './Ajouter-une-ferme';
import VosFermes from './vos ferme';
import Tableaudebord from './Tableau de Bord Boumerdas';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ajoutferme" element={<Ajoutferme />} />
          <Route path="/vosfermes" element={<VosFermes />} />
          <Route path="/tableaudebord" element={<Tableaudebord />} />
        </Routes>
      </Router>
    </LanguageProvider>
  </StrictMode>
);
