import recommendations from "../assets/recommendations";

export function getRecommendation(disease, risk, humidity, dissolvedOxygen, language = "fr") {
  const diseaseRecommendations = recommendations[disease];
  const langRecommendations = diseaseRecommendations[language];
  
  let allRecommendations = [];
  
  // Get risk-based recommendation
  for (const { range, action } of langRecommendations) {
    if (risk >= range[0] && risk < range[1] && action) {
      // If action is already an array, spread it; if it's a string, make it an array item
      allRecommendations = Array.isArray(action) ? [...action] : [action];
      break;
    }
  }

  // Check additional conditions if they exist
  const additionalConditions = diseaseRecommendations.additionalConditions;
  if (additionalConditions) {
    // Add humidity recommendation (except for oidium)
    if (disease !== 'oidium' && 
        additionalConditions.humidity && 
        humidity > additionalConditions.humidity.threshold) {
      allRecommendations.push(additionalConditions.humidity[language]);
    }

    // Add dissolved oxygen recommendation (only for pythium)
    if (disease === 'pythium' && 
        additionalConditions.dissolvedOxygen && 
        dissolvedOxygen < additionalConditions.dissolvedOxygen.threshold) {
      allRecommendations.push(additionalConditions.dissolvedOxygen[language]);
    }
  }

  // Return array of recommendations if there are any, otherwise null
  return allRecommendations.length > 0 ? allRecommendations : null;
}