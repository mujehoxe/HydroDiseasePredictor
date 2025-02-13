import React from "react";
import diseaseRiskCalculators from "../js/diseaseRiskCalculator";
import { getRecommendation } from "../js/getRecommendation";
import diseasesDescriptions from "../assets/diseaseDescriptions";
import Maladie from "./Maladie";

const MaladiesList = ({ temperature, humidity, dissolvedOxygen, language }) => {
  const diseases = Object.keys(diseasesDescriptions);

  return (
    <div>
      {diseases.map((diseaseKey, index) => {
        const normalizedKey = diseaseKey.toLowerCase();
        const risk = diseaseRiskCalculators[normalizedKey](temperature, humidity, dissolvedOxygen);
        const recommendations = getRecommendation(normalizedKey, risk, humidity, dissolvedOxygen, language);

        return (
          <div key={normalizedKey}>
            <Maladie
              name={
                language === "fr"
                  ? diseasesDescriptions[normalizedKey].name.fr
                  : diseasesDescriptions[normalizedKey].name.ar
              }
              risk={risk}
              info={
                language === "fr"
                  ? diseasesDescriptions[normalizedKey].description.fr
                  : diseasesDescriptions[normalizedKey].description.ar
              }
              recommendation={recommendations}
            />
            {index < diseases.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
};

export default MaladiesList;