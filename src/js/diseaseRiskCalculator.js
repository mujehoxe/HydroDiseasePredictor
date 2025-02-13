
const diseaseRiskCalculators = {
  pythium: (temperature, humidity, dissolvedOxygen, isOutside) => {
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
        risk += 0; 
    }

    // Risque lié à l'humidité
    if (humidity > 85) {
        risk += (humidity - 80) * 5; // Risque proportionnel
    } else {
      risk += 0; 
  }
  if (isOutside==false){
    risk=risk*0.6;
   }
    // Limiter le risque entre 0 et 100
    return Math.max(Math.min(risk, 100), 0);
},
    botrytis: (temperature, humidity, dissolvedOxygen, isOutside) => {
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
      if (isOutside==false){
        risk=risk*0.6;
       }
           return Math.round(Math.min(risk, 100));
    },
    xanthomonas: (temperature, humidity, dissolvedOxygen, isOutside) => {
      let risk = 0;
      if (temperature < 25 || temperature >-2){
        risk = -0.00399 * Math.pow(temperature, 4) 
        + 0.2243 * Math.pow(temperature, 3) 
        - 4.4602 * Math.pow(temperature, 2) 
        + 39.50 * temperature 
        - 109.09;
      } else {risk = 0; }
      
      if (humidity >= 90){
        risk += (53-(35/(humidity + 0.65)));
      }
      if (isOutside==false){
        risk=risk*0.6;
       }
           return Math.round(Math.min(risk, 100));
    },
    mildiou: (temperature, humidity, dissolvedOxygen, isOutside) => {
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
      if (isOutside==false){
        risk=risk*0.6;
       }
           return Math.round(Math.min(risk, 100));
    },
    oidium: (temperature, humidity, dissolvedOxygen, isOutside) => {
     let risk = 0;
      risk = 100 - Math.pow((temperature-18), 2);
      if (isOutside==false){
      risk=risk*0.6;
     }
     return Math.round(Math.max(risk), 0);
    },
  };
  
  export default diseaseRiskCalculators;
  