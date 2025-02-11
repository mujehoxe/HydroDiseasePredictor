
const diseaseRiskCalculators = {
  pythium: (temperature, humidity, dissolvedOxygen) => {
    let risk = 0;

    // Risque lié à la température
    if (temperature > 30) {
        risk += 100; // Risque maximal
    } else if (temperature > 25) {
        risk += (temperature - 25) * 20; // Risque proportionnel
    } else {
      risk+= 0;
    }

    // Risque lié à l'oxygène dissous
    if (dissolvedOxygen < 5) {
        risk += (5 - dissolvedOxygen)*15 ; // Risquye important si faible oxygène
    } else {
        risk += 0; // Risque proportionnel
    }

    // Risque lié à l'humidité
    if (humidity > 80) {
        risk += 50; // Risque élevé si humidité élevée
    } else if (humidity > 60) {
        risk += (humidity - 60) * 5; // Risque proportionnel
    }

    // Limiter le risque entre 0 et 100
    return Math.max(Math.min(risk, 100), 0);
},
    botrytis: (temperature, humidity) => {
      let risk = 0;
      if (temperature < 25 || temperature >-2){
        risk = -0.00108 * Math.pow(temperature, 4) 
           + 0.0286 * Math.pow(temperature, 3) 
           - 0.0982 * Math.pow(temperature, 2) 
           + 0.964 * temperature 
           + 12.03;
      } else {risk = 0; }
      
      if (humidity >= 90){
        risk += (53-(35/(humidity + 0.65)));
      }
           return Math.round(Math.min(risk, 100));
    },
    xanthomonas: (temperature, humidity) => {
      if (temperature < 20 || humidity < 50) return 0;
      if (temperature >= 20 && temperature <= 30 && humidity >= 50 && humidity <= 70) return 40;
      if (temperature > 30 && humidity > 70) return 70;
      else return 90;
    },
    mildiou: (temperature, humidity) => {
      let risk = 0;
      if (temperature < 24.1 || temperature >5){
        risk = -0.0056 * Math.pow(temperature, 4) 
        + 0.2793 * Math.pow(temperature, 3) 
        - 4.957 * Math.pow(temperature, 2) 
        + 40.10 * temperature 
        - 107.19;
      } else {risk = 0; }
      
      if (humidity >= 90){
        risk += (53-(35/(humidity + 0.65)));
      }
           return Math.round(Math.min(risk, 100));
    },
    oidium: (temperature, humidity) => {
     let risk = 0;
      risk = 100 - Math.pow((temperature-18), 2);
     return Math.round(Math.max(risk), 0);
    },
  };
  
  export default diseaseRiskCalculators;
  