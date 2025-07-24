import { useState } from 'react';
import { InformationCircleIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../LanguageContext';

function Maladie({ name, risk, info, recommendation }) {
  const { language } = useLanguage();
  
  // State to manage the info modal visibility
  const [showInfo, setShowInfo] = useState(false);
  const handleCloseInfo = () => setShowInfo(false);
  const handleShowInfo = () => setShowInfo(true);

  // State to manage the recommendations modal visibility
  const [showRecommendations, setShowRecommendations] = useState(false);
  const handleCloseRecommendations = () => setShowRecommendations(false);
  const handleShowRecommendations = () => setShowRecommendations(true);

  const noRecommendationText = language === 'fr' 
    ? 'Pas de recommandations pour le moment' 
    : 'لا توجد توصيات في الوقت الحالي';

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <span className="text-gray-900 font-medium">{name}</span>
          <InformationCircleIcon
            className="ml-2 w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleShowInfo}
          />
        </div>
        <div className="flex items-center">
          <span className="text-gray-700">
            {language === 'fr' ? 'Risque : ' : 'خطر : '}{risk}%
          </span>
          <ShieldCheckIcon
            className="ml-2 w-5 h-5 text-green-500 cursor-pointer hover:text-green-700 transition-colors"
            onClick={handleShowRecommendations}
          />
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <XMarkIcon
                className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={handleCloseInfo}
              />
            </div>
            <div className="mb-6">
              <p className="text-gray-700">{info}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseInfo}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                {language === 'fr' ? 'Fermer' : 'غلق'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Modal */}
      {showRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'fr' ? 'Recommandations' : 'توصيات'}
              </h3>
              <XMarkIcon
                className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={handleCloseRecommendations}
              />
            </div>
            <div className="mb-6" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
              {Array.isArray(recommendation) && recommendation.length > 0 ? (
                <ul className="space-y-2">
                  {recommendation.map((rec, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">{noRecommendationText}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseRecommendations}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                {language === 'fr' ? 'Fermer' : 'غلق'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Maladie;
