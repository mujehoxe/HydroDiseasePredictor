import recommendations from "../assets/recommendations";

export function getRecommendation(disease, risk, language = "fr") {
  const diseaseRecommendations = recommendations[disease][language];
  for (const { range, action } of diseaseRecommendations) {
    if (risk >= range[0] && risk < range[1]) {
      return action;
    }
  }
  return null;
}
