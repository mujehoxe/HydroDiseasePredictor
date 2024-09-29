import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import for routing
//import SignUp from './signup';  // The sign-up page
import SignIn from './signin'
import './index.css'
import SignUp from './signup'
import Ajoutferme from './Ajouter-une-ferme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Ajoutferme/>
  </StrictMode>,
)