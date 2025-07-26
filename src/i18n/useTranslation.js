import { useLanguage } from '../LanguageContext';
import { getTranslation } from './translations';

/**
 * Custom hook for accessing translations
 * Usage: const t = useTranslation();
 * Then: t('signIn') or t('farmName')
 */
export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key, fallback = null) => {
    const translation = getTranslation(key, language);
    return translation !== key ? translation : (fallback || key);
  };
  
  return t;
};

export default useTranslation;
