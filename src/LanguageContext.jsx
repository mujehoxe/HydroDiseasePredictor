import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const LanguageContext = createContext();

// Create a Provider Component
export const LanguageProvider = ({ children }) => {
  // Check sessionStorage for saved language or default to French ('fr')
  const [language, setLanguage] = useState(sessionStorage.getItem('appLanguage') || 'fr');

  const toggleLanguage = () => {
    const newLanguage = language === 'fr' ? 'ar' : 'fr';
    setLanguage(newLanguage);
    sessionStorage.setItem('appLanguage', newLanguage); // Save the new language to sessionStorage
  };

  useEffect(() => {
    // Update the language from sessionStorage when the component mounts
    const savedLanguage = sessionStorage.getItem('appLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the LanguageContext
export const useLanguage = () => useContext(LanguageContext);
